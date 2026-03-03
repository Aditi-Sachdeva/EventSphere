
// require('dotenv').config();

// const express = require('express');
// const {connectDb} = require('./src/config/db')

const cors = require("cors");

// const app = express();

// connectDb();

// app.use(express.json());


// app.use('/api/auth',require('./src/routes/authRoute'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server started at PORT : ${PORT}`);
// })




require("dotenv").config();

const express = require("express");
const { connectDb } = require("./src/config/db");

const app = express();

// ================= DATABASE =================
connectDb();


app.use(cors());

// ================= MIDDLEWARE =================
app.use(express.json());


// ================= ROUTES =================

// Auth Routes
app.use("/api/auth", require("./src/routes/authRoute"));

// ✅ Admin Routes (ADD THIS)
app.use("/api/admin", require("./src/routes/adminRoutes"));


// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API Running...");
});


// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
});