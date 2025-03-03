import express from "express";
import path from "path";
import connectDB from "./config/db";
import cron from "node-cron";
import { monitorAvaility } from "./utils/bot";
import { MemberModel } from "./models/member";
import { LogModel } from "./models/log";

connectDB();
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let userLoggedIn = false;

app.get("/", (req, res) => {
  res.render("index", { userLoggedIn });
});

app.post("/confirm-login", (req, res) => {
  userLoggedIn = true;
  res.redirect("/");
});

app.get("/dashboard", async (req, res) => {
  const members = await MemberModel.find().sort({ detectedAt: -1 }).limit(20);
  const logs = await LogModel.find().sort({ timestamp: -1 }).limit(20);
  res.render("dashboard", { members, logs, content: "Dashboard Page Content" });  // ✅ Remove 'body'
});

cron.schedule("* * * * *", async () => {
  if (userLoggedIn) await monitorAvaility();
});

app.listen(5005, () => console.log("🚀 Server running on port 5005"));
