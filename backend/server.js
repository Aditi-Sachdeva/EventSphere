
require('dotenv').config();

const express = require('express');
const {connectDb} = require('./src/config/db')

const cors = require("cors");

const app = express();

connectDb();

app.use(cors());
app.use(express.json());


app.use('/api/auth',require('./src/routes/authRoute'));

app.use("/api/admin", require("./src/routes/adminRoute"));

app.use("/api/club", require("./src/routes/clubRoute"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at PORT : ${PORT}`);
})




















