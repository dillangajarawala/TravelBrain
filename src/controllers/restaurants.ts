/**
 * @module Controllers
 */ /** */
import * as _ from 'lodash';

import { loogger } from '../services/logger';
import { MappedErrors } from '../utils/mappedErrors';
import { TravelBrainError } from '../utils/travelBrainError';
import { Restaurant, IRestaurant } from '../models/restaurant';
import { IRestaurantDetails } from '../models/interfaces/IRestaurantDetails';

/**
 * @class RestaurantsController
 */
class RestaurantsController {
	latestRestaurantId: number;

	restaurantFields: string[];

	cityVisitFields: string[];

	cityFields: string[];

	constructor() {
		Restaurant.findOne().sort({ restaurantId: -1 })
			.then((restaurant): void => {
				this.latestRestaurantId = restaurant.restaurantId;
			})
			.catch((): void => {
				this.latestRestaurantId = 0;
			});

		this.restaurantFields = ['restaurantId', 'name', 'michelin', 'michelinStars', 'cuisine', 'visitDate', 'fromCityVisit', 'cityVisit', 'city', 'notes'];
		this.cityVisitFields = ['cityVisitId', 'startDate', 'endDate', 'notes', 'numRestaurantsEaten', 'numSightsSeen'];
		this.cityFields = ['cityId', 'name', 'country', 'state', 'mostRecentVisit', 'numRestaurantsEaten', 'numSightsSeen'];
		loogger.info('Instantiating restaurants Controller');
	}

	public revisitRestaurantMemory = (restaurantId: number, cb: Function): void => {
		Restaurant.findOne({ restaurantId }, (findErr, record): void => {
			if (findErr) {
				loogger.error(findErr);
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: `Unable to find restaurant record with id ${restaurantId}.`
				});
				cb(findError, { foundRestaurant: 'nope' });
			} else {
				console.log(record);
				const neededAttrs: IRestaurant = _.pick(record, this.restaurantFields);
				if (record.fromCityVisit) {
					neededAttrs.cityVisit = _.pick(neededAttrs.cityVisit, this.cityVisitFields);
				} else {
					neededAttrs.city = _.pick(neededAttrs.city, this.cityFields);
				}
				cb(null, neededAttrs);
			}
		}).populate('city').populate('cityVisit');
	}

	public eatAtRestaurant = (restaurantDetails: IRestaurantDetails, cb: Function): void => {
		const restaurantRecord = new Restaurant({
			restaurantId: this.latestRestaurantId + 1,
			name: restaurantDetails.name,
			michelin: restaurantDetails.michelin,
			michelinStars: restaurantDetails.michelinStars || null,
			cuisine: restaurantDetails.cuisine,
			visitDate: restaurantDetails.visitDate,
			fromCityVisit: restaurantDetails.fromCityVisit,
			cityVisit: restaurantDetails.fromCityVisit ? restaurantDetails.refId : null,
			city: !restaurantDetails.fromCityVisit ? restaurantDetails.refId : null,
			notes: restaurantDetails.notes
		});
		restaurantRecord.save((restaurantErr): void => {
			if (restaurantErr) {
				loogger.error(restaurantErr);
				const insertionError = new TravelBrainError(MappedErrors.MONGO.INSERTION_ERROR, {
					mess: 'Unable to insert record for new restaurant'
				});
				cb(insertionError, { insertedRestaurant: 'nope' });
			} else {
				this.latestRestaurantId += 1;
				cb(null, { insertedRestaurant: 'success' });
			}
		});
	}

	public changeRestaurantDetails = (restaurantDetails: IRestaurantDetails, restaurantId: number, cb: Function): void => {
		Restaurant.replaceOne({ restaurantId }, restaurantDetails, (replaceErr): void => {
			if (replaceErr) {
				const updateError = new TravelBrainError(MappedErrors.MONGO.UPDATE_ERROR, {
					mess: `Unable to update record for restaurant with id ${restaurantId}.`
				});
				cb(updateError, { updatedRestaurant: 'nope' });
			} else {
				cb(null, { updatedRestaurant: 'success' });
			}
		});
	}

	public wipeRestaurantDetails = (restaurantId: number, cb: Function): void => {
		Restaurant.deleteOne({ restaurantId }, (deleteErr): void => {
			if (deleteErr) {
				loogger.error('Unable to delete restaurant record');
				const deletionError = new TravelBrainError(MappedErrors.MONGO.DELETION_ERROR, {
					mess: `Error wiping the restaurant with id ${restaurantId} off the map`
				});
				cb(deletionError, { deletedRestaurant: 'nope' });
			} else {
				cb(null, { deletedRestaurant: 'success' });
			}
		});
	}

	public getAllRestaurants = (cb: Function): void => {
		Restaurant.find({}, (findErr, records): void => {
			if (findErr) {
				const findAllError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to get all restaurant records'
				});
				cb(findAllError, { foundAllRestaurants: 'nope' });
			} else {
				const restaurants: IRestaurant[] = [];
				for (let i = 0; i < records.length; i += 1) {
					const c = _.pick(records[i], this.restaurantFields);
					if (records[i].fromCityVisit) {
						c.cityVisit = _.pick(c.cityVisit, this.cityVisitFields);
					} else {
						c.city = _.pick(c.city, this.cityFields);
					}
					restaurants.push(c);
				}
				cb(null, restaurants);
			}
		}).populate('city').populate('cityVisit');
	}

	public getRecentRestaurants = (num: number, cb: Function): void => {
		Restaurant.find({}, null, { sort: { visitDate: -1 }, limit: num }, (findErr, records): void => {
			if (findErr) {
				loogger.error(`Error trying to find ${num} most recent restaurants`);
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: `Unable to find ${num} most recently visited restaurants`
				});
				cb(findError, { found: 'nope' });
			} else {
				const restaurants: IRestaurant[] = [];
				for (let i = 0; i < records.length; i += 1) {
					const c = _.pick(records[i], this.restaurantFields);
					if (records[i].fromCityVisit) {
						c.cityVisit = _.pick(c.cityVisit, this.cityVisitFields);
					} else {
						c.city = _.pick(c.city, this.cityFields);
					}
					restaurants.push(c);
				}
				cb(null, restaurants);
			}
		}).populate('city').populate('cityVisit');
	}

	public searchRestaurants = (param: string, value: string, cb: Function): void => {
		Restaurant.where(param).equals(value).populate('city').populate('cityVisit')
			.exec((findErr, records): void => {
				if (findErr) {
					loogger.error('Error trying to search restaurants');
					const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
						mess: 'Unable to search restaurants'
					});
					cb(findError, { found: 'nope' });
				} else {
					const restaurants: IRestaurant[] = [];
					for (let i = 0; i < records.length; i += 1) {
						const c = _.pick(records[i], this.restaurantFields);
						if (records[i].fromCityVisit) {
							c.cityVisit = _.pick(c.cityVisit, this.cityVisitFields);
						} else {
							c.city = _.pick(c.city, this.cityFields);
						}
						restaurants.push(c);
					}
					cb(null, restaurants);
				}
			});
	}
}
/**
 *  Restaurant controller to handle all restaurant data requests.
 */
export const restaurantsController = new RestaurantsController();
