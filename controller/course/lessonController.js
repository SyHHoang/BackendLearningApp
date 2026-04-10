import mongoose from 'mongoose';
import Lesson from '../../model/course/lessonModal.js';
import LessonBlock from '../../model/course/block/lessonBlock.js'
import Question from '../../model/practice/questionModel.js'
import Course from '../../model/course/courseModel.js';
export { createLesson, updateLesson, deleteLesson, getLessonById };
const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {lessonTitle,lessonDescripsion,blockArray,practice,practiceInfo} = req.body;
    console.log("body",req.body)
    console.log("param",req.params)
    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học',
      });
    }

    // Kiểm tra tiêu đề bài học đã tồn tại trong khóa học chưa
    const existingLesson = await Lesson.findOne({ 
      title: lessonTitle.trim(), 
      _id: { $in: course.lesson } 
    });
    
    if (existingLesson) {
      return res.status(400).json({
        success: false,
        message: 'Bài học với tiêu đề này đã tồn tại trong khóa học',
      });
    }
        //tạo câu hỏi
        const questionIds = [];
        for (const q of practice) {
          const questionDoc = new Question({
            questionText: q.questionText || '',
            order:q.order,
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
    //tạo bài học
    const lesson = new Lesson({
      title: lessonTitle.trim(),
      description: lessonDescripsion|| '',
      practice:{
        title:practiceInfo.title,
        description:practiceInfo.description,
        content:questionIds
      }
    });

    const savedLesson = await lesson.save();
    course.lesson.push(savedLesson._id);
    await course.save();

    // Tạo các block 
    const createBlock=await Promise.allSettled(
      blockArray.map(async(n)=>{
        console.log('n',{...n})
          const newBlock=new LessonBlock({
            lessonId:savedLesson._id,
            ...n
          })
          console.log('newBlock',newBlock)
          const res=await newBlock.save()
          console.log('res',res)
      })
    )
    return res.status(201).json({
      success: true,
      message: 'Tạo bài học thành công',
    });

  } catch (error) {
    console.error('Lỗi createLesson:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { courseId,lessonId } = req.params;
    const { lessonTitle,lessonDescripsion,blockArray,practice,practiceInfo,deleteBlockArray,deletePractice } = req.body;
    
    console.log("body",req.body)
    console.log('param',req.params)
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học',
      });
    }

    if (lessonTitle !== undefined) lesson.title = lessonTitle.trim();
    if (lessonDescripsion !== undefined) lesson.description = lessonDescripsion.trim();
    if(practiceInfo.title !==undefined) lesson.practice.title=practiceInfo.title.trim()
    if(practiceInfo.description !== undefined) lesson.practice.description=practiceInfo.description.trim()
    lesson.updateAt = Date.now();
    //sửa practice
    const newQuestionList=[]
    practice.forEach(element => {
      if(element.newQuestion)
        newQuestionList.push(element)
    });
    console.log("danh sách câu hỏi cần tạo",newQuestionList)
    const data=newQuestionList.map((n)=>{
      return {
            questionText: n.questionText,
    order:n.order,//thứ tự cho 1 số chức năng cụ thể
    image:{   
       imageUrl: n.image.imageUrl,
       imageId: n.image.imageId, //id ảnh cũ để xóa
       },
    audio:{
    audioUrl: n.audio.audioUrl,
    audioId: n.audio.audioId, //id audio cũ để xóa
    },
    videoUrl: n.videoUrl,
    options:n.options,
    correctAnswer:n.correctAnswer,

    explanation:n.explaination,
      }
    })
    let createNewQuestion=[]
    let newQuestionId=[]
    if (data) {createNewQuestion= await Question.insertMany(data)
    if(createNewQuestion.length>0) console.log('tạo câu hỏi thành công')
       newQuestionId=createNewQuestion.map((n)=>{
        return {_id:n._id,
                order:n.order}
    })}

    if(deletePractice){
    const deleteId=deletePractice.map((n)=>{
      return n._id
    })
    const deleteQuestion= await Question.deleteMany(
      {_id: { $in: deleteId }}
    )
    if(deleteQuestion.deletedCount > 0)console.log('xóa câu hỏi thành công')
    //cập nhật danh sách practice
    deletePractice.forEach(element => {
        lesson.practice.content.splice(element.order,1)
    });
    newQuestionId.forEach(element => {
        lesson.practice.content.splice(element.order,0,element._id)
    });
  }
    await lesson.save();
    const deleteBlockId=deleteBlockArray.map((n)=>{
      return n._id
    })
    //xóa block
    const deleteBlock=await LessonBlock.deleteMany(
      {_id: { $in: deleteBlockId}}
    )
    if(deleteBlock.deletedCount>0) console.log("xóa block thành công")
    let updateBlock=[]
    let addBlock=[]
    blockArray.forEach(element => {
      console.log("blockContent", element.blockContent)
      if(element.newBlock)
          addBlock.push(element)
      else{
          updateBlock.push(element)}
    });
    console.log("update block list",updateBlock)
    // block
    if(updateBlock.length>0){
    updateBlock=updateBlock.map((n)=>{
      return{
        _id:n._id,
        type:n.type,
        lessonId:lessonId,
        blockTitle:n.blockTitle,
        order:n.order,
        blockContent:n.blockContent,
      }
    })
    console.log(" new update block list",updateBlock)
    await Promise.all(
      updateBlock.map(block =>
        LessonBlock.updateOne(
          { _id: block._id },
          { $set: block }
        )
      )
    )
  }
    if(addBlock.length>0){
      
      const addBlockData= addBlock.map((n)=>{
        console.log("addBLockArrray",n.blockContent)
        return{
          type:n.type,          
          lessonId:lessonId,
          blockTitle:n.blockTitle,
          order:n.order,
          blockContent:n.blockContent,
        }
      })
      const res=await LessonBlock.insertMany(addBlockData)
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật bài học thành công',
      data: lesson,
    });
  } catch (err) {
    console.error('updateLesson error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ"
      });
    }
    const lesson = await Lesson.findById(id)
      .lean();

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài học"
      });
    }

    await Course.updateMany(
      { lesson: id },
      { $pull: { lesson: id } },
    );

    await Lesson.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Xóa bài học thành công"
    });

  } catch (err) {
    console.error("deleteLesson error:", err);

    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: err.message
    });

  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id)
                  .populate('practice.content')
                  .lean();
    const block= await LessonBlock.find({lessonId:id}).lean()
    console.log(lesson)
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học',
      });
    }
    return res.status(200).json({
      success: true,
      lessonData: lesson,
      blockData: block
    });
  } catch (err) {
    console.error('getLessonById error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
};
