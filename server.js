require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const corsOptions = {
//   origin: "http://localhost:5173",
//   optionsSuccessStatus: 200,
// };

const app = express();

const adminRoutes = require("./routes/adminRoutes");
const patrollerRoutes = require("./routes/patrollerRoutes");

// middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/admin", adminRoutes);
app.use("/api/patroller", patrollerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
