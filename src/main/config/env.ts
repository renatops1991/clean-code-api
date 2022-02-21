export default {
  mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3003,
  jwtSecret: process.env.JWT_SECRET || '73c90b52d6ed4534cbc8bad6306c4b3d'
}
