import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Budgeting from './pages/Budgeting';
import Landing from './pages/Landing';

function App() {
  const [display, setDisplay] = useState(false)
  const [test, setTest] = useState('Heloooo')

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar setDisplay={setDisplay} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard display={display} test={test}/>} />
          <Route path="/budgeting" element={<Budgeting />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
