import { MongoHelper } from '../helpers/mongo-helper'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyModel, AddSurveyRepository, LoadSurveyByIdRepository } from '@/data/usecases/survey/db-survey-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const collection = await MongoHelper.getCollection('surveys')
    await collection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const collection = await MongoHelper.getCollection('surveys')
    const surveysList = await collection.find().toArray()
    return surveysList
  }

  async loadById (id: string| ObjectId): Promise<SurveyModel> {
    const collection = await MongoHelper.getCollection('surveys')
    const survey = await collection.findOne({ _id: id })
    return survey
  }
}
