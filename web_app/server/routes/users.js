const express = require('express');
const router = express.Router();
const { login, register, auth, sign } = require('../controllers/userController');
const { validateLogin, validateRegister, validateSign } = require('../middleware/validateForm');
const { validateToken } = require('../middleware/validateToken');

router.get('/auth', validateToken, auth);
router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/sign', validateToken, validateSign, sign);

module.exports = router;
