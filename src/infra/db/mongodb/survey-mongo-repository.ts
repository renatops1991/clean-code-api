import { MongoHelper } from './mongo-helper'
import { QueryBuilder } from './query-builder'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyRepository, LoadSurveyByIdRepository } from '@/data/protocols/db'
import { AddSurveyParams } from '@/domain/usecases/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository
implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const collection = await MongoHelper.getCollection('surveys')
    await collection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const collection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveysResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)]
                  }
                }
              }
            },
            1
          ]
        }
      })
      .build()
    const surveysList = await collection.aggregate(query).toArray()
    return MongoHelper.mapCollection(surveysList)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const collection = await MongoHelper.getCollection('surveys')
    const survey = await collection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
