const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4200,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb+srv://gi:mongoDB21@cluster0.pmtmd.mongodb.net/IReporting?retryWrites=true&w=majority" ||
    "mongodb://" +
      (process.env.IP || "localhost") +
      ":" +
      (process.env.MONGO_PORT || "27017") +
      "/mernproject",
};
