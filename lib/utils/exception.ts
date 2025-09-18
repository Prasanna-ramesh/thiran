abstract class Exception extends Error {
	protected constructor(message: string) {
		super(message);
		this.name = this.constructor.name;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, new.target);
		}
	}
}

export class ValidationException extends Exception {
	constructor(message = 'Validation failed') {
		super(message);
	}
}

export class InvalidConfigException extends Exception {
	constructor(message = 'Invalid Configuration') {
		super(message);
	}
}

export class ForbiddenException extends Exception {
	constructor(message = 'Invalid Operation') {
		super(message);
	}
}
