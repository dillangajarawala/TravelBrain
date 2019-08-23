/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';

export interface ICity {
	cityId: number;
	name: string;
}

interface ICityModel extends ICity, mongoose.Document { }

/**
 * City Schema - Mongoose document.
 */
export const CitySchema: mongoose.Schema = new mongoose.Schema({
	cityId: {
		type: Number
	},
	name: {
		type: String
	},
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
