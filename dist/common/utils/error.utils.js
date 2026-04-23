"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = exports.ConflictException = exports.UnAuthorizedException = exports.NotFoundException = void 0;
class NotFoundException extends Error {
    constructor(massege) {
        super(massege, { cause: 404 });
    }
}
exports.NotFoundException = NotFoundException;
class UnAuthorizedException extends Error {
    constructor(massege) {
        super(massege, { cause: 401 });
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class ConflictException extends Error {
    constructor(massege) {
        super(massege, { cause: 409 });
    }
}
exports.ConflictException = ConflictException;
class BadRequestException extends Error {
    details;
    constructor(massege, details) {
        super(massege, { cause: 400 });
        this.details = details;
    }
}
exports.BadRequestException = BadRequestException;
