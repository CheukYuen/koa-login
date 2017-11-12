const fs = require('fs'),
  url = require('url'),
  path = require('path'),
  http = require('http'),
  MIME = require('./MIME'),
  zlib = require("zlib"),
  querystring = require('querystring');

let crypto = require("crypto");

let hashStr = "A hash string.",
  hash = crypto.createHash('sha1').update(hashStr).digest('base64');

let staticPath = './';

let Expires = {
  fileMatch: /^(gif|png|jpg|js|css)$/ig,
  maxAge: 0
};

let app = http.createServer((req, res) => {
  let pathName = url.parse(req.url).pathname;
  console.log(`pathName: ${pathName}`);

  let params = url.parse(req.url).query;
  console.log(`params: ${params}`);
  if (pathName === '/post-form-data') {
    let body = "";
    req.on('data', function (chunk) {
      body += chunk;
      console.log(`chunk: ${chunk}`);
    });

    req.on('end', function () {
      body = querystring.parse(body);
      console.log("body: ", body)
    });
    return;
  }

  //4. In case ../1.html
  let realPath = path.join(staticPath, path.normalize(pathName.replace(/\.\./g, "")));
  console.log(`realPath ${realPath}`);
  fs.exists(realPath, (exists) => {
    if (!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write(`This request URL ' ${realPath} ' was not found.`);
      console.log(`This request URL ' ${realPath} ' was not found.`);
      res.end();
    } else {
      fs.readFile(realPath, "binary", (err, file) => {
        if (err) {
          res.writeHead(500, {"Content-Type": "text/plain"});
          console.log(err);
          res.end(err);
        } else {
          // res.setHeader("Access-Control-Allow-Origin", "http://localhos1t:63341/");
          let extName = path.extname(realPath);

          extName = extName ? extName.slice(1) : "";
          //MIME
          let contentType = MIME[extName] || "text/plain";


          //1. Expires / Cache-Control
          if (extName.match(Expires.fileMatch)) {
            let expires = new Date();
            expires.setUTCHours(24);
            expires.setTime(expires.getTime() + Expires.maxAge * 1000);
            res.setHeader("Expires", expires.toUTCString());
            res.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
          }

          //2. Last-Modified / Etag
          let stat = fs.statSync(realPath);
          let lastModified = stat.mtime.toUTCString();
          res.setHeader("Last-Modified", lastModified);
          if (req.headers["if-modified-since"] && lastModified === req.headers["if-modified-since"]) {
            res.writeHead(304, "Not Modified");
            res.end();
            return;
          }

          // if (req.headers['if-none-match'] === hash) {
          //   res.writeHead(304, "Not Modified (lastModified)");
          //
          //   res.end();
          //   return
          // } else {
          //   res.setHeader("Etag", hash);
          // }

          //3. Gzip or deflate
          let raw = fs.createReadStream(realPath);
          let acceptEncoding = req.headers['accept-encoding'] || '';
          if (acceptEncoding.match(/\bdeflate\b/)) {
            res.writeHead(200, {'Content-Encoding': 'deflate', 'Content-Type': contentType});

            raw.pipe(zlib.createDeflate()).pipe(res);
          } else if (acceptEncoding.match(/\bgzip\b/)) {
            res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': contentType});
            raw.pipe(zlib.createGzip()).pipe(res);
          } else {
            res.writeHead(200, {'Content-Type': contentType});
            raw.pipe(res);
          }
        }
      });
    }
  });
});

app.listen(4000);
console.log('Server start, port:4000');