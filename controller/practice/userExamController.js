import UserExam from "../../model/practice/userExamModel.js";
export { saveUserExamResult, getUserExamResult, getUserExamHistory };
const saveUserExamResult = async (req, res) => {
  try {
    const id=req.params.ExamId
    const userId=req.userId
    const { examInfo,answersList, startTime, submitTime, totalScore, questionPartCountList } = req.body;
    if (!id || !userId || totalScore === undefined) {
      return res.status(400).json({ status: 'error', message: 'Thiếu thông tin' }

      );
    
    }
    const userExam = new UserExam({
      userId: userId,
      examId: id,
      examInfo: examInfo,
      answersList: answersList,
      questionPartCountList: questionPartCountList,
        totalScore: totalScore,
        startTime: startTime,
        submitTime: submitTime,
        time: submitTime - startTime})
    const savedUserExam = await userExam.save();
    res.status(200).json({ status: 'success', data: savedUserExam });
  } catch (error) {
    console.error('saveUserExamResult error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
}

const getUserExamResult = async (req, res) => {
  try {
    const { id } = req.params;  
    const userId = req.userId;
    const userExam = await UserExam.findOne({ userId: userId, examId: id }).lean();
    if (!userExam) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy kết quả bài thi' });
    }
    res.status(200).json({ status: 'success', data: userExam });
  } catch (error) {
    console.error('getUserExamResult error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
}

const getUserExamHistory = async (req, res) => {
  try {
    const userId = req.userId;    
    const userExams = await UserExam.find({ userId: userId }).select('examInfo totalScore time correctCount submitTime examId').lean();
    res.status(200).json({ status: 'success', data: userExams });
  } catch (error) {
    console.error('getUserExamHistory error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
}