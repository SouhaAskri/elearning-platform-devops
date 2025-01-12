const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const { connection } = require("./db");
const { userRouter } = require("./routes/users.routes");
const { courseRoute } = require("./routes/courses.route");
const { videoRoute } = require("./routes/videos.route");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const jwt = require("jsonwebtoken"); // Ensure you include this if using JWT
require("dotenv").config();

const app = express();

// Enable CORS with specific settings for security
app.use(
  cors({
    origin: ["https://your-frontend-domain.com"], // Specify allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Configure session management
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret", // Use an environment variable for the secret
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
    cookie: {
      secure: true, // Cookies transmitted only over HTTPS
      httpOnly: true, // Prevent access via JavaScript
      maxAge: 3600000, // 1 hour
    },
  })
);

// Initialize Keycloak
const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

// Middleware to parse JSON
app.use(express.json());

// Protected routes
app.use("/users", keycloak.protect(), userRouter);
app.use("/courses", keycloak.protect(), courseRoute);
app.use("/videos", keycloak.protect(), videoRoute);

// Regenerate token endpoint
app.get("/regenerateToken", (req, res) => {
  const rToken = req.headers.authorization?.split(" ")[1];
  if (!rToken) return res.status(400).json({ msg: "Missing token" });

  try {
    const decoded = jwt.verify(rToken, process.env.JWT_SECRET || "default-secret");
    const token = jwt.sign(
      { userId: decoded.userId, user: decoded.user },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" }
    );
    res.status(201).json({ msg: "Token created", token });
  } catch (err) {
    res.status(400).json({ msg: "Invalid Refresh Token" });
  }
});

// Base endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to SRM's Secure Backend" });
});

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(443, "0.0.0.0", async () => {
  try {
    await connection;
    console.log(`Connected to DB`);
    console.log(`Server running securely on https://localhost:443`);
  } catch (error) {
    console.error(`Database connection error: ${error}`);
  }
});
