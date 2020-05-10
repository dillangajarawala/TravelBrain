/**
 * @module Routers
 */ /** */
import * as express from 'express';
import { cityVisitsController } from '../controllers/cityvisits';

import { TravelBrainError } from '../utils/travelBrainError';
import { MappedErrors } from '../utils/mappedErrors';

/**
 * A class representing all '/...' routes
 * @class
 */
class CityVisitsRoute {
	/**
 * Router
 */
	public cityVisitsRouter: express.Router = express.Router();

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
		 * GET - send data for a single city visit
		 */
		this.cityVisitsRouter.get('/show/:cityVisitId', (req, res): void => {
			const { cityVisitId } = req.params;
			if (Number.isInteger(Number.parseInt(cityVisitId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			cityVisitsController.showVisit(
				Number.parseInt(cityVisitId, 10),
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
		 * GET - retrieve list of city visits
		 */
		this.cityVisitsRouter.get('/all', (req, res): void => {
			cityVisitsController.getAllVisits(
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
		this.cityVisitsRouter.get('/recent', (req, res): void => {
			cityVisitsController.getRecentCityVisits(
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
		 * GET - search city visits based on a given param and value
		 */
		this.cityVisitsRouter.get('/search', (req, res): void => {
			const { param } = req.body;
			const { value } = req.body;

			if (typeof param === 'undefined') {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'no search params given'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			cityVisitsController.searchCityVisits(
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
		 * POST - add a new city visit
		 */
		this.cityVisitsRouter.post('/new', (req, res): void => {
			if (req.body.length === 0) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'POST body is empty.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			cityVisitsController.newVisit(
				req.cityId,
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
		 * PUT - update data for a city visit
		 */
		this.cityVisitsRouter.post('/edit/:cityVisitId', (req, res): void => {
			const { cityVisitId } = req.params;

			if (req.body.length === 0) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'PUT body is empty.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			if (Number.isInteger(Number.parseInt(cityVisitId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			cityVisitsController.changeCityVisitDetails(
				req.body, Number.parseInt(cityVisitId, 10),
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
		 * DELETE - delete city visit
		 */
		this.cityVisitsRouter.delete('/delete/:cityVisitId', (req, res): void => {
			const { cityVisitId } = req.params;

			if (Number.isInteger(Number.parseInt(cityVisitId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			cityVisitsController.forgetVisit(
				Number.parseInt(cityVisitId, 10),
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
export const { cityVisitsRouter } = new CityVisitsRoute();
