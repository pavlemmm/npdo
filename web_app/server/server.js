const express = require('express');
const cors = require('cors');
const { PORT } = require('./utils/constants');

const usersRouter = require('./routes/users');
const actionsRouter = require('./routes/actions');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/actions', actionsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}/`);
});
