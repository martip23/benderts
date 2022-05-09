import 'dotenv/config';

import { Client } from 'discord.js';
import InteractionCreate from './Listeners/InteractionCreate';
import Ready from './Listeners/Ready';

console.log('Bot is starting...');

const token = process.env.BOT_TOKEN;
const client = new Client({
  intents: [],
});

client.login(token);

Ready(client);
InteractionCreate(client);

console.log(client);
