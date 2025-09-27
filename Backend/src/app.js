const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/progress', require('./src/routes/progress'));

app.get('/ping', (req, res) => res.send('pong'));
module.exports = app;