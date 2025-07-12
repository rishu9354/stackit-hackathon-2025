const mongoose = require('mongoose');


const questionSchema = mongoose.Schema({
    title:String,
    description:String,
    tags:[String],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    answerBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"answer"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
})

module.exports = mongoose.model('question',questionSchema);