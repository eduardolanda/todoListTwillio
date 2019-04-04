const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const pool = require('../../DB/db')
const MessagingResponse = require('twilio').twiml.MessagingResponse
var logger = require('koa-pino-logger')

const app = new Koa()
app.use(bodyParser())
app.use(logger())

function sendMessage(sms){
    const twiml = new MessagingResponse();
    twiml.message(sms);
    return twiml.toString();
}

app.use(async ctx => {
  ctx.type = 'text/xml';
  console.log(ctx.request.body)
  const dbItem = await ctx.request.body.Body
  await post(dbItem);
  ctx.body = sendMessage(dbItem);
  ctx.log.info('Item working properly')
})

async function post(dbItem) {
    try { 
      const itemData = await pool.query(`INSERT INTO todo.todoList (todoItem) VALUES ('${dbItem}');`)
      return itemData
    } catch (error) {
      console.log(error)
    }
  }
  

// app.post('/', (req, res) => {

//     const twiml = new MessagingResponse();
  
//     twiml.message('This is a testing message')
  
//     res.writeHead(200, { 'Content-Type': 'text/xml' });
//     res.end(twiml.toString());
//   })

  
module.exports = app.callback()
