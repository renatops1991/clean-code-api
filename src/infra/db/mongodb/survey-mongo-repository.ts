import { MongoHelper } from './mongo-helper'
import { QueryBuilder } from './query-builder'
import {
  AddSurveyRepository,
  LoadSurveysRepository,
  CheckSurveyByIdRepository,
  LoadSurveyByIdRepository,
  LoadAnswersBySurveyRepository
} from '@/data/protocols/db'
import { AddSurvey } from '@/domain/usecases/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository
implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository {
  async add (surveyData: AddSurvey.Params): Promise<void> {
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

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const collection = await MongoHelper.getCollection('surveys')
    const survey = await collection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const collection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .build()
    const surveys = await collection.aggregate(query).toArray()
    return surveys[0]?.answers ?? []
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const collection = await MongoHelper.getCollection('surveys')
    const survey = await collection.findOne(
      { _id: new ObjectId(id) }, {
        projection: {
          _id: 1
        }
      }
    )
    return survey !== null
  }
}
