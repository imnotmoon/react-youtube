const express = require('express');
const router = express.Router();
// const { User } = require("../models/Video");

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

module.exports = router