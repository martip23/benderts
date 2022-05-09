import { Command } from './Command';
import { GetQuote } from './Commands/GetQuote';
import { Hello } from './Commands/Hello';

export const Commands: Command[] = [Hello, GetQuote];
