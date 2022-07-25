import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'
import { MongoHelper } from './mongo-helper'
import { QueryBuilder } from './query-builder'
import { ObjectId } from 'mongodb'
import round from 'mongo-round'

export class SurveyResultMongoRepository
implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveysResults'
    )
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId)
      },
      {
        $set: {
          answer: data.answer,
          createdAt: data.createdAt
        }
      },
      {
        upsert: true
      }
    )
  }

  async loadBySurveyId (
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveysResults'
    )
    const surveyResultQuery = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
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
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          createdAt: '$survey.createdAt',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        },
        currentAccountAnswer: {
          $push: {
            $cond: [
              { $eq: ['$data.accountId', accountId] },
              '$data.answer',
              null
            ]
          }
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer']
                      },
                      then: '$count',
                      else: 0
                    }
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer']
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total']
                          },
                          100
                        ]
                      },
                      else: 0
                    }
                  },
                  isCurrentAccountAnswer: {
                    $eq: ['$$item.answer', {
                      $arrayElemAt: ['$currentAccountAnswer', 0]
                    }]
                  }
                }
              ]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          createdAt: '$createdAt'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          createdAt: '$createdAt',
          answer: '$answers.answer',
          image: '$answers.image',
          isCurrentAccountAnswer: '$answers.isCurrentAccountAnswer'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: round('$count'),
          percent: round('$percent'),
          isCurrentAccountAnswer: '$_id.isCurrentAccountAnswer'
        }
      })
      .sort({
        'answer.count': -1
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          createdAt: '$createdAt'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answers: '$answers'
      })
      .build()

    const surveyResult = await surveyResultCollection
      .aggregate(surveyResultQuery)
      .toArray()
    return surveyResult.length ? surveyResult[0] : null
  }
}
