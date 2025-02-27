import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,  
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Budgeting = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(2000);
  const [remainingBudget, setRemainingBudget] = useState(1222);
  const [savingsGoals, setSavingsGoals] = useState([
    { title: 'House Downpayment', current: 3200, goal: 5000 },
    { title: 'Emergency Fund', current: 24, goal: 75 },
    { title: 'New laptop', current: 253, goal: 2000 },
    { title: 'Investments', current: 45, goal: 150 },
  ]);
  const [upcomingPayments, setUpcomingPayments] = useState([
    { title: 'Wifi', amount: 65, status: 'pending' },
    { title: 'Rent', amount: 1750, status: 'pending' },
    { title: 'Utilities', amount: 200, status: 'paid' },
    { title: 'Gym Membership', amount: 45, status: 'pending' },
  ]);

  // Performance Chart
  const performanceData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Income',
        data: [2000, 2500, 2000, 2800, 2200, 1800, 2400, 3000, 1800, 2200, 2600, 2400],
        backgroundColor: '#27CE78',
        borderRadius: 5,
      },
      {
        label: 'Expense',
        data: [-1500, -1800, -2200, -1900, -1600, -1500, -2000, -2200, -1400, -1800, -1900, -1600],
        backgroundColor: '#4DD0E1',
        borderRadius: 5,
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    datasets: {
      bar: {
        maxBarThickness: 40,
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          callback: function(value) {
            return value === 0 || value === 3000 || value === -3000 ? value : ''; // also adjusted to fit the max and min
          }
        },
        min: -3000, // will be adjusted to max + 100
        max: 3000, // will be adjusted to min - 100
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'left',
        // align: 'start',
        labels: {
            color: '#ffffff',
            padding: 20,
            boxWidth: 15,
            boxHeight: 15,
            usePointStyle: true,
            pointStyle: 'rectRounded',
        },
      },
    },
  };


  // Doughnut Chart
  const doughnutData = {
    datasets: [{
        data: [remainingBudget, monthlyBudget - remainingBudget],
        backgroundColor: ['#27CE78', '#FFFFFF'],
        borderWidth: 0,
        circumference: 230,
        rotation: 245,
    }]
  };

  const doughnutOptions = {
    cutout: '80%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {legend: {display: false}, tooltip: {enabled: false}}
  };


  return (
    <div className="h-[calc(100vh-64px)] bg-darker p-6 relative overflow-hidden font-space-grotesk">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-primary-green/15 via-transparent to-transparent rounded-full aspect-square w-[800px]" />
      <div className="max-w-[1200px] mx-auto h-full flex flex-col gap-6 relative">
        
        {/* Top Grid - Reduced padding and gap */}
        <div className="grid grid-cols-3 gap-6 flex-[0.45]">
          {/* Budget Card */}
          <div className="bg-light-gray/70 rounded-3xl p-5 drop-shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold">Budget</h3>
              <button className="text-white opacity-50">•••</button>
            </div>
            <p className="text-white/50 text-sm text-left mb-6">Total budget for November 2024.</p>

            <div className="flex flex-col items-center">
              <h2 className="text-white text-2xl font-bold mb-2">${monthlyBudget}</h2>
              {/* Doughnut Chart */}
              <div className="w-56 h-32 relative">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white mt-6 text-sm">${remainingBudget} Remaining</span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Goals - Adjusted padding and spacing */}
          <div className="bg-light-gray/70 rounded-3xl p-5 drop-shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold">Savings</h3>
              <button className="text-white opacity-50">•••</button>
            </div>
            <p className="text-white/50 text-sm text-left mb-6">Establish and track your goals.</p>
            
            <div className="space-y-3">
              {savingsGoals.map((goal, index) => (
                <div key={index} className="flex justify-between items-center border-b border-dashed border-white/20">
                  <div className="w-[50%] flex flex-col text-white text-sm text-left mb-1">
                    <span>{goal.title}</span>
                    <span className="text-white/50">${goal.current} / ${goal.goal}</span>
                  </div>
                  <div className="w-[50%] h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-green rounded-full"
                      style={{ width: `${(goal.current/goal.goal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Payments - Adjusted padding and spacing */}
          <div className="bg-light-gray/70 rounded-3xl p-5 drop-shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold">Upcoming Payments</h3>
              <button className="text-white opacity-50">•••</button>
            </div>
            <p className="text-white/50 text-sm text-left mb-6">Payments due this month.</p>
            <div className="space-y-3">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-5 rounded-full ${payment.status === 'paid' ? 'bg-primary-green' : 'bg-primary'}`} />
                    <span className="text-white">{payment.title}</span>
                  </div>
                  <span className="text-white">${payment.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart - Adjusted height and padding */}
        <div className="flex-[0.55] bg-light-gray/70 rounded-3xl p-5 drop-shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Performance</h3>
            <button className="text-white opacity-50">•••</button>
          </div>
          <p className="text-white/50 text-sm mb-6 text-left">Your budget performance so far this year.</p>
          <div className="h-[calc(100%-80px)]"> {/* Adjusted height to account for header */}
            <Bar data={performanceData} options={performanceOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgeting;