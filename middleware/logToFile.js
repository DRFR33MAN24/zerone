const fs = require("fs");

let SiteLogger = (req, res, next) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let body = {};
  let content = {};
  if (method === "GET") {
    let content = req.query;
  } else {
    body = req.body;
  }
  let url = req.url;
  let status = res.statusCode;

  let log = `[
    ${formatted_date}
  ] ${method}:${url} ${status} 
     + "ms" + ${method === "GET" ? content : body}`;
  console.log(log);
  fs.appendFile("request_logs.txt", log + "\n", err => {
    if (err) {
      console.log(err);
    }
  });
  next();
};

module.exports = { SiteLogger };
