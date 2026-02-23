const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./src/config/dbConnection");
const authRoute = require("./src/routes/authRoute");

dotenv.config();
dbConnect();
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);

const PORT = process.env.PORT || 4000;
app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
