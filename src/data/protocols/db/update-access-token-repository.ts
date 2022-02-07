import { ObjectId } from 'mongodb'

export interface UpdateAccessTokenRepository{
  updateAccessToken(id: ObjectId, token: string): Promise<void>
}
