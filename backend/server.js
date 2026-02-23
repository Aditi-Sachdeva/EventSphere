
require('dotenv').config();

const express = require('express');
const {connectDb} = require('./src/config/db')

const app = express();

connectDb();

app.use(express.json());


app.use('/api/auth',require('./src/routes/authRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at PORT : ${PORT}`);
})