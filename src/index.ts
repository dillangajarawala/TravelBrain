/**
 * @module Main
 */ /** */
import * as mongoose from 'mongoose';
import * as config from 'config';

import { loogger } from './services/logger';

loogger.info('Instantiating TravelBrain: ');

import TravelBrain from './travelbrain'; // eslint-disable-line import/first

const application = new TravelBrain();

mongoose.connect(config.database.url, config.database.options);

application.listen();
