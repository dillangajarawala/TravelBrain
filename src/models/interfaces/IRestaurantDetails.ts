/**
 * @module Models
 */ /** */

import * as mongoose from 'mongoose';

export interface IRestaurantDetails {
	name: string;
	fromCityVisit: boolean;
	refId: mongoose.Schema.Types.ObjectId;
	michelin: boolean;
	michelinStars: number;
	cuisine: string;
	notes: string;
	visitDate: Date;

}
