import logger from '../../logger';
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

    const command = new Command(name, handler);
    COMMANDS_MAP.set(name, command);
    return command;
};

/**
 * Use this for getting commands, but be aware of the moment of commands creation to avoid null return
 * @param name Name of the command excluding prefix
 * @returns {CommandHandler} Function for handling command
 */
const getCommand = (name: string) => {
    if (!COMMANDS_MAP.has('name')) {
        return null;
    }
    return COMMANDS_MAP.get(name);
};

/**
 * This is primary tool for getting commands if they exists
 *
 * ?? This function dynamically load commands if they exist in proper directory and cache them
 *
 * @param name
 * @returns
 */
export const getOrCreateCommand = async (name: string): Promise<Command> => {
    const existingCommand = getCommand(name);
    if (existingCommand) {
        return existingCommand;
    }

    try {
        const handler = await import(`./${name}`);
        return registerCommand(name, handler.default);
    } catch (e) {
        logger.error(e);
        return null;
    }
};

export default registerCommand;
