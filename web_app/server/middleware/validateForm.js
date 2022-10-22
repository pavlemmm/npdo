const checkName = name => {
    return /^[A-z]{3,30}$/.test(name);
};

const checkEmail = email => {
    return /^[\w\.]{1,40}@\w{1,15}\.\w{2,4}$/.test(email);
};

const checkPassword = password => {
    return /^.{8,60}$/.test(password);
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400).json('Invalid form fields');
        return;
    }
    for (field in req.body) {
        switch (field) {
            case 'password':
                if (checkPassword(req.body[field])) break;
            case 'email':
                if (checkEmail(req.body[field])) break;
            default:
                res.status(400).json('Invalid form');
                return;
        }
    }
    next();
};

const validateRegister = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    if (!(email && password && firstName && lastName)) {
        res.status(400).json('Invalid form fields');
        return;
    }
    for (field in req.body) {
        switch (field) {
            case 'firstName':
            case 'lastName':
                if (checkName(req.body[field])) break;
            case 'password':
                if (checkPassword(req.body[field])) break;
            case 'email':
                if (checkEmail(req.body[field])) break;
            default:
                res.status(400).json('Invalid form');
                return;
        }
    }
    next();
};

const validateSign = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json('Invalid form fields');
        return;
    }
    if (!checkEmail(email)) {
        res.status(400).json('Invalid email');
        return;
    }
    next();
};

const validateCode = (req, res, next) => {
    const code = Number(req.params.code);
    if (code < 1000 || code > 9999 || code % 1 != 0) {
        return res.status(400).json('Invalid code number value');
    }
    req.code = code;
    next();
};

module.exports = { validateLogin, validateRegister, validateSign, validateCode };
