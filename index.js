const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./src/config/dbConnection");
const authRoute = require("./src/routes/authRoute");

dotenv.config();
dbConnect();
const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://resetasswordapp.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 4000;
app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
