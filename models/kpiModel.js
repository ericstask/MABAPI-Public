const kpidb = require('../config/kpiConfig');
const AppError = require('../utils/appError')

// GENERAL METHODS FOR RETREIVEING DATA
function getByCriteria(tablename, criteria, callback) {
    kpidb.getMABConnection('prokpi', (err, connection) => {
        if (err) return callback(err, null);

        let query = `SELECT * FROM ${tablename} WHERE 1=1`;

        for (const [key, value] of Object.entries(criteria)) {
            query += ` AND ${key} = ?`;
        }

        const values = Object.values(criteria);

        connection.query(query, values, (err, rows) => {
            callback(err, rows);
        });
    });
}

exports.getEmployeesByCriteria = async function(criteria, callback) {
    getByCriteria('Employee', criteria, callback);
}

exports.getDesksByCriteria = async function(criteria, callback) {
    getByCriteria('AllDesks', criteria, callback);
}

exports.getTransByCriteria = async function(criteria, callback) {
    getByCriteria('AllTrans', criteria, callback);
}


// METHODS FOR RETREIVING DATA FOR SPECIFIC REPORTS 
exports.getPayForPerformanceData = async function(startDate, endDate, employeeIdList, callback) {
    console.log('getPayForPerformanceData');
    // BREAKS IF ONLY ONE EMPLOYEE ID IS SUBMITTED

    kpidb.getMABConnection('prokpi', (err, connection) => {
        if (err) return callback(err, null);

        const placeholders = employeeIdList.map(() => '?').join(',');

        let query = `
            SELECT
                E.*, -- All fields from Employee
                AT.*, -- All fields from AllTrans
                AD.LegacyDeskID, AD.LegacyHostID, AD.DeskName, AD.TeamName, AD.ManagerName
            FROM Employee E
            JOIN EmployeeDeskXRef DR ON E.AssociateID = DR.AssociateID
            JOIN AllDesks AD ON DR.DeskID = AD.DeskID
            JOIN AllTrans AT ON AD.DeskID = AT.DeskID
            WHERE AT.PostingDateTime BETWEEN ? AND ?
            AND E.EmployeeID IN (${placeholders})
        `;

        const values = [startDate, endDate, ...employeeIdList];

        connection.query(query, values, (err, rows) => {
            callback(err, rows);
        });
    });
}

// COLLECTOR GOAL SUMMARY MODELS ////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getCIAndBOAPostdatesData = async function(startDate, endDate, callback) {
    console.log('getCIAndBOAPostdatesData');

    kpidb.getMABConnection('prokpi', (err, connection) => {
        if (err) return callback(err, null);

        let query = `
            SELECT
                DSK.LegacyHostID, DSK.LegacyDeskID, DSK.GoalAmount,
                DBT.DeskID,
                PD.DateCreated, PD.CheckAmount, PD.ProjectedCommissionAmount, PD.DepositDate, PD.DateDeleted,
                E.EmployeeID, E.AssociateID
            FROM Cubs_PostDate PD
            JOIN Cubs_Debtor DBT ON DBT.DebtorID = PD.DebtorID
            JOIN Cubs_Desk DSK ON DSK.LegacyHostID = DBT.LegacyHostID
                AND DSK.LegacyDeskID = DBT.LegacyDeskID
            LEFT JOIN EmployeeDeskXRef DR ON DBT.DeskID = DR.DeskID
            LEFT JOIN Employee E ON DR.AssociateID = E.AssociateID
            WHERE PD.DepositDate BETWEEN ? and ?
        `;

        const values = [startDate, endDate];

        connection.query(query, values, (err, rows) => {
            callback(err, rows);
        });
    });
}

exports.getMABAndTUMPostdatesData = async function(startDate, endDate, callback) {
    // [Error: [Microsoft][ODBC SQL Server Driver][SQL Server]Invalid object name 'EmployeeDeskXRef'.]
    console.log('getMABAndTUMPostdatesData');

    kpidb.getMABConnection('mabkpi', (err, connection) => {
        if (err) return callback(err, null);

        let query = `
            SELECT
                DSK.LegacyHostID, DSK.LegacyDeskID, DSK.GoalAmount,
                DBT.DeskID,
                PD.DateCreated, PD.CheckAmount, PD.ProjectedCommissionAmount, PD.DepositDate, PD.DateDeleted
                --E.EmployeeID, E.AssociateID
            FROM Cubs_PostDate PD
            JOIN Cubs_Debtor DBT ON DBT.DebtorID = PD.DebtorID
            JOIN Cubs_Desk DSK ON DSK.LegacyHostID = DBT.LegacyHostID
                AND DSK.LegacyDeskID = DBT.LegacyDeskID
            --LEFT JOIN EmployeeDeskXRef DR ON DBT.DeskID = DR.DeskID
            --LEFT JOIN Employee E ON DR.AssociateID = E.AssociateID
            WHERE PD.DepositDate BETWEEN ? and ?
        `;

        const values = [startDate, endDate];

        connection.query(query, values, (err, rows) => {
            callback(err, rows);
        });
    });
}

exports.getDetailedPostedData = async function(startDate, endDate, callback) {
    console.log('getDetailedPostedData');

    kpidb.getMABConnection('prokpi', (err, connection) => {
        if (err) return callback(err, null);

        let query = `
            SELECT
                E.ZID, E.EmployeeID, E.AssociateID, E.FirstName, E.LastName, E.Title, E.Department, E.Deleted,
                DSK.LegacyHostID, DSK.LegacyDeskID, DSK.GoalAmount,
                AT.DebtorID, AT.PostingDateTime, AT.TransactionAmount, AT.CommissionAmount, AT.DeskID, AT.Calc_IsStandardPayment
            FROM Employee E
            JOIN EmployeeDeskXRef DR ON E.AssociateID = DR.AssociateID
            JOIN AllDesks DSK ON DR.DeskID = DSK.DeskID
            JOIN AllTrans AT ON DR.DeskID = AT.DeskID
            WHERE E.Title IN ('Team Lead', 'Collections')
                AND E.Deleted = 'False'
                AND AT.Calc_IsStandardPayment = 'True'
                AND AT.PostingDateTime BETWEEN ? and ?
        `;

        const values = [startDate, endDate];

        connection.query(query, values, (err, rows) => {
            callback(err, rows);
        });
    });
}

exports.getDetailedEmployeeData = async function(callback) {
    console.log('getDetailedEmployeeData');
    
    kpidb.getMABConnection('prokpi', (err, connection) => {
        if (err) return callback(err, null);

        let query = `
            SELECT
                E.ZID, E.EmployeeID, E.AssociateID, E.FirstName, E.LastName, E.Title, E.Department, E.Deleted, E.CUBSUserID, E.CUBSInitials,
                DR.DeskID
            FROM Employee E
            JOIN EmployeeDeskXRef DR ON E.AssociateID = DR.AssociateID
            WHERE E.Title IN ('Team Lead', 'Collections')
                AND E.Deleted = 'False'
        `;

        connection.query(query, (err, rows) => {
            callback(err, rows);
        });
    });
}
