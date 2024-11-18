process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

console.log('Starting up system...');

const dotenv = require("dotenv");

const { ClientModel } = require("./src/classes.js");
const StartClient = require("./src/index.js");

dotenv.config();

const botModel = new ClientModel();
botModel.rest.setToken(process.env.PUBLIC_TOKEN);

const start = async () => {
    const src = new StartClient();
    return await src.activate(botModel, false);
};

(async () => {
    try {
        await start();
    } catch (error) {
        return console.error(error);
    };
})();