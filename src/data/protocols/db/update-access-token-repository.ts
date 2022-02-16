import { ObjectId } from 'mongodb'

export interface UpdateAccessTokenRepository{
  updateAccessToken(id: string | ObjectId, token: string): Promise<void>
}
