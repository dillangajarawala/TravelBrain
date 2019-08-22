/**
 * @module Routers
 */ /** */
import * as express from 'express';
import { citiesController } from '../controllers/cities';

// import { VarysError } from '../utils/varysError';
// import { MappedErrors } from '../utils/mappedErrors';

/**
 * A class representing all '/...' routes
 * @class
 */
class CitiesRoute {
	/**
 * Router
 */
	public citiesRouter: express.Router = express.Router();

	/**
 * Intitialization & registration
 */

	constructor() {
		this.loadRoutes();
	}

	/**
 * Loads all routes per context.
 */
	loadRoutes(): void {

	}
}

/**
 * Express router to route things.
 */
export const { citiesRouter } = new CitiesRoute();
