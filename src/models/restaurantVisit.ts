/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';
import { IRestaurant } from './restaurant';

export interface IRestaurantVisit {
	restaurantVisitId: number;
	restaurant: IRestaurant;
	restaurantId: number;
	visitDate: Date;
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
