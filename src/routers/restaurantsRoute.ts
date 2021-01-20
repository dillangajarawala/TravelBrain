/**
 * @module Routers
 */ /** */
import * as express from 'express';
import { restaurantsController } from '../controllers/restaurants';

import { TravelBrainError } from '../utils/travelBrainError';
import { MappedErrors } from '../utils/mappedErrors';

/**
 * A class representing all '/...' routes
 * @class
 */
class RestaurantsRoute {
	/**
 * Router
 */
	public restaurantsRouter: express.Router = express.Router();

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
		 * GET - send data for a single restaurant
		 */
		this.restaurantsRouter.get('/show/:restaurantId', (req, res): void => {
			const { restaurantId } = req.params;
			if (Number.isInteger(Number.parseInt(restaurantId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			restaurantsController.revisitRestaurantMemory(
				Number.parseInt(restaurantId, 10),
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
		 * GET - retrieve list of restaurants
		 */
		this.restaurantsRouter.get('/all', (req, res): void => {
			restaurantsController.getAllRestaurants(
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
		 * GET - retrieve list of 10 most recent restaurants
		 */
		this.restaurantsRouter.get('/recent', (req, res): void => {
			const { num } = req.body;
			restaurantsController.getRecentRestaurants(num,
				(err: TravelBrainError, success): void => {
					if (err) {
						res.status(err.getHttpStatus()).json(err);
					} else {
						res.json(success);
					}
				});
		});

		/**
		 * GET - search restaurants based on a given param and value
		 */
		this.restaurantsRouter.get('/search', (req, res): void => {
			const { param } = req.body;
			const { value } = req.body;

			if (typeof param === 'undefined') {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'no search params given'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			restaurantsController.searchRestaurants(
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
		 * POST - add a new restaurant
		 */
		this.restaurantsRouter.post('/create', (req, res): void => {
			if (req.body.length === 0) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'POST body is empty.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			restaurantsController.eatAtRestaurant(
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
		 * PUT - update data for a restaurant
		 */
		this.restaurantsRouter.put('/edit/:restaurantId', (req, res): void => {
			const { restaurantId } = req.params;

			if (req.body.length === 0) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'PUT body is empty.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			if (Number.isInteger(Number.parseInt(restaurantId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			restaurantsController.changeRestaurantDetails(
				req.body, Number.parseInt(restaurantId, 10),
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
		 * DELETE - delete restaurant
		 */
		this.restaurantsRouter.delete('/delete/:restaurantId', (req, res): void => {
			const { restaurantId } = req.params;

			if (Number.isInteger(Number.parseInt(restaurantId, 10)) === false) {
				const error = new TravelBrainError(MappedErrors.GENERAL.INVALID_PARAM_DATA, {
					mess: 'Given id is not a valid number.'
				});

				res.status(error.getHttpStatus()).json(error);
				return;
			}

			restaurantsController.wipeRestaurantDetails(
				Number.parseInt(restaurantId, 10),
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
export const { restaurantsRouter } = new RestaurantsRoute();
