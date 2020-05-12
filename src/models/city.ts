/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';

export interface ICity {
	cityId: number;
	name: string;
	country: string;
	state: string;
	mostRecentVisit: Date;
	numSightsSeen: number;
	numRestaurantsEaten: number;
}

interface ICityModel extends ICity, mongoose.Document { }

/**
 * City Schema - Mongoose document.
 */
export const CitySchema: mongoose.Schema = new mongoose.Schema({
	cityId: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	country: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: false
	},
	mostRecentVisit: {
		type: Date,
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
export const City: mongoose.Model<ICityModel> = mongoose.model<ICityModel>('City', CitySchema, 'cities');
