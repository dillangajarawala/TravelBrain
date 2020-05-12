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
import { CityVisit } from '../models/cityVisit';

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
					mess: `Unable to find city record with id ${cityId}.`
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
			mostRecentVisit: null,
			numRestaurantsEaten: 0,
			numSightsSeen: 0
		};
		City.create(cityRecord, (cityErr, record): void => {
			if (cityErr) {
				loogger.error(cityErr);
				const insertionError = new TravelBrainError(MappedErrors.MONGO.INSERTION_ERROR, {
					mess: 'Unable to insert record for new city'
				});
				cb(insertionError, { insertedCity: 'nope' });
			} else {
				cityVisitsController.newVisit(record._id, cityRecord.cityId, cityDetails, true, cb);
				this.latestCityId += 1;
			}
		});
	}

	public changeCityDetails = (cityDetails: Object, cityId: number, cb: Function): void => {
		City.replaceOne({ cityId }, cityDetails, (replaceErr, res): void => {
			if (replaceErr) {
				const updateError = new TravelBrainError(MappedErrors.MONGO.UPDATE_ERROR, {
					mess: `Unable to update record for city with id ${cityId}.`
				});
				cb(updateError, { updatedCity: 'nope' });
			} else {
				cb(null, { updatedCity: 'success' });
			}
		});
	}

	public wipeCityDetails = (cityId: number, cb: Function): void => {
		let deletedVisits = true;
		CityVisit.deleteMany({ cityId }, (delErr): void => {
			if (delErr) {
				deletedVisits = false;
				loogger.error(delErr);
				const deletionError = new TravelBrainError(MappedErrors.MONGO.DELETION_ERROR, {
					mess: `Unable to delete visits for city with id ${cityId}`
				});
				cb(deletionError, { deletedCity: 'nope' });
			}
		});
		if (deletedVisits) {
			City.deleteOne({ cityId }, (deleteErr): void => {
				if (deleteErr) {
					loogger.error('Unable to delete city record');
					const deletionError = new TravelBrainError(MappedErrors.MONGO.DELETION_ERROR, {
						mess: `Error wiping the city with id ${cityId} off the map`
					});
					cb(deletionError, { deletedCity: 'nope' });
				} else {
					cb(null, { deletedCity: 'success' });
				}
			});
		}
	}

	public getAllCities = (cb: Function): void => {
		City.find({}, (findErr, records): void => {
			if (findErr) {
				const findAllError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to get all city records'
				});
				cb(findAllError, { foundAllCities: 'nope' });
			} else {
				const cityRecords: ICity[] = [];
				for (let i = 0; i < records.length; i += 1) {
					const c = _.pick(records[i], this.cityFields);
					cityRecords.push(c);
				}
				cb(null, cityRecords);
			}
		});
	}

	public getRecentCities = (cb: Function): void => {
		City.find({}, null, { sort: { mostRecentVisit: -1 }, limit: 10 }, (findErr, records): void => {
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
		City.where(param).equals(value).exec((findErr, records): void => {
			if (findErr) {
				loogger.error('Error trying to search cities');
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to search cities'
				});
				cb(findError, { found: 'nope' });
			} else {
				const cities: ICity[] = [];
				for (let i = 0; i < records.length; i += 1) {
					const c = _.pick(records[i], this.cityFields);
					cities.push(c);
				}
				cb(null, { cities });
			}
		});
	}
}
/**
 *  City controller to handle all city data requests.
 */
export const citiesController = new CitiesController();
