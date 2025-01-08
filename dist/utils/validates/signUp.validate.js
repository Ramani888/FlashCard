"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpValidation = exports.verifyOtpValidation = exports.signUpValidation = void 0;
exports.signUpValidation = {
    email: 'required|email',
    userName: 'required|string',
    password: 'required|string',
    isPrivacy: 'required|boolean'
};
exports.verifyOtpValidation = {
    email: 'required|email',
    otp: 'required|numeric'
};
exports.resendOtpValidation = {
    email: 'required|email',
};
