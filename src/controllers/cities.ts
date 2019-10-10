/**
 * @module Controllers
 */ /** */
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
			.catch((err): void => {
				this.latestCityId = 1;
			});
		loogger.info('Instantiating cities Controller');
	}

	public revisitCityMemory = (cityId: number, cb: Function): void => {
		console.log(cityId);
		City.findOne({ cityId }, (findErr, record): void => {
			cb(null, record);
		});
	}

	public travelToCity = (cityDetails: ICityDetails, cb: Function): void => {
		console.log(this.latestCityId);
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
				const insertionError = new TravelBrainError(MappedErrors.MONGO.INSERTION_ERROR, {
					mess: 'Unable to insert record for new city'
				});
				cb(insertionError, { insertedCity: 'nope' });
			} else {
				const newCityVisit: ICityVisit = {
					city: insertedCityRecord._id,
					startDate: cityDetails.startDate,
					endDate: cityDetails.endDate,
					notes: cityDetails.notes,
					numSightsSeen: 0,
					numRestaurantsEaten: 0
				};
				CityVisit.create(newCityVisit, (cityVisitErr): void => {
					if (cityVisitErr) {
						console.log(cityVisitErr);
						const insertionError = new TravelBrainError(MappedErrors.MONGO.INSERTION_ERROR, {
							mess: 'Unable to insert record for new city visit'
						});
						cb(insertionError, { insertedVisit: 'nope' });
					} else {
						cb(null, { inserted: 'success' });
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
		console.log(cityId);
		City.deleteOne({ cityId }, (deleteErr): void => {
			if (deleteErr) {
				console.log('Unable to delete city record');
				const deletionError = new TravelBrainError(MappedErrors.MONGO.DELETION_ERROR, {
					mess: `Error wiping the city with id ${cityId} off the map`
				});
				cb(deletionError, { deleted: 'Unable to delete city record' });
			} else {
				cb(null, { deleted: 'City Record Deleted' });
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
