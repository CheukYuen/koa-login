const http = require('http');

let contents = "Hello World";
// 配置参数
let opt = {
  host: "localhost",
  path:'/',
  port:3000,
  method:'POST',
  headers:{
    'Content-Type':'application/x-www-form-urlencoded',
    'Content-Length':contents.length
  }
}
let req = http.request(opt,(res)=>{
  // res是请求返回结果
})
req.write(contents);
req.end();