"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitString = exports.not_null = void 0;
const not_null = (params) => {
    return params !== null && params !== undefined ? params : '';
};
exports.not_null = not_null;
const splitString = (str, start, end) => {
    return str.split(start)[1].split(end)[0];
};
exports.splitString = splitString;
