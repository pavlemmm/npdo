const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "wasd",
    host: "localhost",
    port: 5432,
    database: "npdo"
})

module.exports = pool