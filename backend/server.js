require('dotenv').config();

const express = require('express');
const {connectDb} = require('./src/config/db')

const cors = require("cors"); 
const helmet = require("helmet"); 
const morgan = require("morgan");

const app = express();

connectDb();

app.use(helmet());
app.use(morgan("dev"));

app.use(cors());
app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("EventSphere Backend is Running 🚀");
});

app.use('/api/auth',require('./src/routes/authRoute'));

app.use("/api/admin", require("./src/routes/adminRoute"));

app.use("/api/club", require("./src/routes/clubRoute"));

app.use("/api/event", require("./src/routes/eventRoute"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at PORT : ${PORT}`);

})

