import React from 'react';

const SubscriptionCard = ({ title, frequency, amount }) => {  
  const isPositive = amount.startsWith('+');

  return (
    <div className="bg-darker rounded-xl px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-white text-left font-semibold">{title}</span>
          <span className="text-zinc-500 text-left text-sm">{frequency}</span>
        </div>
        <span className={`text-base ${isPositive ? 'text-primary-green' : 'text-white'}`}>
          {amount}
        </span>
      </div>
    </div>
  );
};

export default SubscriptionCard;