const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcrypt')

const MongoClient = require('mongodb').MongoClient
//require users routes
var users = require('./users.js');


MongoClient.connect('mongodb+srv://fatima_batesh:d7WBMJAAur3ctVX0@cluster0.pcdza.mongodb.net/cluster0?retryWrites=true&w=majority', { useUnifiedTopology: true }, (err, client) => {
  const dbUsers = client.db('users')
  const usersCollection = dbUsers.collection('users')
  //authorized user check function
// const auth = (username, password) => {
//   let auth = false
//   usersCollection.find().toArray()
//       .then(results => {
//         results.map(item =>{
//           if(username === item.username){
//               if (bcrypt.compare(password, item.password)){
//                 auth = true;
//               }
//           }
//         })
//       })
//   return auth
// }
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('movies')
  const moviesCollection = db.collection('movies')

  //users
  app.use('/user', users);

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

    //update
    app.post('/movies/update/:ID', async(req, res) => {
      data = req.params;
      newTitle = req.query.title
      newYear = Number(req.query.year)
      newRating = Number(req.query.rating)
      var exist = false;
      let index;
      var result;
      let existing = false;
    usersCollection.find().toArray()
      .then(result => {
        result.map(item =>{
          if(req.query.username === item.username){
              if (bcrypt.compare(req.query.password, item.password)){
                existing = true;
                user= item;
              }
          }
        })
      })
      //if (auth(req.query.username,req.query.password)){
      moviesCollection.find().toArray()
      .then(results => {
        
        for (var i = 0; i<results.length;i++){
          if (data.ID == results[i]._id){
            exist = true;
            index = i;
          }
        }
         result = results[index];
      if (existing){
      if (exist){
      Old = {"title":result.title,"year":result.year,"rating":result.rating};
      var New = JSON.stringify({title:"result.title",year:"result.year",rating:"result.rating"});
      
      
      if (!(newTitle || newYear || newRating) ){
          moviesCollection.updateOne(Old, Old);
          res.send({status: 200, message:'Nothing was updated'})
      }
      
      if (newTitle) {
          
          New = New.replace('"result.title"', '"' + newTitle + '"')
      }else {
          New = New.replace('"result.title"', '"' + result.title + '"')
      }
      
      if (newYear) {
          New = New.replace('"result.year"', newYear)
      }else {
          New = New.replace('"result.year"', result.year)
      }
      
      if (newRating) {
          New = New.replace('"result.rating"', newRating)
      }else {
          New = New.replace('"result.rating"', result.rating)
      }
      
      newJson = JSON.parse(New)
      moviesCollection.updateOne(Old, {$set: newJson})
      // moviesCollection.find().toArray()
      // .then(items => {
      // res.send({status:200, data:items})
      // })
      .catch(error => console.error(error)) 
      
      }else {
          res.send({status:404, error:true, message:'the movie <ID> does not exist'})
        }
      }else  res.send({status:404, error:true, message:'Cannot find username or password'})

    })
    .catch(error => console.error(error))
  //}else res.send({status:404, error:true, message:auth(req.query.username,req.query.password)})
  })
  //delete
app.delete('/movies/delete/:ID', (req, res) => {
  data = req.params;
  let index;
  let exist = false;
  var result;
  moviesCollection.find().toArray()
      
      .then(results => {
        
        for (var i = 0; i<results.length;i++){
          if (data.ID == results[i]._id){
            exist = true;
            index = i;
          }
        }
         result = results[index];
        
    if (exist){
      moviesCollection.deleteOne(result);
      res.send(
        {
             status:200,
             message:'data is deleted'
        } )
    }else {
      res.send({status:404, error:true, message:'the movie <ID> does not exist'})
    }
  }) 
  .catch(error => console.error(error))
  })
  
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})