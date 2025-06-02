const express = require('express');
const path = require('path');
const app = express();
const mongoose=require('mongoose');


// Middlewares

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/spendSense')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));



const Transaction = mongoose.model('Transaction', {
  description: String,
  amount: Number,
  type: String,
  category: String,
  date: { type: Date, default: Date.now }
});


let transactions = [];
//home page
app.get('/',(req,res)=>{
  console.log("working");
  res.sendFile(path.join(__dirname,'views/home.html'));
});
app.post('/home',(req,res)=>{
  const{name,email,pass}=req.body;
res.sendFile(path.join(__dirname,'views/main.html'));
  // res.json  ("working");

})

// Serve HTML page
app.get('/home', (req, res) => {
  
res.sendFile(path.join(__dirname,'views/main.html'));
  
});


// Receive form data (optional AJAX-based)
app.post('/add', async (req, res) => {
  try{
     const category = req.body.category;
    const { description, amount, type, date } = req.body;
  const newTransaction = new Transaction({ 
    description,
    amount,
    type,
    category
  });
  
    await newTransaction.save();
  res.json({ success: true, datas: newTransaction });
  // res.render("main",{newTransaction});
}
  catch (error) {
    console.log('Error saving transaction:', error);
    res.json({ success: false });
  }
});

app.post('/create', (req, res) => {
  const { name, email, password } = req.body;
  // You can process user data here
  res.sendFile(path.join(__dirname, 'views/main.html'));
});


app.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
//Report router
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/about.html'));
});
//Settings router
app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/terms.html'));
});

