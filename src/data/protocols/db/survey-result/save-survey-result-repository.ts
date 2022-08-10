import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultParams): Promise<void>
}
