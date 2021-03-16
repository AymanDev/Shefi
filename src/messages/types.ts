import { Message } from 'discord.js';

export type CommandHandler = (message: Message, clearedContent: string) => Promise<void>;
