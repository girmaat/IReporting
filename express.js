var express = require("express"); // For route handlers and templates to serve up.
var path = require("path"); // Populating the path property of the request
var bodyParser = require("body-parser"); // Easy access to the HTTP request body
var logger = require("morgan"); // HTTP request logging
var compress = require("compression");
var cors = require("cors");
var helmet = require("helmet"); // Helmet module for HTTP header hack mitigations
var responseTime = require("response-time"); // For code timing checks for performance logging
var RateLimit = require("express-rate-limit"); // IP based rate limiter
var csp = require("helmet-csp");

var users = require("./backend/routes/users");
var session = require("./backend/routes/session");
var sharedNews = require("./backend/routes/sharedNews");
var homeNews = require("./backend/routes/homeNews");

const app = express();

// Apply limits to all requests
var limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
});
app.use(limiter);

app.use(helmet()); // Take the defaults to start with
app.use(
  csp({
    // Specify directives for content sources
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "ajax.googleapis.com",
        "maxcdn.bootstrapcdn.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "maxcdn.bootstrapcdn.com"],
      fontSrc: ["'self'", "maxcdn.bootstrapcdn.com"],
      imgSrc: ["*"],
      // reportUri: '/report-violation',
    },
  })
);

// Adds an X-Response-Time header to responses to measure response times
app.use(responseTime());

// logs all HTTP requests. The "dev" option gives it a specific styling
app.use(logger("dev"));

// Sets up the response object in routes to contain a body property with an object of what is parsed from a JSON body request payload
// There is no need for allowing a huge body, it might be some type of attack, so use the limit option
app.use(bodyParser.json({ limit: "100kb" }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Simplifies the serving up of static content such as HTML for the React SPA, images, CSS files, and JavaScript files
app.use(express.static(path.join(__dirname, "build")));

//
// Rest API routes
app.use("/api/users", users);
app.use("/api/sessions", session);
app.use("/api/sharednews", sharedNews);
app.use("/api/homenews", homeNews);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
module.exports = app;
