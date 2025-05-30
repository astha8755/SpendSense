const express = require('express');
const path = require('path');
const app = express();


// Middlewares


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let transactions = [];

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/main.html'));
});

// Receive form data (optional AJAX-based)
app.post('/add', (req, res) => {
  const { description, amount, type, date } = req.body;
  const newTransaction = { description, amount, type, date };
  transactions.push(newTransaction);
  res.json({ success: true, datas: newTransaction });
  // res.render("main",{newTransaction});
});
app.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
