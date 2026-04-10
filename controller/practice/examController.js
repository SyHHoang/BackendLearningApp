import Exam from '../../model/practice/examModel.js';
import Question from '../../model/practice/questionModel.js';
import QuestionBlock from '../../model/practice/questionBlock.js'
import PartModel from '../../model/practice/partModel.js';
export { createExam, getAllExams, getExamById, updateExam, deleteExam ,getExamByIdForUser};

const createQuestion = async (type, questionList, partId) => {
  try {
    console.log('questionList',questionList)
    if (!Array.isArray(questionList) || questionList.length === 0) {
      return; 
    }
    
    const questionData = questionList.map(n => ({
      partId: partId,
      ...n
    }));

    if (type === 'one') {
      const createdQuestions =
      await Question.insertMany(questionData);
      console.log('createdQuestions',createdQuestions)
      return createdQuestions;
    }

    if (type === 'many') {
      return await QuestionBlock.insertMany(questionData);
    }

    throw new Error("Sai định dạng kiểu phần thi");

  } catch (err) {
    throw err;
  }
};
const createExam = async (req, res) => {
  try {
    const { title, level, examCategory, examType, mainContent,totalTime} = req.body;

    if (!title || !level || !Array.isArray(mainContent) || mainContent.length === 0 || !examCategory || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin',
      });
    }
    if(examType==='order')
    { totalTime=0
      mainContent.forEach(part => {
        totalTime += part.time || 0;
      });
    }
    console.log("main",mainContent)
    const exam = new Exam({
      title,
      examCategory,
      totalTime,
      examType,
      level,
    });
    const savedExam = await exam.save();
    const partList= mainContent.map((part,index)=>{
      return{
          examId:savedExam._id,
          title:part.title,
          type:part.type,
          order:part.order,
          content:part.content,
          imageUrl:part.imageUrl,
          imageId:part.imageId,
          audioUrl:part.audioUrl,
          audioId:part.audioId,
          time:part.time        
      }
    })
    const createPart=await PartModel.insertMany(partList)
    const partIdList=createPart.map((n)=>{
      return n._id
    })

    const createQuestionData =await Promise.allSettled(
      mainContent.map(async(n,index)=>{
        return await createQuestion(n.type,n.questionList,partIdList[index])
      })
    )
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
    const exam = await Exam.findById(id).sort({ order: 1 }).lean();
    console.log("exam",exam)
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề thi',
      });
    }
    const part=await PartModel.find({examId:id})
    console.log("part",part)
    const data=await Promise.allSettled(
        part.map(async(n)=>{
        let questionList=[]
        let questionBlockList=[]
        const partId=n._id.toString()
          if(n.type==='one')
            {
            console.log("one chạy",n._id)
            questionList=await Question.find({partId:partId}).sort({ order: 1 }).lean()
            console.log("questionList",questionList)
            }
          if(n.type==='many')
            {
           questionBlockList=await QuestionBlock.find({partId:partId}).sort({ order: 1 }).lean()
            }
          return{
            ...n.toObject(),
            questionList: questionList.length > 0?questionList:questionBlockList
          } 
        })
    )
    console.log("data",data)
    return res.status(200).json({
      success: true,
      data: data.map((n)=>n.value),
      examInfo:exam
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
const getExamByIdForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).sort({ order: 1 }).lean();
    console.log("exam",exam)
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề thi',
      });
    }
    const part=await PartModel.find({examId:id})
    console.log("part",part)
    const data=await Promise.allSettled(
        part.map(async(n)=>{
        let questionList=[]
        let questionBlockList=[]
          if(n.type==='one')
            {
            questionList=await Question.find({partId:n._id}).sort({ order: 1 }).lean()
            }
          if(n.type==='many')
            {
           questionBlockList=await QuestionBlock.find({partId:n._id}).sort({ order: 1 }).lean()
            }
          return{
            ...n.toObject(),
            questionList: questionList.length > 0?questionList:questionBlockList
          } 
        })
    )
    console.log("data",data)
    return res.status(200).json({
      success: true,
      data: data.map((n)=>n.value),
      examInfo:exam
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

