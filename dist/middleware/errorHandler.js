"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    console.error(`[${new Date().toISOString()}] Error:`, {
        status,
        message,
        path: req.path,
        method: req.method,
    });
    res.status(status).json({
        error: message,
        status,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
};
exports.notFoundHandler = notFoundHandler;
exports.default = exports.errorHandler;
//# sourceMappingURL=errorHandler.js.map