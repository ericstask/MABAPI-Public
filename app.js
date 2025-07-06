const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const kpiRoutes = require('./routes/kpiRoutes');
const letterRoutes = require('./routes/lettersRoutes');
const apiAuthKey = require('./utils/apiAuth');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

// create write stream for access log
const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

app.use('/api', apiAuthKey, kpiRoutes);
app.use('/api', apiAuthKey, letterRoutes);

const server = app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}...`)
});

process.on('unhandledRejection', err => {
    console.log("UNHANDLED REJECTION! Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log("SIGTERM RECIEVED. Shutting down gracefully");
    server.close(() => {
        console.log('Process terminated.');
    });
});
