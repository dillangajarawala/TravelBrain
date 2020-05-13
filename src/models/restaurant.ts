/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';

export interface IRestaurant {
	restaurantId: number;
	name: string;
	michelin: boolean;
	michelinStars: number;
	cuisine: string;
}

interface IRestaurantModel extends IRestaurant, mongoose.Document { }

/**
 * Restaurant Schema - Mongoose document.
 */
export const ResturantSchema: mongoose.Schema = new mongoose.Schema({
	restaurantId: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	michelin: {
		type: Boolean,
		required: true
	},
	michelinStars: {
		type: Number,
		required: false
	},
	cuisine: {
		type: String,
		required: true
	}
}, {
	timestamps: {
		createdAt: 'createDate',
		updatedAt: 'lastUpdateDate'
	}
});

/**
 * The Restaurant Mongoose Model.
 */
export const Restaurant: mongoose.Model<IRestaurantModel> = mongoose.model<IRestaurantModel>('Restaurant', ResturantSchema, 'restaurants');
