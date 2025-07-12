const mongoose = require('mongoose');


const answerSchema = mongoose.Schema({
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"question"
    },
    content:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"answer"
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"answer"
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    },
})

module.exports = mongoose.model("answer",answerSchema);