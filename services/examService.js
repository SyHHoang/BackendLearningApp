import Vocabulary from '../model/course/block/vocabularyBlock.js';
import Grammar from '../model/course/block/grammarBlock.js';
import Kanji from '../model/course/block/kanjiBlock.js';
//import Video from '../model/block/videoBlock.js';
import Question from '../model/practice/questionModel.js';
export const addVocabulary = async (vocabularyArray, session) => {
    try {
        if (!vocabularyArray || vocabularyArray.length === 0) {
            return []; // Trả về mảng rỗng nếu không có dữ liệu
        }
        
        for (const item of vocabularyArray) {
            if (!item.pattern || !item.explaination || !item.latin) {
                throw new Error('Thiếu thông tin trong danh sách từ vựng');
            }
        }
        
        const newVocabulary = await Vocabulary.insertMany(vocabularyArray, { session });
        console.log("vocabu",newVocabulary)
        return newVocabulary.map(doc => doc._id);
        
    } catch (error) {
        console.error('Lỗi khi thêm từ vựng:', error);
        throw error;
    }
}

export const addGrammar = async (grammarArray, session) => {
    try {
        if (!grammarArray || grammarArray.length === 0) {
            return [];
        }
        
        for (const item of grammarArray) {
            if (!item.pattern || !item.explaination || !item.latin) {
                throw new Error('Thiếu thông tin trong danh sách ngữ pháp');
            }
        }
        
        const newGrammar = await Grammar.insertMany(grammarArray, { session });
        return newGrammar.map(doc => doc._id);
        
    } catch (error) {
        console.error('Lỗi khi thêm ngữ pháp:', error);
        throw error;
    }
}

export const addKanji = async (kanjiArray, session) => {
    try {
        if (!kanjiArray || kanjiArray.length === 0) {
            return [];
        }
        
        for (const item of kanjiArray) {
            if (!item.pattern || !item.explaination || !item.latin) {
                throw new Error('Thiếu thông tin trong danh sách kanji');
            }
        }
        
        const newKanji = await Kanji.insertMany(kanjiArray, { session });
        return newKanji.map(doc => doc._id);
        
    } catch (error) {
        console.error('Lỗi khi thêm kanji:', error);
        throw error;
    }
}

export const addQuestion = async (questionArray, session) => {
    try {
        if (!questionArray || questionArray.length === 0) {
            return [];
        }
        
        for (const item of questionArray) {
            if (!item.questionText || !item.options || !item.correctAnswer) {
                throw new Error('Thiếu thông tin trong danh sách câu hỏi');
            }
        }
        
        const newQuestion = await Question.insertMany(questionArray, { session });
        return newQuestion.map(doc => doc._id);
        
    } catch (error) {
        console.error('Lỗi khi thêm câu hỏi:', error);
        throw error;
    }
}