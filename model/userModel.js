import mongoose from 'mongoose';
const userSchema= new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    level:{
        type:String,
        enum:['A1','A2','B1','B2','C1','C2'],
        default:'A1'
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    status:{
        type: String,
        enum:['active','inactive'],
        default:'active'
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }

});
const User = mongoose.model('User', userSchema);
export default User;