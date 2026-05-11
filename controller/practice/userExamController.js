import UserExam from "../../model/practice/userExamModel.js";
export { saveUserExamResult, getUserExamResult, getUserExamHistory,getTotalPage };
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
    const userExam = await UserExam.findOne({ userId: userId, _id: id }).lean();
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

    const page = Number(req.query.page) || 1;
    const date = Number(req.query.date) || 0;

    const limit = 10;
    const skip = (page - 1) * limit;

    // filter cơ bản
    const filter = {
      userId,
    };

    // chỉ filter thời gian khi date > 0
    if (date > 0) {
      const days = new Date();

      days.setDate(
        days.getDate() - date
      );

      filter.createdAt = {
        $gte: days,
      };
    }

    // query song song
    const [totalDocument, userExams] =
      await Promise.all([
        UserExam.countDocuments(filter),

        UserExam.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ _id: -1 })
          .select(
            "examInfo totalScore time correctCount submitTime examId"
          )
          .lean(),
      ]);

    const totalPage = Math.ceil(
      totalDocument / limit
    );

    res.status(200).json({
      status: "success",
      data: userExams,

      pagination: {
        currentPage: page,
        totalPage,
        totalDocument,
        limit,
      },
    });
  } catch (error) {
    console.error(
      "getUserExamHistory error:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Lỗi server",
    });
  }
};

const getTotalPage=async(req,res)=>{
  try{
    const totalDocument=await UserExam.countDocuments()
    const totalPage= Math.ceil(totalDocument / 10);
    const firstPage=await UserExam.find().skip(0).limit(10).sort({_id:-1}).lean()
    res.status(200).json({
        success:true,
        totalPage:totalPage,
        firstPage:firstPage
    })
  }catch(err){
    console.log(err)
    res.status(500).json({
        success:false,
    })
  }
}