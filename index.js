const express = require('express')
const app = express()
const port = 3000

const movies = [
  { title: 'Jaws', year: 1975, rating: 8 },
  { title: 'Avatar', year: 2009, rating: 7.8 },
  { title: 'Brazil', year: 1985, rating: 8 },
  { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

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
  data = req.params;
    res.send(
      {status:200, message:"Hello, "+ data.ID}
    )
})
app.get('/search', (req, res) => {
  search=req.query.s
    if (!search){
      res.send(
      {status:500, error:true, message:"you have to provide a search"}
      )
    }else{
      res.send(
        {status:200, message:"ok", data:search}
      )
    }
})
//create
app.get('/movies/create', (req, res) => {
  res.send(
      {
           status:200,
           data:"ok"
      }
  )
})

//read
app.get('/movies/read', (req, res) => {
  res.send(
      {
           status:200,
           data:movies
      }
  )
})
//update
app.get('/movies/update', (req, res) => {
  res.send(
      {
           status:200,
           data:"ok"
      }
  )
})
//delete
app.get('/movies/delete', (req, res) => {
  res.send(
      {
           status:200,
           data:"ok"
      }
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})