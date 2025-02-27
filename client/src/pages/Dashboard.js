import React, { useState, useEffect } from 'react';
import BudgetCard from '../components/BudgetCard';
import TransactionCard from '../components/TransactionCard';
import SubscriptionCard from '../components/SubscriptionCard';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
);

const Dashboard = ({ display, test }) => {
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chartNumbers, setChartNumbers] = useState([]);
  const [chartTotal, setChartTotal] = useState(0);
  const [newBudget, setNewBudget] = useState({title: "", currentAmount: 0, goalAmount: ""});


  const chartData = {
    datasets: [{
      data: chartNumbers, // Values matching your expenses
      backgroundColor: [
        '#27CE78', // primary-green for Meme Coin
        '#1E4D40', // primary for Groceries
        '#000000', // black for Car Payment
        '#FFFFFF', // white for Apparel
      ],
      borderWidth: 0,
      cutout: '75%', // Makes the donut thicker/thinner
    }],
  };
  const chartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {
    if (!display) {
      return
    }

    const getMonthlySummary = async () => {
      const res = await fetch('http://localhost:8080/restapi/monthlysummary/user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'username1' }) // TODO: Change to current user
      })
      const data = await res.json()
      setMonthlyIncome(data['income'])
      setMonthlyExpenses(data['expenses']) 
    }
    getMonthlySummary();


    // Set initial budgets
    setBudgets([
      { title: "House Down Payment", currentAmount: 2281, goalAmount: 5000 }
    ]);


    // Fetch request to backend to get transactions
    const getTransactions = async () => {
      const res = await fetch('http://localhost:8080/restapi/transactions/user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'username1' }) // TODO: Change to current user
      })
      const data = await res.json();
      // setTransactions(data);
      const formattedTransactions = data.map(transaction => ({
        title: transaction.companyName,
        amount: transaction.amount.startsWith('-') ? '$' + Math.abs(transaction.amount) : `+$${transaction.amount}`,
        date: new Date(transaction.transactionDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      }));
      setTransactions(formattedTransactions);

      const categoryMap = new Map(); // Map to store category totals {categoryName: totalAmount}
      let total = 0;
      for (const transaction of data) {
        // console.log(transaction.amount);
        if (transaction.amount < 0) { // Skip income
          continue;
        }
        const amount = parseFloat(transaction.amount);
        const category = transaction.personalFinanceCategory || 'Uncategorized';
        if (categoryMap.has(category)) {
          categoryMap.set(category, (categoryMap.get(category) + amount))
        } else {
          categoryMap.set(category, amount);
        }
        total += amount;
      }
      setChartTotal(total.toFixed(2));

      const graphColors = ['#27CE78', '#1E4D40', '#000000', '#FFFFFF'];
      setChartNumbers([]); // Reset chartNumbers
      const sortedCategories = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
      const topCategories = sortedCategories.slice(0, 3);
      let index = 0;
      for (const cat of topCategories) { // Format category names and amounts
        cat[0] = cat[0].split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
        cat[1] = cat[1].toFixed(2);
        setChartNumbers(prev => [...prev, cat[1]]);
        cat.push(graphColors[index]);
        index++;
      }
      const otherTotal = sortedCategories.slice(3).reduce((sum, [_, amount]) => sum + amount, 0);
      const finalCategories = [...topCategories, ['Other', otherTotal.toFixed(2), graphColors[3]]];
      setChartNumbers(prev => [...prev, otherTotal.toFixed(2)]);
      setCategories(finalCategories);
    }
    getTransactions();


    // Fetch request to backend to get subscriptions
    const getSubscriptions = async () => {
      const res = await fetch('http://localhost:8080/restapi/plaidrecurringtransactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'username1' }) // TODO: Change to current user
      })
      const data = await res.json();
      const depositSubscriptions = data['inflow_streams'].map(subscription => ({
        title: subscription.description.length > 20 ? subscription.description.substring(0, 20) + '...' : subscription.description,
        frequency: subscription.frequency.charAt(0) + subscription.frequency.slice(1).toLowerCase(),
        amount: '+$' + Math.abs(subscription.average_amount.amount).toFixed(2)
      }));
      const expenseSubscriptions = data['outflow_streams'].map(subscription => ({
        title: subscription.description.length > 20 ? subscription.description.substring(0, 20) + '...' : subscription.description,
        frequency: subscription.frequency.charAt(0) + subscription.frequency.slice(1).toLowerCase(),
        amount: '$' + subscription.average_amount.amount.toFixed(2)
      }));
      const formattedSubscriptions = [...depositSubscriptions, ...expenseSubscriptions];
      setSubscriptions(formattedSubscriptions);
    }
    getSubscriptions();
  }, [display]);  // Empty dependency array means this runs once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    setBudgets([...budgets, { ...newBudget, currentAmount: 50 }]);
    setNewBudget({ title: "", currentAmount: 0, goalAmount: "" });
    setShowBudgetForm(false);
  };

  const handleCancel = () => {
    setNewBudget({ title: "", currentAmount: 0, goalAmount: "" });  // Reset form
    setShowBudgetForm(false);  // Hide form
  };



  // if (displayDash==='false') {
  //   return (
  //     <div>Loading...</div>
  //   )
  // } else {
    return (
      <div className="h-[calc(100vh-64px)] bg-darker p-8 relative overflow-hidden font-space-grotesk">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-primary-green/15 via-transparent to-transparent rounded-full aspect-square w-[800px]" />
        <div className="max-w-[1200px] mx-auto h-full flex flex-col gap-8 relative">
  
          {/* Top Grid Container */}
          <div className="grid grid-cols-[350px_1fr] gap-8 flex-[0.5] min-h-0 overflow-hidden">
  
            {/* Left Column - Account Stats */}
            <div className="grid grid-rows-3 gap-4 h-full">
            
              {/* Account Balance */}
              <div className="bg-light-gray/70 rounded-3xl px-8 py-4 relative flex items-center drop-shadow-md">
                  <div className="flex flex-col justify-between items-start">
                      <h3 className="text-white text-sm font-medium">Total Balance</h3>
                      <h1 className="text-white text-[42px] font-bold leading-none">$50000</h1>
                  </div>
                  <span className="absolute top-5 right-8 text-white text-xs">%0</span>
              </div>
  
              {/* Monthly Income */}
              <div className="bg-light-gray/70 rounded-3xl px-8 py-4 relative flex items-center drop-shadow-md">
                  <div className="flex flex-col justify-between items-start">
                      <h3 className="text-white text-sm font-medium">Monthly Income</h3>
                      <h1 className="text-white text-[42px] font-bold leading-none">${monthlyIncome}</h1>
                  </div>
                  <span className="absolute top-5 right-8 text-primary-green text-xs">+%18</span>
              </div>
  
              {/* Monthly Expenses */}
              <div className="bg-light-gray/70 rounded-3xl px-8 py-4 relative flex items-center drop-shadow-md">
                  <div className="flex flex-col justify-between items-start">
                    <h3 className="text-white text-sm font-medium">Monthly Expenses</h3>
                    <h1 className="text-white text-[42px] font-bold leading-none">${monthlyExpenses}</h1>
                  </div>
                  <span className="absolute top-5 right-8 text-primary-red text-xs">+%10</span>
              </div>
  
            </div>
  
            {/* Expenses Overview */}
            <div className="h-full">
              <div className="bg-light-gray/70 rounded-3xl p-6 h-full drop-shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-lg font-semibold">Expenses Overview</h3>
                  <span className="text-white text-sm">Sep 10 - Oct 10</span>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Left side - Category List */}
                  <div className="space-y-2">
                    {
                      categories.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item[2] }}></div>
                          <div>
                              <div className="text-white text-base text-left">{item[0]}</div>
                              <div className="text-white text-base text-left">${item[1]}</div>
                          </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Right side - Total with Donut Chart */}
                  <div className="relative w-[200px] h-[200px]">
                      <Doughnut data={chartData} options={chartOptions} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-white text-sm font-semibold">Total Expenses</span>
                          <h2 className="text-white text-3xl font-bold">${chartTotal}</h2>
                      </div>
                  </div>
  
  
                </div>
              </div>
            </div>
  
          </div>
  
          {/* Bottom Grid Container */}
          <div className="grid grid-cols-[350px_350px_1fr] gap-8 flex-[0.5] min-h-0 overflow-auto">
  
            {/* Transactions */}
            <div className="bg-light-gray/70 rounded-3xl p-4 drop-shadow-md overflow-hidden">
              <h3 className="text-white text-lg text-left font-semibold mb-4 pl-4 h-[28px]">Transactions</h3>
              {/* Transaction Cards */}
              <div className="space-y-1 overflow-y-auto no-scrollbar max-h-[calc(100%-40px)]">
                  {transactions.map((transaction, index) => (
                      <TransactionCard 
                          key={index}
                          title={transaction.title}
                          date={transaction.date}
                          amount={transaction.amount}
                      />
                  ))}
              </div>
            </div>
  
            {/* Subscriptions */}
            <div className="bg-light-gray/70 rounded-3xl p-4 drop-shadow-md overflow-hidden">
              <h3 className="text-white text-lg text-left font-semibold mb-4 pl-4 h-[28px]">Subscriptions</h3>
              {/* Subscription Cards */}
              <div className="space-y-1 overflow-y-auto no-scrollbar max-h-[calc(100%-40px)]">
                  {subscriptions.map((subscription, index) => (
                      <SubscriptionCard 
                          key={index}
                          title={subscription.title}
                          frequency={subscription.frequency}
                          amount={subscription.amount}
                      />
                  ))}
              </div>
            </div>
  
            {/* Budgets */}
            <div className="bg-light-gray/70 rounded-3xl p-4 drop-shadow-md overflow-hidden">
              <div className="flex justify-between items-center mb-4 mr-4 h-[28px]">
                <h3 className="text-white text-lg font-semibold pl-4">Budgets</h3>
                <button 
                      onClick={() => setShowBudgetForm(!showBudgetForm)}
                      className="bg-primary-green text-white font-semibold px-2 py-1.5 rounded-lg text-sm">
                  Add Budget
                </button>
              </div>
              {/* Budget Form */}
              {showBudgetForm && (
                  <div className="mb-4 px-4 rounded-lg">
                      <form onSubmit={handleSubmit} className="space-y-3">
                          <div>
                              <label className="text-white text-sm text-left block mb-1">Item Name:</label>
                              <input 
                                  type="text" 
                                  className="w-full bg-darker text-white rounded p-2"
                                  placeholder="Enter item name"
                                  value={newBudget.title}
                                  onChange={(e) => setNewBudget({...newBudget, title: e.target.value})}
                                  required
                              />
                          </div>
                          <div>
                              <label className="text-white text-sm text-left block mb-1">Goal Amount:</label>
                              <input 
                                  type="number" 
                                  className="w-full bg-darker text-white rounded p-2"
                                  placeholder="Enter goal amount"
                                  value={newBudget.goalAmount}
                                  onChange={(e) => setNewBudget({...newBudget, goalAmount: Number(e.target.value)})}
                                  required
                              />
                          </div>
                          <div className="flex justify-between">
                              <button 
                                  type="button" 
                                  onClick={handleCancel} 
                                  className="bg-primary-green text-white font-semibold px-4 py-1.5 rounded-lg text-sm"
                              >
                                  Cancel
                              </button>
                              <button type="submit" className="bg-primary-green text-white font-semibold px-4 py-1.5 rounded-lg text-sm">
                                  Add
                              </button>
                          </div>
                      </form>
                  </div>
              )}
              {/* Budget Cards */}
              <div className="space-y-1 overflow-y-auto no-scrollbar max-h-[calc(100%-40px)]">
                  {budgets.map((budget, index) => (
                      <BudgetCard 
                          key={index}
                          title={budget.title}
                          currentAmount={budget.currentAmount}
                          goalAmount={budget.goalAmount}
                      />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  // }

  
};

export default Dashboard;