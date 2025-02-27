import React from 'react';

const BudgetCard = ({ title, currentAmount, goalAmount }) => {
  const progress = (currentAmount / goalAmount) * 100;
  
  return (
    <div className="bg-darker rounded-xl p-4 text-white w-full max-w-md font-space-grotesk">
      <h2 className="text-md font-medium mb-2 text-left">{title}</h2>
      
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <span className="text-zinc-500 text-sm mr-1">Savings:</span>
          <span className="font-semibold text-sm">${currentAmount}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-zinc-500 text-sm mr-1">Goal:</span>
          <span className="text-zinc-500 font-semibold text-sm">${goalAmount}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300 ease-in-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetCard;