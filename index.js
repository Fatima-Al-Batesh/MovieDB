const express = require('express')
const app = express()
const port = 3000
const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb+srv://fatima_batesh:d7WBMJAAur3ctVX0@cluster0.pcdza.mongodb.net/cluster0?retryWrites=true&w=majority', (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('movies')
  const moviesCollection = db.collection('movies')
  //create
  app.post('/movies/add', (req, res) => {
  newTitle = req.query.title
  newYear = Number(req.query.year)
  newRating = req.query.rating
  if (newTitle && newYear && newYear>=1888 && newYear<=2020){
    if (newRating){
    moviesCollection.insertOne({title: newTitle, year: newYear, rating: newRating})
      .then(result => {
        console.log(result)
        res.send(
          {
               status:200,
               message:'data is added'
          } )
      }) 
      .catch(error => console.error(error))
    }else{
      moviesCollection.insertOne({title: newTitle, year: newYear, rating: 4})
      .then(result => {
        console.log(result)
        res.send(
          {
               status:200,
               data:'data is added'
          } )
      }) 
      .catch(error => console.error(error))
      
    }
  }else{
    res.send({status:403, error:true, message:'you cannot create a movie without providing a title and a year'})
  }
  })
  //read all movies
  app.get('/movies/read', (req, res) => {
    moviesCollection.find().toArray()
      .then(results => {
        res.send(
          {
               status:200,
               data:results
          } )
      })
      .catch(error => console.error(error))
  })
  // read all movies sorted by year
  app.get('/movies/read/by-date', (req, res) => {
    moviesCollection.find().toArray()
      .then(results => {
        res.send(
          {
               status:200,
               data:results.sort((a, b) => a.year - b.year)
          } )
      })
      .catch(error => console.error(error))
  })
  //read all movies sorted by rating
  app.get('/movies/read/by-rating', (req, res) => {
    moviesCollection.find().toArray()
      .then(results => {
        res.send(
          {
               status:200,
               data:results.sort((a, b) => b.rating - a.rating)
          } )
      })
      .catch(error => console.error(error))
  })
  //read all movies sorted by title
  app.get('/movies/read/by-title', (req, res) => {
    moviesCollection.find().toArray()
      .then(results => {
        res.send(
          {
               status:200,
               data:results.sort((a, b) => {
                            let aTitle = a.title.toLowerCase();
                            let bTitle = b.title.toLowerCase();
                            if (aTitle < bTitle) {
                                return -1;
                            }
                            if (aTitle > bTitle) {
                                return 1;
                            }
                            return 0;
                          })
          } )
      })
      .catch(error => console.error(error))
  })
  //read movie by id
  app.get('/movies/read/id/:ID', (req, res) => {
    data = req.params;
    var movie = "";
    let exist = false;
    moviesCollection.find().toArray()
      .then(results => {
        results.map(item =>{
          if(data.ID == item._id){
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
      .catch(error => console.error(error))
    })
  //   //update
  //   app.post('/movies/update-db/:ID', (req, res) => {
  //     data = req.params;
  //     newTitle = req.query.title
  //     newYear = Number(req.query.year)
  //     newRating = Number(req.query.rating)
  //     let exist = false;
  //     let index;
  //     moviesCollection.find().toArray()
      
  //     .then(results => {
        
  //       for (var i = 0; i<results.length;i++){
  //         if (data.ID == results[i]._id){
  //           exist = true;
  //           index = i;
  //         }
  //       }
  //       let result = results[index];
        
      
      
  //     if (exist){
  //     if(newTitle) 
  //     //   //   if(newYear) moviesCollection.updateOne(results[index].year, newYear)
  //     //   //   if(newRating) moviesCollection.updateOne(results[index].rating, newRating)
  //     //   //   // moviesCollection.find().toArray()
  //     //   .then(results => {
  //     res.send({status:200, data:moviesCollection.updateOne(result.title, newTitle)})
  //     //    })
  //     //   //   // .catch(error => console.error(error)) 
  //     }//else {
  //     //   //   res.send({status:404, error:true, message:'the movie <ID> does not exist'})
  //     //   // }
  //   })
  //   .catch(error => console.error(error))
  // })
  
})

// //update
// app.put('/movies/update/:ID', (req, res) => {
  // data = req.params;
  // newTitle = req.query.title
  // newYear = Number(req.query.year)
  // newRating = Number(req.query.rating)
  // let index
  // let exist = false;
  // for(var i = 0; i < movies.length; i++){
    // if(data.ID == movies[i].id){
      // exist = true;
      // index= i;
    // }
  // }
  // if (exist){
    // if(newTitle) movies[index].title = newTitle
    // if(newYear) movies[index].year = newYear
    // if (newRating) movies[index].rating = newRating
    // res.send({status:200, data:movies})
  // }else {
    // res.send({status:404, error:true, message:'the movie <ID> does not exist'})
  // }
// })
// //delete
// app.delete('/movies/delete/:ID', (req, res) => {
  // data = req.params;
  // let index
  // let exist = false;
  // for(var i = 0; i < movies.length; i++){
    // if(data.ID == movies[i].id){
      // exist = true;
      // index= i;
    // }
  // }
  // if (exist){
    // movies.splice(index,1);
    // res.send({status:200, data:movies})
  // }else {
    // res.send({status:404, error:true, message:'the movie <ID> does not exist'})
  // }
// })


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})