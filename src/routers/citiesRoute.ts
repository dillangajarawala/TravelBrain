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
		 * GET - send data for a single city
		 */
		this.citiesRouter.get('/show/:cityId', (req, res): void => {
			const { cityId } = req.params;

			if (Number.isInteger(Number.parseInt(cityId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			citiesController.revisitCityMemory(
				Number.parseInt(cityId, 10),
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				}
			);
		});

		/**
		 * GET - retrieve list of cities
		 */
		this.citiesRouter.get('/all', (req, res): void => {
			citiesController.getAllCities(
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				}
			);
		});

		/**
		 * GET - retrieve list of 10 most recent cities
		 */
		this.citiesRouter.get('/recent', (req, res): void => {
			citiesController.getRecentCities(
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				}
			);
		});

		/**
		 * GET - search cities based on a given param and value
		 */
		this.citiesRouter.get('/search', (req, res): void => {
			const { param } = req.body;
			const { value } = req.body;

			if (typeof param === 'undefined') {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'no search params given'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			citiesController.searchCities(
				param, value,
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				}
			);
		});

		/**
		 * POST - add a new city
		 */
		this.citiesRouter.post('/new', (req, res): void => {
			if (req.body.length === 0) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'POST body is empty.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			citiesController.travelToCity(
				req.body,
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				}
			);
		});

		/**
		 * PUT - update data for a city
		 */
		this.citiesRouter.post('/edit/:cityId', (req, res): void => {
			const { cityId } = req.params;

			if (req.body.length === 0) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'PUT body is empty.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			if (Number.isInteger(Number.parseInt(cityId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			citiesController.changeCityDetails(
				req.body, Number.parseInt(cityId, 10),
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				}
			);
		});

		/**
		 * DELETE - delete city
		 */
		this.citiesRouter.delete('/delete/:cityId', (req, res): void => {
			const { cityId } = req.params;

			if (Number.isInteger(Number.parseInt(cityId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			citiesController.wipeCityDetails(
				Number.parseInt(cityId, 10),
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
