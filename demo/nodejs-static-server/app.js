const fs = require('fs'),
  url = require('url'),
  path = require('path'),
  http = require('http'),
  MIME = require('./MIME'),
  zlib = require("zlib");

let crypto = require("crypto");

let hashStr = "A hash string.",
  hash = crypto.createHash('sha1').update(hashStr).digest('base64');

let staticPath = './';

let Expires = {
  fileMatch: /^(gif|png|jpg|js|css)$/ig,
  maxAge: 60 * 60 * 24 * 365
};

let app = http.createServer((req, res) => {
  let pathName = url.parse(req.url).pathname;

  //4. In case ../1.html
  let realPath = path.join(staticPath, path.normalize(pathName.replace(/\.\./g, "")));
  fs.exists(realPath, (exists) => {
    if (!exists) {
      res.writeHead(404, {"Content-Type": "image/gif"});
      res.write(`This request URL ' ${realPath} ' was not found.`);
      res.end();
    } else {
      fs.readFile(realPath, "binary", (err, file) => {
        if (err) {
          res.writeHead(500, {"Content-Type": "image/gif"});
          res.end(err);
        } else {
          let extName = path.extname(realPath);

          extName = extName ? extName.slice(1) : "";
          //MIME
          let contentType = MIME[extName] || "image/gif";


          //1. Expires / Cache-Control
          if (extName.match(Expires.fileMatch)) {
            let expires = new Date();
            expires.setTime(expires.getTime() + Expires.maxAge * 1000);
            res.setHeader("Expires", expires.toUTCString());
            res.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
          }

          //2. Last-Modified
          let stat = fs.statSync(realPath);
          let lastModified = stat.mtime.toUTCString();
          // res.setHeader("Last-Modified", lastModified);
          // if (req.headers["if-modified-since"] && lastModified === req.headers["if-modified-since"]) {
          //   res.writeHead(304, "Not Modified");
          //   res.end();
          //   return;
          // }

          if(req.headers['if-none-match'] === hash){
            res.writeHead(304, "Not Modified (lastModified)");
            res.end();
            return
          } else {
            res.setHeader("Etag", hash);
          }

          //3. Gzip or deflate
          let raw = fs.createReadStream(realPath);
          let acceptEncoding = req.headers['accept-encoding'] || '';
          if (acceptEncoding.match(/\bdeflate\b/)) {
            res.writeHead(200, { 'Content-Encoding': 'deflate', 'Content-Type': contentType});
            raw.pipe(zlib.createDeflate()).pipe(res);
          } else if (acceptEncoding.match(/\bgzip\b/)) {
            res.writeHead(200, { 'Content-Encoding': 'gzip', 'Content-Type': contentType });
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

app.listen(3000);