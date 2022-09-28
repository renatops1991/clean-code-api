
import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import env from '@/main/config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const { setUpApp } = await import ('./config/app')
    const app = await setUpApp()
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
