/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';

export interface ICityVisit {
	cityId: number;
	startDate: Date;
	endDate: Date;
	notes: string;
	numSightsSeen: number;
	numRestaurantsEaten: number;
}

interface ICityVisitModel extends ICityVisit, mongoose.Document { }

/**
 * CityVisit Schema - Mongoose document.
 */
export const CityVisitSchema: mongoose.Schema = new mongoose.Schema({
	cityId: {
		type: Number,
		required: true
	},
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		required: true
	},
	notes: {
		type: String,
		required: false
	},
	numSightsSeen: {
		type: Number,
		required: true
	},
	numRestaurantsEaten: {
		type: Number,
		required: true
	}
}, {
	timestamps: {
		createdAt: 'createDate',
		updatedAt: 'lastUpdateDate'
	}
});

/**
 * The City Mongoose Model.
 */
export const CityVisit: mongoose.Model<ICityVisitModel> = mongoose.model<ICityVisitModel>('CityVisit', CityVisitSchema, 'cityvisits');
