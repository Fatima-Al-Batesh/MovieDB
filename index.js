const express = require('express')
const app = express()
const port = 3000

var movies = [
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
app.get('/movies/add', (req, res) => {
  newTitle = req.query.title
  newYear = Number(req.query.year)
  newRating = req.query.rating
  movies.push({title: newTitle, year: newYear, rating: newRating})
  if (newTitle && newYear && newYear>=1888 && newYear<=2020){
    if (newRating){
      res.send(
          {
               status:200,
               data: movies
          }
      )
    }else{
      movies.push({title: newTitle, year: newYear, rating: 4})
      res.send(
          {
               status:200,
               data: movies
          }
      )
    }
  }else{
    res.send({status:403, error:true, message:'you cannot create a movie without providing a title and a year'})
  }
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
  let exist = false;
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
app.get('/movies/update/:ID', (req, res) => {
  data = req.params;
  newTitle = req.query.title
  newYear = Number(req.query.year)
  newRating = Number(req.query.rating)
  let index
  let exist = false;
  for(var i = 0; i < movies.length; i++){
    if(data.ID == movies[i].id){
      exist = true;
      index= i;
    }
  }
  if (exist){
    if(newTitle) movies[index].title = newTitle
    if(newYear) movies[index].year = newYear
    if (newRating) movies[index].rating = newRating
    res.send({status:200, data:movies})
  }else {
    res.send({status:404, error:true, message:'the movie <ID> does not exist'})
  }
})
//delete
app.get('/movies/delete/:ID', (req, res) => {
  data = req.params;
  let index
  let exist = false;
  for(var i = 0; i < movies.length; i++){
    if(data.ID == movies[i].id){
      exist = true;
      index= i;
    }
  }
  if (exist){
    movies.splice(index,1);
    res.send({status:200, data:movies})
  }else {
    res.send({status:404, error:true, message:'the movie <ID> does not exist'})
  }
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})