const express = require('express');
const router = express.Router();
const { getActions, getActionsWithCode, postActions } = require('../controllers/actionsController');
const { validateToken } = require('../middleware/validateToken');
const { validateCode } = require('../middleware/validateForm');

router.get('/', validateToken, getActions);
router.get('/:code', validateCode, getActionsWithCode);
router.post('/', validateToken, postActions);

module.exports = router;
