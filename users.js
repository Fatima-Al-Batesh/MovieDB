// users.js users routes

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb+srv://fatima_batesh:d7WBMJAAur3ctVX0@cluster0.pcdza.mongodb.net/cluster0?retryWrites=true&w=majority', { useUnifiedTopology: true }, (err, client) => {
    const dbUsers = client.db('users')
    const usersCollection = dbUsers.collection('users')
//create users
router.post('/', async (req, res) => {
    try{
      newUsername = req.query.username
      newPassword = req.query.password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      if (newUsername && newPassword){
        usersCollection.insertOne({username: newUsername, password: hashedPassword})
          .then(result => {
            console.log(result)
            res.send(
              {
                   status:200,
                   message:'user is added'
              } )
          }) 
          .catch(error => console.error(error))
      
      }else{
        res.send({status:403, error:true, message:'enter a username and a password to sign up'})
      }
    }catch{
        res.status(500).send();
    }
})
  //read all users
  router.get('/read', (req, res) => {
    usersCollection.find().toArray()
      .then(results => {
        res.send(
          {
               status:200,
               data:results
          } )
      })
      .catch(error => console.error(error))
  })
//read user data by username
  router.get('/read/by', (req, res) => {
    var user = "";
    let existing = false;
    usersCollection.find().toArray()
      .then(results => {
        results.map(item =>{
          if(req.query.username === item.username){
            existing = true;
            user= item;
          }
        })
        if (existing){
          res.send({status:200, data:user})
        }else{
          res.send({status:404, error:true, message:'Cannot find username'})
        }
        
      })
      .catch(error => console.error(error))
    })
    //update username or password
    router.post('/update', async (req, res) => {
        const hashedPassword = await bcrypt.hash(req.query.newPassword, 10)
        var user = "";
    let existing = false;
    usersCollection.find().toArray()
      .then(results => {
        results.map(item =>{
          if(req.query.username === item.username){
              if (bcrypt.compare(req.query.password, item.password)){
                existing = true;
                user= item;
              }
          }
        })
        
        if (existing){
        Old = {"username":user.username,"password":user.password};
        var New = JSON.stringify({username:"user.username",password:"user.password"});
        
        
        if (!(req.query.newUsername || req.query.newPassword) ){
            usersCollection.updateOne(Old, Old);
            res.send({status: 200, message:'You should enter username and password'})
        }
        
        if (req.query.newUsername) {
            
            New = New.replace('"user.username"', '"' + req.query.newUsername + '"')
        }else {
            New = New.replace('"user.username"', '"' + user.username + '"')
        }
        
        if (req.query.newPassword) {
            New = New.replace('"user.password"', '"' + hashedPassword + '"')
        }else {
            New = New.replace('"user.password"', '"' + user.password + '"')
        }
        newJson = JSON.parse(New)
        usersCollection.updateOne(Old, {$set: newJson})
        
        usersCollection.find().toArray()
        .then(items => {
        res.send({status:200, data:items})
        })
        .catch(error => console.error(error)) 
        
        }else {
            res.send({status:404, error:true, message:'Cannot find username or password'})
          }
      })
      .catch(error => console.error(error))
    })
//delete user
router.delete('/delete', async(req, res) => {
    var user = "";
    let existing = false;
    usersCollection.find().toArray()
      .then(results => {
        results.map(item =>{
          if(req.query.username === item.username){
              if (bcrypt.compare(req.query.password, item.password)){
                existing = true;
                user= item;
              }
          }
        })   
      if (existing){
        usersCollection.deleteOne(user);
        res.send(
          {
               status:200,
               message:'user is deleted'
          } )
      }else {
        res.send({status:404, error:true, message:'Username or Password are not found'})
      }
    }) 
    .catch(error => console.error(error))
    })
})
module.exports = router;