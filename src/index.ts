/**
 * @module Main
 */ /** */

import { loogger } from './services/logger';

loogger.info('Instantiating TravelBrain: ');

import TravelBrain from './travelbrain'; // eslint-disable-line import/first

const application = new TravelBrain();

// Rashid: broke out server from the app for testability
application.listen();
