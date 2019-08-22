/**
 * @module Services
 */ /** */

import * as pino from 'pino';
import * as expressPinoLogger from 'express-pino-logger';

class Logger {
	stream: any;

	expressStream: { logger: { info: (arg0: string) => void}};

	loogger: any;

	public constructor() {
		this.stream = pino({
			level: process.env.LOG_LEVEL || 'info',
			prettyPrint: { colorize: true }
		});
		this.expressStream = expressPinoLogger({ logger: this.stream });
		this.loogger = this.expressStream.logger;
	}

	public info(message: string): void {
		this.expressStream.logger.info(message);
	}
}

export const { loogger } = new Logger();
