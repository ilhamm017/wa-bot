"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_PATH = path_1.default.join(process.cwd(), 'src/data/knowledge.json');
exports.contextService = {
    getAllKnowledge: () => {
        try {
            const data = fs_1.default.readFileSync(DATA_PATH, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading knowledge.json:', error);
            return [];
        }
    },
    getKnowledgeStats: () => {
        const data = exports.contextService.getAllKnowledge();
        return data.map(item => ({
            id: item.id,
            description: item.description
        }));
    },
    getKnowledgeContent: (id) => {
        const data = exports.contextService.getAllKnowledge();
        const item = data.find(k => k.id === id);
        return item ? item.content : null;
    }
};
