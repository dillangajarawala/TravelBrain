/**
 * @module Utils
 */ /** */

// 1000
const generalErrors = {
	UNEXPECTED_ERROR: {
		code: 1000,
		message: 'Some unexpected error occurred.'
	},
	INVALID_PARAM_DATA: {
		code: 1001,
		message: 'Invalid data provided.'
	}
};

const mongoErrors = {
	INSERTION_ERROR: {
		code: 2000,
		message: 'Failed MongoDB insertion.'
	},
	DELETION_ERROR: {
		code: 2001,
		message: 'Failed MongoDB deletion.'
	},
	FIND_ERROR: {
		code: 2002,
		message: 'Failed MongoDB read operation'
	}
};


export const MappedErrors = {
	GENERAL: generalErrors,
	MONGO: mongoErrors
};

/**
* Simple mapping of Client and Server HTTP error codes.
*/
export const HttpStatus = {
	CLIENT_ERROR: 400,
	SERVER_ERROR: 500
};
