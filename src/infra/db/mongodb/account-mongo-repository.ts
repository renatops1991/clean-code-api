import { MongoHelper } from './mongo-helper'
import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols/db/account'
import { AddAccount } from '@/domain/usecases'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository,
    CheckAccountByEmailRepository {
  async add (
    accountData: AddAccount.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const resultAccount = await accountCollection.findOne({
      _id: result.insertedId
    })
    return resultAccount !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const resultAccount = await accountCollection.findOne(
      { email },
      {
        projection: {
          _id: 1,
          name: 1,
          password: 1
        }
      }
    )
    return resultAccount && MongoHelper.map(resultAccount)
  }

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const resultAccount = await accountCollection.findOne(
      { email },
      {
        projection: {
          _id: 1
        }
      }
    )
    return resultAccount !== null
  }

  async updateAccessToken (id: ObjectId, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken: token
        }
      }
    )
  }

  async loadByToken (
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const resultAccount = await accountCollection.findOne(
      {
        accessToken: token,
        $or: [
          {
            role
          },
          {
            role: 'admin'
          }
        ]
      },
      {
        projection: {
          _id: 1
        }
      }
    )
    return resultAccount && MongoHelper.map(resultAccount)
  }
}
