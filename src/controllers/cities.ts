/**
 * @module Controllers
 */ /** */
import * as _ from 'lodash';

import { loogger } from '../services/logger';
import { City, ICity } from '../models/city';
import { ICityDetails } from '../models/interfaces/ICityDetails';
import { MappedErrors } from '../utils/mappedErrors';
import { TravelBrainError } from '../utils/travelBrainError';
import { cityVisitsController } from './cityvisits';

/**
 * @class CitiesController
 */
class CitiesController {
	latestCityId: number;

	cityFields: string[];

	constructor() {
		City.findOne().sort({ cityId: -1 })
			.then((city): void => {
				this.latestCityId = city.cityId;
			})
			.catch((): void => {
				this.latestCityId = 0;
			});

		this.cityFields = ['cityId', 'name', 'country', 'state', 'mostRecentVisit', 'numRestaurantsEaten', 'numSightsSeen'];
		loogger.info('Instantiating cities Controller');
	}

	public revisitCityMemory = (cityId: number, cb: Function): void => {
		City.findOne({ cityId }, (findErr, record): void => {
			if (findErr) {
				loogger.error(findErr);
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to find city record'
				});
				cb(findError, { foundCity: 'nope' });
			} else {
				const neededAttrs: ICity = _.pick(record, this.cityFields);
				cb(null, neededAttrs);
			}
		});
	}

	public travelToCity = (cityDetails: ICityDetails, cb: Function): void => {
		const cityRecord: ICity = {
			cityId: this.latestCityId + 1,
			name: cityDetails.name,
			country: cityDetails.country,
			state: cityDetails.state || null,
			mostRecentVisit: cityDetails.endDate,
			numRestaurantsEaten: 0,
			numSightsSeen: 0
		};
		City.create(cityRecord, (cityErr, insertedCityRecord): void => {
			if (cityErr) {
				loogger.error(cityErr);
				const insertionError = new TravelBrainError(MappedErrors.MONGO.INSERTION_ERROR, {
					mess: 'Unable to insert record for new city'
				});
				cb(insertionError, { insertedCity: 'nope' });
			} else {
				cityVisitsController.newVisit(insertedCityRecord._id, cityDetails, cb);
				// do some city visit code here
			}
		});
	}

	public changeCityDetails = (cityDetails: Object, cityId: number, cb: Function): void => {
		console.log(cityDetails);
		console.log(cityId);
		cb(null, { updated: 'yeet' });
	}

	public wipeCityDetails = (cityId: number, cb: Function): void => {
		City.deleteOne({ cityId }, (deleteErr): void => {
			if (deleteErr) {
				loogger.error('Unable to delete city record');
				const deletionError = new TravelBrainError(MappedErrors.MONGO.DELETION_ERROR, {
					mess: `Error wiping the city with id ${cityId} off the map`
				});
				cb(deletionError, { deleted: 'Unable to delete city record' });
			} else {
				// delete city visits here
			}
		});
	}

	public getAllCities = (cb: Function): void => {
		cb(null, {});
	}

	public getRecentCities = (cb: Function): void => {
		City.find({ sort: { mostRecentVisit: -1 }, limit: 10 }, (findErr, records): void => {
			if (findErr) {
				loogger.error('Error trying to find 10 most recent cities');
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to find 10 most recently visited cities'
				});
				cb(findError, { found: 'nope' });
			} else {
				const cities: ICity[] = [];
				for (let i = 0; i < records.length; i += 1) {
					cities.push(_.pick(records[i], this.cityFields));
				}
				cb(null, { cities });
			}
		});
	}

	public searchCities = (param: string, value: string, cb: Function): void => {
		console.log(param);
		console.log(value);
		cb(null, {});
	}
}
/**
 *  City controller to handle all city data requests.
 */
export const citiesController = new CitiesController();
