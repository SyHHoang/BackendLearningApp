import LessonBlock from '../../model/course/block/lessonBlock.js';
export const createLessonBlock = async (req, res) => {
  try {
    const {type,order,blockTitle,blockContent}=req.body
    const lessonId=req.params.id
    if(!type||!order||!blockTitle){
      return res.status(403).json({
        success:false,
        error:"Thiếu thông tin"
      })
    }
    if(!Array.isArray(blockContent))
    {
      return res.status(403).json({
        success:false,
        error:"Sai định dạng"
      })
    }
    blockContent.forEach(element => {
        if(!element.title||!element.contents)
        {
      return res.status(403).json({
        success:false,
        error:"Thiếu trường thông tin nội dung Block"
      })
        }
    });
    const data={
      type:type,
      order:order,
      blockTitle:blockTitle,
      blockContent:blockContent
    }
    const block = new LessonBlock(data);
    await block.save();

    res.status(201).json({
      success: true,
      data: block
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


export const getBlocksByLessonId = async (req, res) => {
  try {

    const { lessonId } = req.params;

    const blocks = await LessonBlock
      .find({ lessonId })
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      count: blocks.length,
      data: blocks
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const updateLessonBlock = async (req, res) => {
  try {

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};
 const deleteLessonBlock = async (req, res) => {
  try {

    const block = await LessonBlock.findByIdAndDelete(req.params.id);

    if (!block) {
      return res.status(404).json({
        success: false,
        message: "LessonBlock không tồn tại"
      });
    }

    res.json({
      success: true,
      message: "Xóa block thành công"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};





/*
REORDER BLOCKS
*/
export const reorderLessonBlocks = async (req, res) => {
  try {

    const { blocks } = req.body;

    if (!Array.isArray(blocks)) {
      return res.status(400).json({
        success: false,
        message: "blocks phải là array"
      });
    }

    const updates = blocks.map((item) =>
      LessonBlock.findByIdAndUpdate(
        item.id,
        { order: item.order }
      )
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: "Reorder thành công"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};