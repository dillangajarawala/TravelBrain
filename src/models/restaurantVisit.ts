/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';
import { IRestaurant } from './restaurant';
import { ICityVisit } from './cityVisit';

export interface IRestaurantVisit {
	restaurantVisitId: number;
	restaurant: IRestaurant;
	restaurantId: number;
	visitDate: Date;
	fromCity: boolean;
	cityVisit: ICityVisit;
	notes: string;
}

interface IRestaurantVisitModel extends IRestaurantVisit, mongoose.Document { }

/**
 * RestaurantVisit Schema - Mongoose document.
 */
export const RestaurantVisitSchema: mongoose.Schema = new mongoose.Schema({
	restaurantVisitId: {
		type: Number,
		required: true
	},
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant',
		required: true
	},
	RestaurantId: {
		type: Number,
		required: true
	},
	visitDate: {
		type: Date,
		required: true
	},
	fromCity: {
		type: Boolean,
		required: true
	},
	cityVisit: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'CityVisit',
		required: false
	},
	notes: {
		type: String,
		required: false
	}
}, {
	timestamps: {
		createdAt: 'createDate',
		updatedAt: 'lastUpdateDate'
	}
});

/**
 * The RestaurantVisit Mongoose Model.
 */
export const RestaurantVisit: mongoose.Model<IRestaurantVisitModel> = mongoose.model<IRestaurantVisitModel>('RestaurantVisit', RestaurantVisitSchema, 'restaurantvisits');
