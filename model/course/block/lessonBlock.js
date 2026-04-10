import mongoose from "mongoose";
const lessonBlockSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },
    type: {
        type: String,
        enum: ['other', 'video'],
    },
    order: {
        type: Number,
        required: true
    },
    blockTitle: {
        type: String,
        required: true,
        trim: true
    },
    blockContent: [
        {
            title:{
                    type: String,
                    required: true,
                    trim: true
            },
            content:{
                    type: String,
                    required: true,
                    trim: true
            },
            // Media fields
            videoUrl: String,
            imageUrl: String,
            imageId: String,
            oldImageId:String,
            audioUrl: String,
            audioId: String,
            oldAudioId:String
        }
    ]
    
}, { timestamps: true });
const LessonBlock= new mongoose.model('lessonBlock',lessonBlockSchema)
export default LessonBlock