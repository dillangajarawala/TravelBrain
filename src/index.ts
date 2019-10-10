/**
 * @module Main
 */ /** */
import * as mongoose from 'mongoose';
import * as config from 'config';

import { loogger } from './services/logger';

loogger.info('Instantiating TravelBrain: ');

import TravelBrain from './travelbrain'; // eslint-disable-line import/first

const application = new TravelBrain();

mongoose.connect(config.database.url, config.database.options)
	.then((): void => {
		loogger.info('Mongo Connected');
		application.listen();
	})
	.catch((): void => {
		loogger.error('Error connecting to mongo');
		process.exit(1);
	});
