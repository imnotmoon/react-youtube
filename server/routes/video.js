const express = require('express');
const router = express.Router();
// const { User } = require("../models/Video");
var ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber')
const { auth } = require("../middleware/auth");
const multer = require('multer');

// STORAGE MULTER CONFIG(옵션임)
// 이걸 multer 함수 안에 인자 객체로 넣은것.
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext != '.mp4' || ext != '.jpg' || ext != '.png') {
            return cb(res.status(400).end('only mp4, jpg, png are allowed'), false);
        }
        cb(null);
    }
});

const upload = multer({ storage : storage }).single("file")

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
    // req : 클라이언트에서 보내온 것들. 파일
    // 비디오를 서버에 저장한다. + multer 이용
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err});
        }
        return res.json({ success: true, url: res.req.file.path, fileName : res.req.file.filename });
    })
})

router.get("/getVideos", (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.
    Video.find()        // 비디오 콜렉션 안에 있는 모든 비디오.
    .populate('writer')     // Video 모델 안의 ref(user)까지 다 가져옴
    .exec((err, videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({
            success : true,
            videos
        })
    })
})

router.post("/uploadVideo", (req, res) => {
    // 비디오 정보들을 db에 저장한다.
    const video = new Video(req.body)     // 클라이언트에서 variable로 보낸 데이터 전부가 request.body

    // mongoDB 메소드로 정보를 저장
    video.save((err, doc) => {
        if(err) return res.json({
            success : false, err
        })
        res.status(200).json({
            success : true
        })
    })
})

router.post("/getVideoDetail", (req, res) => {
    // videoId를 가지고 DB에서 비디오 정보를 가져온다.
    Video.findOne({"_id" : req.body.videoId})
    .populate('wtiter')
    .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({
            success : true,
            videoDetail
        })
    })
})

router.post("/getSubscriptionVideo", (req, res) => {
    // 두가지 스텝
    // 1. 현재 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    
    Subscriber.find({userFrom : req.body.userFrom})
    .exec((err, subscriberInfo) => {
        if(err) return res.status(400).send(err);
        
        let subscribedUser = [];    // userTo 정보를 담는다.

        subscriberInfo.map((subscriber, i) => {
            subscribedUser.push(subscriber.userTo);
        })

        // 2. 찾은 사람들의 비디오를 가지고 온다.
        console.log(subscriberInfo)
        Video.find({writer: {
            $in: subscribedUser     // 모든 사람들의 아이디를 가지고 writer의 id를 찾을 수 있다.
        }})
        .populate('writer')
        .exec((err, videos) => {
            console.log(videos)
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, videos})
        })
    })
})

router.post("/thumbnail", (req, res) => {
    
    // thumbnail 생성하고 비디오 러닝타임같은 정보도 얻을 수 있다.
    // ffmpeg 모듈 사용

    let filePath = ''
    let fileDuration = ''

    // 비디오 정보 가져오는 부분 : for video duration
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata)
        console.log(metadata.format.duration)
        fileDuration = metadata.format.duration
    });


    // 썸네일 생성 부분
    ffmpeg(req.body.url)        // 인자는 저장경로. 
    // 파일이름일 생성
    .on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = 'uploads/thumbnails/' + filenames[0]
    })
    // 썸네일을 생성하고 무엇을 할것인지
    .on('end', function() {
        console.log('Screenshots taken')
        return res.json({
            success : true,
            url : filePath,     // 썸네일 저장 경로.
            fileDuration
        })
    })
    // 에러 핸들링
    .on('error', function(err) {
        console.log(err)
        return res.json({
            success: false,
            err
        })
    })
    // 스크린샷에 관련한 옵션
    .screenshots({
        // Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3,       // 3개 촬영
        folder: 'uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png'    // -%b 옵션 : input basename(filename w/o extension)
    })
})

module.exports = router