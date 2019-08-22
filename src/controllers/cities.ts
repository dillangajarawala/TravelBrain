/**
 * @module Controllers
 */ /** */

import * as mongoose from 'mongoose';
import * as config from 'config';
import * as _ from 'lodash';

/**
 * @class CitiesController
 */
class CitiesController {
	constructor() {
		console.log('cities Controller');
	}

	public revisitCityMemory = (cityId: number, cb: Function): void => {
		console.log(cityId);
		cb(null, { success: 'request for city recieved' });
	}
}
/**
 *  City controller to handle all city data requests.
 */
export const citiesController = new CitiesController();
