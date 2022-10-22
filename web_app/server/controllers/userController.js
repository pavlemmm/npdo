const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const { TOKEN_SECRET } = require('../utils/constants');

const auth = (req, res) => {
    return res.json(req.user);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const { rows } = await db.query('select * from users where email=$1', [email]);
    if (rows.length && (await bcrypt.compare(password, rows[0].password))) {
        const payload = {
            user_id: rows[0].user_id,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            email,
            code: rows[0].code,
        };
        const token = jwt.sign(payload, TOKEN_SECRET);
        return res.json({ token, payload });
    } else {
        return res.status(400).json('Invalid email or password');
    }
};

const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const { rows } = await db.query('select * from users where email=$1', [email]);
    if (rows.length) return res.status(400).json('Account with this email address already exists');

    const { rows: rows2 } = await db.query('select * from signed where email=$1', [email]);
    if (!rows2.length) return res.status(400).json('Email is not on the list');

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('delete from signed where email=$1', [email]);
    const { rows: rows3 } = await db.query(
        'insert into users(first_name, last_name, email, password) values($1, $2, $3, $4) returning user_id',
        [firstName, lastName, email, hashedPassword]
    );
    const user_id = rows3[0].user_id;

    const code_sum = String(1 / user_id + user_id + user_id * 3.141592653);
    let code = '';
    for (c of code_sum) {
        if (c === '.') continue;
        code += c;
        if (code.length === 4) break;
    }

    await db.query('update users set code=$1 where user_id=$2', [code, user_id]);

    const payload = { user_id, firstName, lastName, email, code };
    const token = jwt.sign(payload, TOKEN_SECRET);

    return res.status(201).json({ token, payload });
};

const sign = async (req, res) => {
    const { email } = req.body;
    if (req.user.email !== 'admin@gmail.com') return res.status(401).json('Not admin');

    const { rows } = await db.query('select * from signed where email=$1', [email]);
    if (rows.length) return res.status(400).json('Email already entered');

    const { rows: rows2 } = await db.query('select * from users where email=$1', [email]);
    if (rows2.length) return res.status(400).json('Account already created with this email address');

    await db.query('insert into signed values($1)', [email]);
    return res.status(201).json('Successful insert');
};

module.exports = { auth, login, register, sign };
