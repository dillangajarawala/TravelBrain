/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';
import { ICity } from './city';

export interface ICityVisit {
	city: ICity;
	visitDate: Date;
}

interface ICityVisitModel extends ICityVisit, mongoose.Document { }

/**
 * CityVisit Schema - Mongoose document.
 */
export const CityVisitSchema: mongoose.Schema = new mongoose.Schema({
	cityId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	visitDate: {
		type: Date,
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
