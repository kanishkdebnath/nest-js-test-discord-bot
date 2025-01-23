import { Module } from '@nestjs/common';
import { PingCommand } from './ping.command';

@Module({
  providers: [PingCommand], // Add new commands here as providers
  exports: [PingCommand], // Export commands for use in DiscordService
})
export class CommandsModule {}
