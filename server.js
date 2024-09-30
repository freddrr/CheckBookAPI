const express = require("express");
const app = express();
const cors = require("cors");
const sql = require("mssql");

require('dotenv').config();

const PORT = process.env.PORT;
const password = process.env.PASSWORD;
const config = {
    user: 'freddytrae',
    password: password,
    server: 'traeserver.database.windows.net',
    port: 1433,
    database: 'CheckBookAPI',
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

app.get("/getUserBalance", async (req, res) => {
    try {
        var poolConnection = await sql.connect(config);
        console.log("connection worked");
        var resultSet = await poolConnection.request().query('SELECT UserAndBalance.UserBalance FROM UserAndBalance WHERE UserAndBalance.UserID=1');
        var userBalance
        resultSet.recordset.forEach(row => {
            userBalance = row.UserBalance;
        })
        res.json({"UserBalance": `${userBalance}`});
    } catch(err) {
        console.log(err.message);
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})