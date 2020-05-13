/**
 * @module Models
 */ /** */

import { ICity } from '../city';

export interface IRestaurantDetails {
	name: string;
	fromCity: boolean;
	city: any;
	michelin: boolean;
	michelinStars: number;
	cuisine: string;
	notes: string;
	visitDate: Date;
}
