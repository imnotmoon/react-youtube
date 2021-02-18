const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const videoSchema = mongoose.Schema({

    writer: {
        type : mongoose.Schema.Types.ObjectId,  // Foreign key 같은 느낌
        ref : 'User'        // User 모델의 모든 정보를 다 긁어올 수 있다.
    },
    title : {
        type: String,
        maxlength: 50,
    },
    description: {
        type: String
    },
    privacy : {
        type : Number
    },
    filePath: {
        type : String
    },
    category: {
        type : String
    },
    views : {
        type: Number,
        default : 0
    },
    duration : {
        type : String
    },
    thumbnail : {
        type : String
    }
}, { timestamps : true }) 

const Video = mongoose.model('Video', videoSchema)


module.exports = { Video }