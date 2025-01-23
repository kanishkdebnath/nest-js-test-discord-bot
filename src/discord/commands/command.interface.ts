import { ChatInputCommandInteraction } from 'discord.js';

export interface Command {
  name: string; // The slash command name
  description: string; // Command description
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>; // Execution logic
}
