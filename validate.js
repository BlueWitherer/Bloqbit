console.log('Testing system...');

import dotenv from 'dotenv';

import { ClientModel } from './src/classes.js';
import StartClient from './src/index.js';

dotenv.config();

const botModel = new ClientModel();
botModel.token = process.env.TEST_TOKEN;
botModel.secret = process.env.TEST_SECRET;
botModel.rest.setToken(process.env.TEST_TOKEN);

const start = async () => {
    const src = new StartClient();
    return await src.activate(botModel, true);
};

(async () => {
    try {
        await start();
    } catch (error) {
        return console.error(error);
    };
})();