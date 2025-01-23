import { Injectable } from '@nestjs/common';
import { Command } from './command.interface';
import { ChatInputCommandInteraction } from 'discord.js';

@Injectable()
export class PingCommand implements Command {
  name = 'ping';
  description = 'Replies with Pong!';

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('Pong!');
  }
}
