const Koa = require('koa')
const path = require('path')
const content = require('./util/content')
const mimes = require('./util/mimes')

const app = new Koa();
const staticPath = './static';

// 解析资源类型
function parseMime(url) {
  let extName = path.extname(url);
  extName = extName ? extName.slice(1) : 'unknown';
  return mimes[extName]
}

app.use(async (ctx) => {
  let fullStaticPath = path.join(__dirname, staticPath)

  let _content = await content(ctx, fullStaticPath)

  let _mine = parseMime(ctx.url)

  if(_mine) {
    ctx.type = _mine
  }

  if(_mine && _mine.indexOf('image/') >= 0){
    ctx.res.writeHead(200)
    ctx.res.write(_content, 'binary')
    ctx.res.end()
  } else {
    ctx.body = _content
  }
});

app.listen(3000)
console.log('static server');