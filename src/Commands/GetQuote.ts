import { BaseCommandInteraction, Client } from 'discord.js';

import { Command } from '../Command';
import axios from 'axios';

export const GetQuote: Command = {
  name: 'get-quote',
  description: 'Gets a Bender quote',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const user = interaction.member?.user.username;
    const content: string = (
      await axios({
        method: 'get',
        url: `https://bender.sierrasoftworks.com/api/v1/quote/bender`,
      })
    ).data.quote;

    await interaction.followUp({ content });
  },
};
