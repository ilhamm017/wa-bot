import fs from 'fs';
import path from 'path';

interface KnowledgeItem {
    id: string;
    description: string;
    content: string;
}

const DATA_PATH = path.join(process.cwd(), 'src/data/knowledge.json');

export const contextService = {
    getAllKnowledge: (): KnowledgeItem[] => {
        try {
            const data = fs.readFileSync(DATA_PATH, 'utf-8');
            return JSON.parse(data) as KnowledgeItem[];
        } catch (error) {
            console.error('Error reading knowledge.json:', error);
            return [];
        }
    },

    getKnowledgeStats: () => {
        const data = contextService.getAllKnowledge();
        return data.map(item => ({
            id: item.id,
            description: item.description
        }));
    },

    getKnowledgeContent: (id: string): string | null => {
        const data = contextService.getAllKnowledge();
        const item = data.find(k => k.id === id);
        return item ? item.content : null;
    }
}
