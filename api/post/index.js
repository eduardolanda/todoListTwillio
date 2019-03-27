const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const pool = require('../../DB/db')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const app = new Koa()
app.use(bodyParser())

function sendMessage(sms){
    const twiml = new MessagingResponse();
    twiml.message(sms);
    return twiml.toString();
}

app.use(async ctx => {
  ctx.type = 'text/xml';
  const dbItem = await ctx.request.body.item
  const dbDueBy = await ctx.request.body.by
  const item = await post(dbItem,dbDueBy);
  ctx.body = sendMessage(`Item created`);
})

async function post(dbItem,dbDueBy) {
  try {
    const itemData = await pool.query(`INSERT INTO todo.todoList (todoDateAdded,todoDueBy,todoItem)
    VALUES ( NOW(), DATE '${dbDueBy}', "${dbItem}" );`)
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
