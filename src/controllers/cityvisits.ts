/**
 * @module Controllers
 */ /** */
import * as _ from 'lodash';
import { Types } from 'mongoose';
import { CityVisit, ICityVisit } from '../models/cityVisit';
import { ICityDetails } from '../models/interfaces/ICityDetails';
import { loogger } from '../services/logger';
import { MappedErrors } from '../utils/mappedErrors';
import { TravelBrainError } from '../utils/travelBrainError';
import { City } from '../models/city';


/**
 * @class CityVisitsController
 */
class CityVisitsController {
	latestCityVisitId: number;

	cityVisitFields: string[];

	cityFields: string[];

	constructor() {
		CityVisit.findOne().sort({ cityVisitId: -1 })
			.then((cityVisit): void => {
				this.latestCityVisitId = cityVisit.cityVisitId;
			})
			.catch((): void => {
				this.latestCityVisitId = 0;
			});

		this.cityVisitFields = ['cityVisitId', 'city', 'startDate', 'endDate', 'notes', 'numRestaurantsEaten', 'numSightsSeen'];
		this.cityFields = ['cityId', 'name', 'country', 'state', 'mostRecentVisit', 'numRestaurantsEaten', 'numSightsSeen'];
		loogger.info('Instantiating cityVisits Controller');
	}

	public getAllVisits = (cb: Function): void => {
		CityVisit.find({}, (findErr, records): void => {
			if (findErr) {
				const findAllError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to get all city visit records'
				});
				cb(findAllError, { foundAllVisits: 'nope' });
			} else {
				const visitRecords: ICityVisit[] = [];
				for (let v = 0; v < records.length; v += 1) {
					const r = _.pick(records[v], this.cityVisitFields);
					r.city = _.pick(r.city, this.cityFields);
					visitRecords.push(r);
				}
				cb(null, visitRecords);
			}
		}).populate('city');
	}

	public newVisit = (cityRefId: Types.ObjectId, cityId: number, visit: ICityDetails, newCity: boolean, cb: Function): void => {
		const visitRecord = {
			cityVisitId: this.latestCityVisitId + 1,
			city: cityRefId,
			cityId,
			startDate: visit.startDate,
			endDate: visit.endDate,
			notes: visit.notes,
			numRestaurantsEaten: 0,
			numSightsSeen: 0
		};
		const insertedBoth = { insertedAndUpdatedCity: 'success', insertedVisit: 'success' };
		const insertedOne = { updatedCity: 'success', insertedVisit: 'success' };
		const didntInsertBoth = { insertedCity: 'success', insertedVisit: 'nope' };
		const didntInsertAndUpdate = { updatedCity: 'nope', insertedVisit: 'success' };
		CityVisit.create(visitRecord, (visitErr, insertedVisitRecord: ICityVisit): void => {
			if (visitErr) {
				loogger.error(visitErr);
				const insertionError = new TravelBrainError(MappedErrors.MONGO.INSERTION_ERROR, {
					mess: 'Unable to insert record for new city visit'
				});
				if (newCity) {
					cb(insertionError, didntInsertBoth);
				} else {
					cb(insertionError, { insertedVisit: 'nope' });
				}
			} else {
				this.latestCityVisitId += 1;
				City.findByIdAndUpdate(cityRefId, { mostRecentVisit: visit.endDate }, (updateErr, res): void => {
					if (updateErr) {
						loogger.error(updateErr);
						const updError = new TravelBrainError(MappedErrors.MONGO.UPDATE_ERROR, {
							mess: 'Unable to update most recent visit for city'
						});
						if (newCity) {
							cb(updError, didntInsertBoth);
						} else {
							cb(updError, didntInsertAndUpdate);
						}
					} else if (newCity) {
						cb(null, insertedBoth);
					} else {
						cb(null, insertedOne);
					}
				});
			}
		});
	}

	public showVisit = (cityVisitId: number, cb: Function): void => {
		CityVisit.findOne({ cityVisitId }, (findErr, record): void => {
			console.log(record);
			if (findErr) {
				loogger.error(findErr);
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to find visit record'
				});
				cb(findError, { foundVisit: 'nope' });
			} else {
				const neededAttrs: ICityVisit = _.pick(record, this.cityVisitFields);
				neededAttrs.city = _.pick(neededAttrs.city, this.cityFields);
				cb(null, neededAttrs);
			}
		}).populate('city');
	}

	public updateCityVisit = (cityVisitDetails: Object, cityVisitId: number, cb: Function): void => {
		CityVisit.replaceOne({ cityVisitId }, cityVisitDetails, (replaceErr, res): void => {
			if (replaceErr) {
				const updateError = new TravelBrainError(MappedErrors.MONGO.UPDATE_ERROR, {
					mess: `Unable to update record for city visit with id ${cityVisitId}.`
				});
				cb(updateError, { updatedCityVisit: 'nope' });
			} else {
				cb(null, { updatedCityVisit: 'success' });
			}
		});
	}

	public forgetVisit = (cityVisitId: number, cb: Function): void => {
		CityVisit.deleteOne({ cityVisitId }, (deleteErr): void => {
			if (deleteErr) {
				const delErr = new TravelBrainError(MappedErrors.MONGO.DELETION_ERROR, {
					mess: 'Unable to delete visit record'
				});
				cb(delErr, { deletedVisit: 'nope' });
			} else {
				cb(null, { deletedVisit: 'success' });
			}
		});
	}

	public getRecentCityVisits = (cb: Function): void => {
		CityVisit.find({}, null, { sort: { endDate: -1 }, limit: 10 }, (findErr, records): void => {
			if (findErr) {
				loogger.error('Error trying to find 10 most recent city visits');
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to find 10 most recent visits'
				});
				cb(findError, { found: 'nope' });
			} else {
				const cityVisits: ICityVisit[] = [];
				for (let i = 0; i < records.length; i += 1) {
					const c = _.pick(records[i], this.cityVisitFields);
					c.city = _.pick(c.city, this.cityFields);
					cityVisits.push(c);
				}
				cb(null, { cityVisits });
			}
		});
	}

	public searchCityVisits = (param: string, value: string, cb: Function): void => {
		CityVisit.where(param).equals(value).exec((findErr, records): void => {
			if (findErr) {
				loogger.error('Error trying to search city visits');
				const findError = new TravelBrainError(MappedErrors.MONGO.FIND_ERROR, {
					mess: 'Unable to search city visits'
				});
				cb(findError, { found: 'nope' });
			} else {
				const cityVisits: ICityVisit[] = [];
				for (let i = 0; i < records.length; i += 1) {
					const c = _.pick(records[i], this.cityVisitFields);
					c.city = _.pick(c.city, this.cityFields);
					cityVisits.push(records[i]);
				}
				cb(null, { cityVisits });
			}
		});
	}
}
/**
 *  CityVisit controller to handle all cityvisit data requests.
 */
export const cityVisitsController = new CityVisitsController();
