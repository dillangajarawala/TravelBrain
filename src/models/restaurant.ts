/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';
import { ICity } from './city';
import { ICityVisit } from './cityVisit';

export interface IRestaurant {
	restaurantId: number;
	name: string;
	michelin: boolean;
	michelinStars: number;
	cuisine: string;
	visitDate: Date;
	fromCityVisit: boolean;
	cityVisit: ICityVisit;
	city: ICity;
	notes: string;
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
	},
	visitDate: {
		type: Date,
		required: true
	},
	fromCityVisit: {
		type: Boolean,
		required: true
	},
	cityVisit: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'CityVisit',
		required: (): boolean => this.fromCityVisit === true
	},
	city: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'City',
		required: (): boolean => this.fromCityVisit === false
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
 * The Restaurant Mongoose Model.
 */
export const Restaurant: mongoose.Model<IRestaurantModel> = mongoose.model<IRestaurantModel>('Restaurant', ResturantSchema, 'restaurants');
