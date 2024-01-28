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

const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
// User.sync();

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


app.post('/addExpense', async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    // Create a new expense
    const newExpense = await Expense.create({
      amount,
      description,
      category,
    });

    res.status(201).send('Expense added successfully');
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getAllExpenses', async (req, res) => {
  try {
    // Fetch all expenses from the database
    const allExpenses = await Expense.findAll();

    res.status(200).json(allExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/deleteExpense/:expenseId', async (req, res) => {
  const expenseId = req.params.expenseId;

  try {
    // Find the expense by ID and delete it
    const deletedExpense = await Expense.destroy({
      where: { id: expenseId },
    });

    if (deletedExpense) {
      res.status(200).send('Expense deleted successfully');
    } else {
      res.status(404).send('Expense not found');
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).send('Internal Server Error');
  }
});
   
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
