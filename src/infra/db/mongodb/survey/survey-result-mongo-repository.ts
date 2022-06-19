import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/survey-result/db-survey-result-protocols'
import { MongoHelper, QueryBuilder } from '../helpers'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveysResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        createdAt: data.createdAt
      }
    }, {
      upsert: true
    })

    const surveyResult = await this.loadBySurveyId(data.surveyId)
    return surveyResult
  }

  private async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveysResults')
    const surveyResultQuery = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({ path: '$survey' })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          createdAt: '$survey.createdAt',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$_id.answer'
      })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [{
            $divide: ['$count', '$_id.total']
          }, 100]
        }
      }).group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          createdAt: '$_id.createdAt'
        },
        answers: {
          $push: '$_id.answer'
        }
      }).project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answers: '$answers'
      }).build()

    const surveyResult = await surveyResultCollection.aggregate(surveyResultQuery).toArray()
    return surveyResult?.length ? surveyResult[0] : null
  }
}
