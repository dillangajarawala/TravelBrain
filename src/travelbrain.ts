/**
 * @module Main
 */ /** */

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as config from 'config';
import * as morgan from 'morgan';

import * as http from 'http';

import { citiesRouter } from './routers/citiesRoute';
import { loogger } from './services/logger';
import { cityVisitsRouter } from './routers/cityVisitsRoute';
import { restaurantsRouter } from './routers/restaurantsRoute';

export const app: express.Application = express();

/**
 * Main Application.
 * This is where we do initialization of the app
 * @class TravelBrain
 */
class TravelBrain {
	/**
 * Start app with relevant config, middleware, routes
 * @param config: Environment config object
 */
	public constructor() {
		this.loadConfig();
		this.loadMiddleWare();
		this.loadRoutes();
	}

	/**
 * Load all relevant configuration for app.
 */
	private loadConfig(): void {

	}

	getApp(): express.Application {
		return app;
	}

	/**
 * Load all relevant Middleware for app.
 */
	loadMiddleWare(): void {
		// serve favicon.ico
		app.use(express.static('public'));

		// body parser
		app.use(bodyParser.urlencoded({
			extended: true
		}));
		app.use(bodyParser.json());

		app.use(cors());

		// Adds simple request logging to all routes - HTTP status, size, and response time
		app.use(morgan('tiny', {
			stream: {
				write: (message): void => {
					loogger.info(message);
				}
			}
		}));
	}

	/**
 * Load all relevant routes for app.
 */
	private loadRoutes(): void {
		// user router
		app.use('/api/cities', citiesRouter);
		app.use('/api/cityvisits', cityVisitsRouter);
		app.use('/api/restaurants', restaurantsRouter);

		// Add a route for root for the KeepAlive thing.
		app.get('/', (req, res, next): void => {
			res.json({ app: 'travelbrain' });
		});
	}

	/**
 * Start listening on given port for app.
 * @param port - listen on port
 */
	listen(port: number = config.port): void {
		http.createServer(app).listen(process.env.PORT || port, () => {
			loogger.info({}, `Listening on ${config.port}`);
		});
	}
}

export default TravelBrain;
