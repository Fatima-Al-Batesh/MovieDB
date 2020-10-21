const express = require('express')
const app = express()
const port = 3000

const movies = [
  { title: 'Jaws', year: 1975, rating: 8, id:12},
  { title: 'Avatar', year: 2009, rating: 7.8, id: 34 },
  { title: 'Brazil', year: 1985, rating: 8, id: 56 },
  { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2, id: 78}
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
app.get('/movies/read/by-date', (req, res) => {
  res.send(
      {
           status:200,
           data:movies.sort((a, b) => a.year - b.year)
      }
  )
})
app.get('/movies/read/by-rating', (req, res) => {
  res.send(
      {
           status:200,
           data:movies.sort((a, b) => b.rating - a.rating)
      }
  )
})

app.get('/movies/read/by-title', (req, res) => {
  movies1 = movies.sort((a, b) => {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
  });
  res.send(
      {
           status:200,
           data:movies1
      }
  )
})
app.get('/movies/read/id/:ID', (req, res) => {
  data = req.params;
  var movie = "";
  var exist = false;
  movies.map(item =>{
    if(data.ID == item.id){
      exist = true;
      movie= item;
    }
  })
  if (exist){
    res.send({status:200, data:movie})
  }else{
    res.send({status:404, error:true, message:'the movie <ID> does not exist'})
  }
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