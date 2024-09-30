const express = require("express");
const app = express();
const cors = require("cors");

require('dotenv').config();

const PORT = process.env.PORT;

app.get("/api", (req, res) => {
    res.json({fruits: ["banana", "orange", "watermelon", "avocado"]});
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})