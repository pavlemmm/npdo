const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../utils/constants');

const validateToken = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const user = jwt.verify(token, TOKEN_SECRET);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json('Invalid token');
    }
};

module.exports = { validateToken };
