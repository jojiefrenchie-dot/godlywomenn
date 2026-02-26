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
exports.CommentLike = exports.ArticleView = exports.ArticleLike = exports.Comment = exports.Article = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const articleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 1024
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 1024
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        default: ''
    },
    featured_image: {
        type: String,
        default: null
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        default: 'Other'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    view_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    published_at: {
        type: Date,
        default: null
    }
});
articleSchema.pre('save', function (next) {
    this.updated_at = new Date();
    if (this.status === 'published' && !this.published_at) {
        this.published_at = new Date();
    }
    next();
});
const commentSchema = new mongoose_1.Schema({
    article: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Article',
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
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
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
const articleLikeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
articleLikeSchema.index({ user: 1, article: 1 }, { unique: true });
const articleViewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
articleViewSchema.index({ user: 1, article: 1 }, { unique: true });
const commentLikeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
commentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });
exports.Article = mongoose_1.default.model('Article', articleSchema);
exports.Comment = mongoose_1.default.model('Comment', commentSchema);
exports.ArticleLike = mongoose_1.default.model('ArticleLike', articleLikeSchema);
exports.ArticleView = mongoose_1.default.model('ArticleView', articleViewSchema);
exports.CommentLike = mongoose_1.default.model('CommentLike', commentLikeSchema);
//# sourceMappingURL=Article.js.map