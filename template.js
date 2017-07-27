
const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const app = new Koa()


app.use(views(path.join(__dirname, '/view')));

app.use( async function( ctx )  {
  let title = 'hello koa2';
  await ctx.render('index.ejs', {
    title,
  })
});

app.listen(3000);
console.log('[demo] ejs is starting at port 3000')