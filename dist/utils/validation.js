"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuery = exports.generateSlug = exports.sanitizeString = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    return password.length >= 6;
};
exports.validatePassword = validatePassword;
const sanitizeString = (str) => {
    return str.trim().substring(0, 1000);
};
exports.sanitizeString = sanitizeString;
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
};
exports.generateSlug = generateSlug;
const parseQuery = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.parseQuery = parseQuery;
//# sourceMappingURL=validation.js.map