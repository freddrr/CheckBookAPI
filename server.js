const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const sql = require("mssql");
const {pool} = require("mssql/lib/global-connection");

require('dotenv').config();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

app.put("/addTransaction", async (req, res) => {
    try {
        console.log("Made it here");
        var poolConnection = await sql.connect(config);
        console.log("transaction connection worked");
        let ts = Date.now();

        let date_time = new Date(ts);
        let date = date_time.getDate();
        let month = date_time.getMonth() + 1;
        let year = date_time.getFullYear();

// prints date & time in YYYY-MM-DD format
        let currDate = year + "-" + month + "-" + date;
        //var queryString = "INSERT INTO UserTransaction (UserTransaction.UserID, UserTransaction.Amount, UserTransaction.DateOfTransaction, UserTransaction.Category) VALUES (req.body.UserID, req.body.Amount, Date().now.toString(), req.body.Category)";
        let request = await poolConnection.request()
            .input('UserID', sql.TYPES.Int, req.body.UserID)
           .input('Amount', sql.TYPES.NVarChar, req.body.Amount)
            .input('Date', sql.TYPES.NVarChar, currDate)
            .input('Category', sql.TYPES.NVarChar, req.body.Category)
            .query("INSERT INTO UserTransaction (UserTransaction.UserID, UserTransaction.Amount, UserTransaction.DateOfTransaction, UserTransaction.Category) VALUES (1, @Amount, @Date, @Category)");
        //var resultSet = poolConnection.request().query("INSERT INTO UserTransaction (UserTransaction.UserID, UserTransaction.Amount, UserTransaction.DateOfTransaction, UserTransaction.Category) VALUES (req.body.UserID, req.body.Amount, Date().now.toString(), req.body.Category)");
        //console.log(req.body.DateOfTransaction);
        updateBalanceAfterTransaction(req.body.Amount);
        res.send("Request made");
    } catch(err) {
        console.log(err.message);
    }
})

async function updateBalanceAfterTransaction(amount) {
    try {
        var poolConnection = await sql.connect(config);
        console.log("connection worked");
        var resultSet = await poolConnection.request().query('SELECT UserAndBalance.UserBalance FROM UserAndBalance WHERE UserAndBalance.UserID=1');
        var userBalance
        resultSet.recordset.forEach(row => {
            userBalance = row.UserBalance;
        })
        var newBalanceFloat = parseFloat(userBalance) - parseFloat(amount);
        await poolConnection.request()
            .input('NewBalance', sql.TYPES.NVarChar, newBalanceFloat.toString())
            .query('UPDATE UserAndBalance SET UserAndBalance.UserBalance=@NewBalance WHERE UserAndBalance.UserID=1');
    } catch (err) {
        console.log(err.message);
    }

}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})