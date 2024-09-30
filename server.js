const express = require("express");
const app = express();
const cors = require("cors");


app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "orange", "watermelon"]});
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
})