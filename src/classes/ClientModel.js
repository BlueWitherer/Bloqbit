import SysAssets from '../assets.json' with { type: 'json' };

import dotenv from 'dotenv';

import { Client, Collection, IntentsBitField, Partials  } from 'discord.js';
import { REST  } from '@discordjs/rest';
import BotDatabase from './BotDatabase.js';

dotenv.config();

/**
 * @class Bot model.
 */
export default class ClientModel {
    constructor() {
        this.online = false;

        this.token = process.env.PUBLIC_TOKEN;
        this.secret = process.env.PUBLIC_SECRET;

        this.dev_wh = process.env.LOG_WH;

        this.db = new BotDatabase();

        this.commands = [];
        this.moderation = [];

        this.assets = SysAssets;

        this.rest = new REST();
        this.cmds = new Collection();

        this.client = new Client({
            intents: [
                IntentsBitField.Flags.GuildEmojisAndStickers,
                IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildIntegrations,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildWebhooks,
                IntentsBitField.Flags.GuildModeration,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.GuildMessageTyping,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.DirectMessages,
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Reaction,
                Partials.ThreadMember,
            ],
        });

        return this;
    };
};