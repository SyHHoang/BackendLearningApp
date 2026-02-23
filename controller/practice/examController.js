import Exam from '../../model/practice/examModel.js';
import Question from '../../model/practice/questionModel.js';

export { createExam, getAllExams, getExamById, updateExam, deleteExam };

/**
 * Tạo đề thi JLPT: tạo các câu hỏi trước, sau đó tạo Exam với questionIds
 * Body: { title, level, structure: { vocabulary, reading, listening }, questions: [...] }
 */
const createExam = async (req, res) => {
  try {
    const { title, level, structure, questions } = req.body;

    if (!title || !level || !structure || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: title, level, structure, questions (mảng không rỗng)',
      });
    }

    const totalFromStructure =
      (structure.vocabulary?.count || 0) +
      (structure.reading?.count || 0) +
      (structure.listening?.count || 0);
    if (questions.length !== totalFromStructure) {
      return res.status(400).json({
        success: false,
        message: `Số câu hỏi (${questions.length}) không khớp với cấu trúc đề (${totalFromStructure})`,
      });
    }

    const questionIds = [];
    for (const q of questions) {
      const questionDoc = new Question({
        questionText: q.questionText || '',
        image: {
          imageUrl: q.image?.imageUrl || '',
          imageId: q.image?.imageId || '',
        },
        audio: {
          audioUrl: q.audio?.audioUrl || '',
          audioId: q.audio?.audioId || '',
        },
        videoUrl: q.videoUrl || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || '',
        score: q.score != null ? q.score : 1,
      });
      const saved = await questionDoc.save();
      questionIds.push(saved._id);
    }

    const exam = new Exam({
      title,
      level,
      structure: {
        vocabulary: structure.vocabulary,
        reading: structure.reading,
        listening: structure.listening,
      },
      questionIds,
    });
    const savedExam = await exam.save();

    return res.status(201).json({
      success: true,
      message: 'Tạo đề thi thành công',
      data: savedExam,
    });
  } catch (err) {
    console.error('createExam error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách đề thi thành công',
      data: exams,
    });
  } catch (err) {
    console.error('getAllExams error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};

const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate('questionIds').lean();
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề thi',
      });
    }
    return res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    console.error('getExamById error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, level, structure, questions } = req.body;

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề thi',
      });
    }

    if (!title || !level || !structure || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: title, level, structure, questions',
      });
    }

    const totalFromStructure =
      (structure.vocabulary?.count || 0) +
      (structure.reading?.count || 0) +
      (structure.listening?.count || 0);
    if (questions.length !== totalFromStructure) {
      return res.status(400).json({
        success: false,
        message: `Số câu hỏi (${questions.length}) không khớp với cấu trúc đề (${totalFromStructure})`,
      });
    }

    // Xóa các câu hỏi cũ
    if (exam.questionIds?.length) {
      await Question.deleteMany({ _id: { $in: exam.questionIds } });
    }

    // Tạo câu hỏi mới
    const questionIds = [];
    for (const q of questions) {
      const questionDoc = new Question({
        questionText: q.questionText || '',
        image: {
          imageUrl: q.image?.imageUrl || '',
          imageId: q.image?.imageId || '',
        },
        audio: {
          audioUrl: q.audio?.audioUrl || '',
          audioId: q.audio?.audioId || '',
        },
        videoUrl: q.videoUrl || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || '',
        score: q.score != null ? q.score : 1,
      });
      const saved = await questionDoc.save();
      questionIds.push(saved._id);
    }

    exam.title = title;
    exam.level = level;
    exam.structure = {
      vocabulary: structure.vocabulary,
      reading: structure.reading,
      listening: structure.listening,
    };
    exam.questionIds = questionIds;
    await exam.save();

    return res.status(200).json({
      success: true,
      message: 'Cập nhật đề thi thành công',
      data: exam,
    });
  } catch (err) {
    console.error('updateExam error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề thi',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa đề thi thành công',
    });
  } catch (err) {
    console.error('deleteExam error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};
