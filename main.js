const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')
const { extractSheets } = require('spreadsheet-to-json')
const port = 7788

async function getRoomStatusFromSpreadSheet () {
  const token = process.env.GOOGLE_SHEETS_API_KEY
  if (!token) throw new Error('Environment variable GOOGLE_SHEETS_API_KEY is needed')

  const spreadsheetKey = '1oKwGx0_R8T1-RDTPfqeLORJu6IQJdVFXUDfjchFc8XA'
  const sheetsToExtract = ['status']
  
  const { status: rooms } = await extractSheets({
    credentials: token,
    spreadsheetKey,
    sheetsToExtract
  })

  return {
    roomsStatus: rooms.map((room) => ({
      ...room,
      isFull: room.isFull === 'Y'
    }))
  }
}

async function start () {
  let dataToReturn = await getRoomStatusFromSpreadSheet()
  const app = new Koa()
  const router = new Router()

  router.get('/api/rooms_status', (ctx) => {
    ctx.status = 200
    ctx.body = dataToReturn
  })

  app
    .use(cors())
    .use(bodyparser())
    .use(router.routes())
    .use(router.allowedMethods())

  const server = http.createServer(app.callback())
  const io = require('socket.io')(server)

  setInterval(async () => {
    let newData = await getRoomStatusFromSpreadSheet()
    if (JSON.stringify(newData) !== JSON.stringify(dataToReturn)) {
      dataToReturn = newData
      io.emit('update')
    }
  }, 5000)

  server.listen(port, () => {
    console.log(`listening on port: ${port}`)
  })
}

start()
