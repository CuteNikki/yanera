import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import { env } from './env';

const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

const commands = [
  {
    name: 'ping',
    description: 'Replies with the ping counter',
  },
];

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

main();
