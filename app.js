var con = require('./connection')
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/signUp.html'));
  //__dirname : It will resolve to your project folder.
});


app.post('/', function(req, res){
  console.log(req.body);
  var userName = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var joinedDate = new Date().toDateString();
  var updateDate = new Date().toDateString();


  console.log('Before MySQL query');

// Update the insertData function in your server code
const insertData = async () => {
  var userName = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var joinedDate = new Date().toDateString();
  var updateDate = new Date().toDateString(); // Set return date to one hour from now


const sql = "INSERT INTO users(userName, email, password, joinedDate, updateDate) VALUES (?, ?, ?, ?, ?)";
const values = [userName, email, password, joinedDate, updateDate];

try {
  const [rows, fields] = await con.execute(sql, values);
  console.log('Data inserted successfully');
  res.sendFile(path.join(__dirname+'/login.html'));
  // res.redirect('/data');
} catch (error) {
  console.error('Error executing SQL query:', error);
  res.status(500).send('Internal Server Error');
} 
};
insertData();
});
process.on('exit', function() {
  con.end(function(err) {
    if (err) {
      console.error('Error closing MySQL connection:', err);
    } else {
      console.log('MySQL connection closed');
    }
  });
});
app.listen(3000)