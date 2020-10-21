const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('ok')
})
app.get('/test', (req, res) => {
  res.send(
      {
           status:200,
           message:"ok"
      }
  )
})
app.get('/time', (req, res) => {
const today = new Date();
const time = today.getHours() + ":" + today.getSeconds();
  res.send(
    {status:200, message:time}
  )
})
app.get('/hello/:ID', (req, res) => {
  id = req.params;
    res.send(
      {status:200, message:"Hello, "+ id.ID}
    )
  })


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})