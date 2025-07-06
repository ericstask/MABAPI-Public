// This file contains database connection configuration and a function to get the database connection

const sql = require('msnodesqlv8');
require('dotenv').config();

function getMABConnection(database, callback) {
    let connectionString = `DSN=${process.env.KPI_DSN};Driver={SQL Server};Database=${process.env.KPI_PRO};UID=${process.env.KPI_USER};PWD=${process.env.KPI_PASS}`

    if (database === 'mabkpi') {
        connectionString = `DSN=${process.env.KPI_DSN};Driver={SQL Server};Database=${process.env.KPI_MAB};UID=${process.env.KPI_USER};PWD=${process.env.KPI_PASS}`
    } else if (database === 'prokpi') {
        connectionString = `DSN=${process.env.KPI_DSN};Driver={SQL Server};Database=${process.env.KPI_PRO};UID=${process.env.KPI_USER};PWD=${process.env.KPI_PASS}`
    } 

    sql.open(connectionString, callback);
}

module.exports = {
    getMABConnection
};
