import dotenv from 'dotenv'
dotenv.config();
export default {
    MONGO_DATABASE: process.env.MONGO_DATABASE || 'teknonimous_mern',
    MONGO_USER: process.env.MONGO_USER || 'json_h07',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'json_25032023_sx',
    MONGO_HOST: process.env.MONGO_HOST || '127.0.0.1',
    MONGO_PORT: process.env.MONGO_PORT || '27017',
    PORT: process.env.PORT || '3000',
    API_KEY: process.env.API_KEY || '6491fe59-a5a4-421a-81b4-8006f041764d',
    TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || '30d'
}