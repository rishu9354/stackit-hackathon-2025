const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/Q&A-odoo");

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    created:{
        type:Date,
        default:Date.now()
    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"question"
    }],
    answer:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"answer"
    }]
})

module.exports = mongoose.model('user',userSchema);