import dotenv from 'dotenv'
dotenv.config();
export default {
    MONGO_DATABASE: process.env.MONGO_DATABASE || 'teknonimous_mern',
    MONGO_USER: process.env.MONGO_USER || 'json_h07',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'json_25032023_sx',
    MONGO_HOST: process.env.MONGO_HOST || '127.0.0.1',
    MONGO_PORT: process.env.MONGO_PORT || '27017',
    PORT: process.env.PORT || '3000'
}