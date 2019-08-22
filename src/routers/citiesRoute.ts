/**
 * @module Routers
 */ /** */
import * as express from 'express';
import { citiesController } from '../controllers/cities';

import { TravelBrainError } from '../utils/travelBrainError';
import { MappedErrors } from '../utils/mappedErrors';

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
		/**
		 * GET - Scrape data for a single thirdPartyId.
		 */
		this.citiesRouter.get('/show/:cityId/', (req, res): void => {
			// Not ready yet
			const { cityId } = req.params;

			if (Number.isInteger(Number.parseInt(cityId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			citiesController.revisitCityMemory(
				cityId,
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				}
			);
		});
	}
}

/**
 * Express router to route things.
 */
export const { citiesRouter } = new CitiesRoute();
