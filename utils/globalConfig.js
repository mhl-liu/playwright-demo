import dotenv from 'dotenv';
dotenv.config();

export const config = {
    baseUrl: process.env.BASE_URL,
    env: process.env.ENV || 'test',

};