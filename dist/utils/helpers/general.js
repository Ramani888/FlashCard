"use strict";
// export const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.generateOTP = generateOTP;
