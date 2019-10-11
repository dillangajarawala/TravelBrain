/**
 * @module Controllers
 */ /** */
import * as _ from 'lodash';

import { loogger } from '../services/logger';
import { City, ICity } from '../models/city';
import { ICityDetails } from '../models/interfaces/ICityDetails';
import { MappedErrors } from '../utils/mappedErrors';
import { TravelBrainError } from '../utils/travelBrainError';
import { ICityVisit, CityVisit } from '../models/cityVisit';

/**
 * @class CitiesController
 */
class CitiesController {
	latestCityId: number;

	constructor() {
		City.findOne().sort({ cityId: -1 })
			.then((city): void => {
				this.latestCityId = city.cityId;
			})
			.catch((): void => {
				this.latestCityId = 0;
			});
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
				const neededAttrs = _.pick(record, ['cityId', 'name', 'country', 'state', 'numRestaurantsEaten', 'numSightsSeen']);
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
				const newCityVisit: ICityVisit = {
					cityId: this.latestCityId + 1,
					startDate: cityDetails.startDate,
					endDate: cityDetails.endDate,
					notes: cityDetails.notes,
					numSightsSeen: 0,
					numRestaurantsEaten: 0
				};
				CityVisit.create(newCityVisit, (cityVisitErr): void => {
					if (cityVisitErr) {
						loogger.error(cityVisitErr);
						const insertionError = new TravelBrainError(MappedErrors.MONGO.INSERTION_ERROR, {
							mess: 'Unable to insert record for new city visit'
						});
						cb(insertionError, { insertedVisit: 'nope' });
					} else {
						cb(null, { inserted: 'success' });
						this.latestCityId = this.latestCityId + 1;
					}
				});
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
				CityVisit.deleteMany({ cityId }, (deleteVisitsErr): void => {
					if (deleteVisitsErr) {
						loogger.error('Unable to delete associated city visits');
					} else {
						cb(null, { deleted: 'City Record and Associated Visits Deleted' });
					}
				});
			}
		});
	}

	public getAllCities = (cb: Function): void => {
		cb(null, {});
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
