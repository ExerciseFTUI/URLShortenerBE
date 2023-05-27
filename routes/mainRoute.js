const { apiGetAll, apiPostShorten, apiGetRedirect, apiPutShorten } = require('../controllers/mainController');
const express = require('express');
const router = express.Router();

router.get('/', apiGetAll);
router.post('/create', apiPostShorten);
router.put('/update', apiPutShorten);
router.get('/:shortUrl', apiGetRedirect);

module.exports = router;