// This file contains database connection configuration and a function to get the database connection

const sql = require('msnodesqlv8');
require('dotenv').config();

function getLettersConnection(callback) {
    // let connectionString = "Server=agency.crhocfk86ela.us-east-1.rds.amazonaws.com;Database=Mercantile;Driver={SQL Server};UID=estaskiewicz;PWD=MAB2024$$$;"
    let connectionString = `Server=${process.env.LET_HOST};Database=${process.env.LET_BASE};Driver={SQL Server};UID=${process.env.LET_USER};PWD=${process.env.LET_PASS};`

    sql.open(connectionString, callback);
}

module.exports = {
    getLettersConnection
};
