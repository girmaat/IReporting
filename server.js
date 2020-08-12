import app from "./express";

app.get("/", function (req, res) {
  console.log("Send message on req");
  res.send("Hello my first Github");
});
