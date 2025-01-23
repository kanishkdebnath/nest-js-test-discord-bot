import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
  REST,
  Routes,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { Command } from './commands/command.interface';
import { DiscoveryService } from '@nestjs/core';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly client: Client;
  private readonly commands: Command[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly discoveryService: DiscoveryService, // To dynamically load providers
  ) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });
  }

  async onModuleInit() {
    this.loadCommands();
    await this.registerCommands();
    this.setupEventHandlers();
  }

  private loadCommands() {
    const commandProviders = this.discoveryService
      .getProviders()
      .filter(
        (provider) =>
          provider.instance &&
          provider.instance['name'] &&
          provider.instance['description'],
      );

    for (const provider of commandProviders) {
      const command = provider.instance as Command;
      this.commands.push(command);
    }

    console.log(`Loaded ${this.commands.length} commands.`);
  }

  private async registerCommands() {
    const discordToken = this.configService.get<string>('DISCORD_TOKEN');
    if (!discordToken) {
      throw new Error('Discord token is not defined.');
    }

    const rest = new REST({ version: '10' }).setToken(discordToken);

    const commands = this.commands.map((command) => ({
      name: command.name,
      description: command.description,
    }));

    try {
      console.log('Started refreshing application (/) commands.');
      const clientID = this.configService.get<string>('CLIENT_ID');

      if (!clientID) {
        throw new Error('Client ID is not defined');
      }

      await rest.put(Routes.applicationCommands(clientID), {
        body: commands,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  }

  private setupEventHandlers() {
    this.client.login(this.configService.get<string>('DISCORD_TOKEN'));

    this.client.once('ready', () => {
      console.log(`${this.client.user?.tag} is online!`);
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const command = this.commands.find(
        (cmd) => cmd.name === interaction.commandName,
      );

      if (command) {
        await command.execute(interaction as ChatInputCommandInteraction);
      }
    });
  }
}
