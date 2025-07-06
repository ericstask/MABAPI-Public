const letterdb = require('../config/lettersConfig');
const fs = require('fs');

exports.getLetterByCriteria = async function(criteria, page = 1, limit = 25, callback) {
    letterdb.getLettersConnection((err, connection) => {
        if (err) return callback(err, null);

        let query = `SELECT * FROM ReceivedEmail WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) AS totalItems FROM ReceivedEmail WHERE 1=1`;

        for (const [key, value] of Object.entries(criteria)) {
            if (key === 'start_date') {
                query += ` AND CAST(EmailDate AS DATE) >= ?`;
                countQuery += ` AND CAST(EmailDate AS DATE) >= ?`;
            } else if (key === 'end_date') {
                query += ` AND CAST(EmailDate AS DATE) <= ?`;
                countQuery += ` AND CAST(EmailDate AS DATE) <= ?`;
            } else if (key === 'html_search') {
                query += ` AND HTML LIKE ?`;
                countQuery += ` AND HTML LIKE ?`;
            } else if (key === 'client') {
                query += ` AND EmailBcc LIKE ?`;
                countQuery += ` AND EmailBcc LIKE ?`;
            } else {
                query += ` AND ${key} = ?`;
                countQuery += ` AND ${key} = ?`;
            }
        }

        // Add pagination
        const offset = (page - 1) * limit;  

        query += ` ORDER BY ReferenceNumber, EmailDate OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`;

        const values = [...Object.entries(criteria).map(([key, value]) => key === 'html_search' || key === 'client' ? `%${value}%` : value), offset, limit];

        console.log(query)
        console.log(values)

        connection.query(countQuery, values.slice(0, -2), (err, countResult) => {
            if (err) {
                console.error("Database error: ", err);
                return callback(err, null);
            }

            const totalItems = countResult[0].totalItems;
 
            connection.query(query, values, (err, rows) => {
                if (err) return callback(err, null);

                callback(null, { results: rows, total: totalItems });
            });
        });
    });
}


exports.getAllLettersByCriteria = async function(criteria, writableStream, callback) {
    letterdb.getLettersConnection((err, connection) => {
        if (err) return callback(err);

        let query = `SELECT * FROM ReceivedEmail WHERE 1=1`;
        let values = [];

        for (const [key, value] of Object.entries(criteria)) {
            if (key === 'start_date') {
                query += ` AND CAST(EmailDate AS DATE) >= ?`;
                values.push(value)
            } else if (key === 'end_date') {
                query += ` AND CAST(EmailDate AS DATE) <= ?`;
                values.push(value)
            } else if (key === 'html_search') {
                query += ` AND HTML LIKE ?`;
                values.push(`%${value}%`)
            } else if (key === 'client') {
                query += ` AND EmailBcc LIKE ?`;
                values.push(`%${value}%`)
            } else {
                query += ` AND ${key} = ?`;
                values.push(value)
            }
        }

        query += ` ORDER BY ReferenceNumber, EmailDate`;

        console.log(query)
        console.log(values)

        // Use queryRaw to get column metadata and rows
        connection.queryRaw(query, values, (err, result) => {
            if (err) {
                console.error('Query error:', err);
                return callback(err);
            }

            const {meta, rows} = result;

            let total = 0;

            try {
                rows.forEach(row => {
                    const rowObj = {};
                    meta.forEach((col, index) => {
                        rowObj[col.name] = row[index];
                    })

                    writableStream.write(JSON.stringify(rowObj) + '\n');
                    total++;
                });

                writableStream.end(() => callback(null, { totalRows: total }));
            } catch (error) {
                writableStream.destroy();
                callback(error);
            }
        });
    });
}

