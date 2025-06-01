// alert("Welcome to SpendSense");
let totalIncome = 0; // Starting value from your HTML
let totalExpense = 0; // Starting value from your HTML
    // Setup Pie Chart (Expense vs Income)
const pieCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [totalIncome, totalExpense],
            backgroundColor: ['#4caf50', '#f44336'],
        }]
    },
    options: {
        responsive: true,
    }
});

// Setup Line Chart (Daily balance changes)
const lineCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: [], // dates
        datasets: [{
            label: 'Balance Over Time',
            data: [], // balance values
            borderColor: '#1a73e8',
            fill: false,
        }]
    },
    options: {
        responsive: true,
    }
});
  
 document.querySelector('form').addEventListener('submit',async function(e) {
    e.preventDefault(); 

    const type = document.querySelector('select').value;
    const description = document.querySelector('input[name="Description"]').value;
    const amount = parseFloat(document.querySelector('input[type="number"]').value);
    const category = document.querySelectorAll('select')[1].value;
    const date = new Date().toISOString().split('T')[0];


    if (!description || !amount || !category || type === 'Select') {
        alert("Please fill all fields.");
        return;
    }
     const response = await fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, amount, type, date }),
    });

    const result = await response.json();
    if (result.success) {
        addTransaction(description, amount, type, date);
    }
});


function addTransaction(desc, amt, type, date) {
    const transactionList = document.querySelector('.list');

    const div = document.createElement('div');
    div.className = 'transaction';
    div.innerHTML = `
        <span>${desc} - ${date}</span>
        <span class="amount ${type.toLowerCase()}">${type === 'income' ? '+' : '-'}₹${amt}</span>
    `;
    transactionList.appendChild(div);

    updateBalance(amt, type);
}

function updateBalance(amount, type) {
    if (type === 'income') {
        totalIncome += amount;
    } else {
        totalExpense += amount;
    }
    const balance = totalIncome - totalExpense;
    const today = new Date().toISOString().split('T')[0];
    

    document.querySelector('.tot_inc p').innerText = `Total income: ₹${totalIncome}`;
    document.querySelector('.tot_ex p').innerText = `Total expense: ₹${totalExpense}`;
    document.querySelector('.tot_bal p').innerText = `Total balance: ₹${totalIncome - totalExpense}`;

 // Update Pie Chart
    pieChart.data.datasets[0].data = [totalIncome, totalExpense];
    pieChart.update();

    // Update Line Chart
    lineChart.data.labels.push(today);
    lineChart.data.datasets[0].data.push(balance);
    lineChart.update();
}