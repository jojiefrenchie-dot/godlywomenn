"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = require("./middleware/errorHandler");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const articles_1 = __importDefault(require("./routes/articles"));
const prayers_1 = __importDefault(require("./routes/prayers"));
const marketplace_1 = __importDefault(require("./routes/marketplace"));
const messaging_1 = __importDefault(require("./routes/messaging"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 8000;
// Middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://godlywomenn.vercel.app',
        'http://godlywomenn.vercel.app',
        process.env.FRONTEND_URL || ''
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Serve media files
app.use('/media', express_1.default.static('media'));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/articles', articles_1.default);
app.use('/api/prayers', prayers_1.default);
app.use('/api/marketplace', marketplace_1.default);
app.use('/api/messaging', messaging_1.default);
// Error handling
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// Connect to database and start server
const startServer = async () => {
    try {
        await (0, database_1.default)();
    }
    catch (error) {
        console.warn('⚠️ Warning: Could not connect to MongoDB, continuing without database');
    }
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map