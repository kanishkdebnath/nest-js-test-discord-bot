import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { CommandsModule } from './commands/command.module';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [ConfigModule, CommandsModule, DiscoveryModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
