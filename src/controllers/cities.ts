/**
 * @module Controllers
 */ /** */
import { loogger } from '../services/logger';

import { City } from '../models/city';

/**
 * @class CitiesController
 */
class CitiesController {
	constructor() {
		loogger.info('Instantiating cities Controller');
	}

	public revisitCityMemory = (cityId: number, cb: Function): void => {
		console.log(cityId);
		City.findOne({ cityId }, (findErr, record): void => {
			cb(null, record);
		});
		// cb(null, { success: 'request for city recieved' });
	}

	public travelToCity = (cityDetails: Object, cb: Function): void => {
		console.log(cityDetails);
		cb(null, { inserted: 'yeet' });
	}

	public changeCityDetails = (cityDetails: Object, cityId: number, cb: Function): void => {
		console.log(cityDetails);
		console.log(cityId);
		cb(null, { updated: 'yeet' });
	}

	public wipeCityDetails = (cityId: number, cb: Function): void => {
		console.log(cityId);
		cb(null, { deleted: 'yeet' });
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
