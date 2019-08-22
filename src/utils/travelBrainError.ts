/**
 * @module Utils
 */ /** */

import * as config from 'config';
import * as mustache from 'mustache';
import { loogger } from '../services/logger';
import { HttpStatus, MappedErrors } from './mappedErrors';

/**
 * List of mapped errors that resolve to Http Status 500 (Server Error).
 */
const serverErrors = [MappedErrors.GENERAL.UNEXPECTED_ERROR].map(v => v.code);

/**
 * Represents an error in the system. See MappedErrors for more info on errors.
 */
export class TravelBrainError {
	/**
 * JSON body of error - potentially returned to client via Route Response or logged to console.
 */
	public error;

	/**
 * Construct TravelBrainError.
 * @param mappedError    This represents either a generic error, e.g.
 *						MappedErrors.GENERAL.UNEXPECTED_ERROR or a known one like
	*						MappedErrors.USER.MISSING_EMAIL_OR_PASSWORD
	* @param debugInfo      Represents any additional info (dev only) that could help in figuring
	*						out the error. Optional.
	*/
	constructor(mappedError, debugInfo?: any) {
		// create a copy
		this.error = { ...mappedError };

		// Include any additional info passed, if enabled. This could be exception information
		// from Mongo, for example.
		if (debugInfo !== undefined && config.errorHandling.includeInternalErrors) {
			this.error.debugInfo = debugInfo;
		}

		if (config.errorHandling.logToConsole) {
			loogger.error(this.error);
		}
	}

	/** Resolve the HTTP status for the given error.
 * @return Server error? 500. Otherwise, 400.
 */
	getHttpStatus(): number {
		if (serverErrors.indexOf(this.error.code) >= 0) {
			return HttpStatus.SERVER_ERROR;
		}

		return HttpStatus.CLIENT_ERROR;
	}

	/**
 * Replace error message's templated parameters with given parameters.
 * @param templateParams Object containing key value replacements. Sets the internal message
 * 						parameter to new, compiled template value.
 * @return This TravelBrainError
 */
	withParams(templateParams: object): TravelBrainError {
		this.error.message = mustache.render(this.error.message, templateParams);
		return this;
	}

	/**
 * Convenience method - log this error to console.
 * @return This TravelBrainError
 */
	log(): TravelBrainError {
		if (config.errorHandling.logToConsole) {
			loogger.error(this.error);
		}

		return this;
	}
}
