const express = require("express");
const { cateNews, newsNew, newsInVN, newsHot, newsHealth, getnewsbytype, detailnews } = require("../controllers/newsController");

const router = express.Router();

// API lấy loại tin
router.get('/cateNews', cateNews);

// API lấy tin tức mới
router.get('/tin-tuc/moi', newsNew);

// API lấy tin tức trong nước
router.get('/tin-tuc/trong-nuoc', newsInVN)

// API lấy tin tức trong nước
router.get('/tin-tuc/hot', newsHot)

// API lấy tin tức sức khỏe
router.get('/tin-tuc/suc-khoe', newsHealth)

// API lấy loại tin
router.get('/loai_tin/:id/:start?', getnewsbytype);

// API lấy chi tiết tin tức
router.get('/chi_tiet/:id', detailnews);

module.exports = router;