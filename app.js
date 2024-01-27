// server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Sequelize setup
const sequelize = new Sequelize('expense_tracker', 'root', 'Pandey@131', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define a User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync the model with the database
User.sync();

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/signUp.html'));
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  
  console.log("data" + req)
  console.log('Received data in backend:', req.body);
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log('User created:', newUser);
    // Send a successful response
    res.status(200).send('Signup successful');
    
    console.log('Response sent to frontend');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//login functionality
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const existingUser = await User.findOne({
      where: {
        email,
        
      },
    });

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.password);

      if(passwordMatch)
      {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Login failed');
    }
  }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
