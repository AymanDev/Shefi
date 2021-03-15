import { CommandHandler } from '../types';

const COMMANDS_MAP = new Map<string, Command>();

class Command {
    name: string;
    handler: CommandHandler;

    constructor(name: string, handler: CommandHandler) {
        this.name = name;
        this.handler = handler;
    }
}

/**
 * Use this for registering bot commands, but be aware to register it only once!
 * @param command Command object with name and handler
 */
const registerCommand = (name: string, handler: CommandHandler) => {
    if (COMMANDS_MAP.has(name)) {
        throw new Error(`Command with name ${name} already exists!`);
    }

    COMMANDS_MAP.set(name, new Command(name, handler));
};

/**
 * Use this for getting commands, but be aware of the moment of commands creation to avoid null return
 * @param name Name of the command excluding prefix
 * @returns {CommandHandler} Function for handling command
 */
export const getCommand = (name: string) => {
    if (!COMMANDS_MAP.has('name')) {
        return null;
    }
    return COMMANDS_MAP.get(name);
};

export default registerCommand;
