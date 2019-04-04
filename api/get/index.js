const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const pool = require('../../DB/db')
var logger = require('koa-pino-logger')

const app = new Koa()
app.use(bodyParser())
app.use(logger())

app.use(async ctx => {
  // const dbtitle = await ctx.request.body.title
  
  const item = await show()
  ctx.body = item
  ctx.log.info('testing right')
  // throw Error('Failed')
})

async function show() {
  try {
    const itemData = await pool.query(`SELECT todoItem FROM todo.todoList`)
    return itemData
  } catch (error) {
    console.log(error)
  }
}

module.exports = app.callback()
