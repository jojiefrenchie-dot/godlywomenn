"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrayerResponseLike = exports.PrayerSupport = exports.PrayerResponse = exports.Prayer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const prayerSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    content: {
        type: String,
        required: true
    },
    prayer_type: {
        type: String,
        enum: ['request', 'testimony', 'praise'],
        default: 'request'
    },
    is_anonymous: {
        type: Boolean,
        default: false
    },
    is_public: {
        type: Boolean,
        default: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
const prayerResponseSchema = new mongoose_1.Schema({
    prayer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Prayer',
        required: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
const prayerSupportSchema = new mongoose_1.Schema({
    prayer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Prayer',
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
prayerSupportSchema.index({ prayer: 1, user: 1 }, { unique: true });
const prayerResponseLikeSchema = new mongoose_1.Schema({
    response: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'PrayerResponse',
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
prayerResponseLikeSchema.index({ response: 1, user: 1 }, { unique: true });
exports.Prayer = mongoose_1.default.model('Prayer', prayerSchema);
exports.PrayerResponse = mongoose_1.default.model('PrayerResponse', prayerResponseSchema);
exports.PrayerSupport = mongoose_1.default.model('PrayerSupport', prayerSupportSchema);
exports.PrayerResponseLike = mongoose_1.default.model('PrayerResponseLike', prayerResponseLikeSchema);
//# sourceMappingURL=Prayer.js.map