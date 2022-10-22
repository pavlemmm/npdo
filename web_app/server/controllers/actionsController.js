const db = require('../utils/db');

const getActions = async (req, res) => {
    const user_id = req.user.user_id;
    const { rows } = await db.query('select card_id, starts, day from actions where user_id=$1', [user_id]);
    return res.json(rows);
};

const getActionsWithCode = async (req, res) => {
    const { rows } = await db.query('select user_id from users where code=$1', [req.code]);
    if (!rows.length) return res.status(400).json('Uneli ste pogrešan kod, ili niste aktivirali vaš nalog');
    const user_id = rows[0].user_id;
    const { rows: rows2 } = await db.query('select card_id, starts, day from actions where user_id=$1', [user_id]);
    return res.json(rows2);
};

const postActions = async (req, res) => {
    const actions = req.body;
    const user_id = req.user.user_id;
    await db.query('delete from actions where user_id=$1', [user_id]);
    try {
        for (const action of actions) {
            await db.query('insert into actions(user_id, card_id, starts, day) values($1, $2, $3, $4)', [
                user_id,
                action.card_id,
                action.starts,
                action.day,
            ]);
        }
        return res.status(201).json('Successful');
    } catch {
        return res.status(400).json('Invalid request');
    }
};

module.exports = { getActions, postActions, getActionsWithCode };
