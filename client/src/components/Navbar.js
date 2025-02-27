import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePlaidLink } from 'react-plaid-link';

const Navbar = ({setDisplay}) => {
  const location = useLocation();
  const isActiveLink = (path) => location.pathname === path;
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setShowPlaidModal(false);
      onSuccess(public_token, metadata);
    },
    onExit: (err, metadata) => {
      setShowPlaidModal(false);
      onExit(err, metadata);
    },
    overlay: true, // This is z-index 50
    position: "center", // This is position: "center"
    displayMode: "overlay"
  });

  useEffect(() => {
    if (showPlaidModal && ready && open) {
      open();
    }
  }, [showPlaidModal, ready, open]);

  const fetchLinkToken = async () => {
    try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/restapi/create_link_token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'username1' }),
        })

        // const data = { link_token: 'random data' }
        const data = await response.json();
        setLinkToken(data.link_token);
        // setDisplay(true)
      } catch (error) {
        console.error('Error creating link token:', error);
      } finally {
        setIsLoading(false);
      }


      
  };

  const onSuccess = async (public_token, metadata) => {
    setDisplay(true)
    // try {
    //   const response = await fetch('http://localhost:8080/restapi/set_access_token/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ public_token: public_token, username: 'username1', metadata: metadata }),
    //   });
    //   const data = await response.json(); // Delete this line in production --> access_token should never leave the backend
    //   if (response.ok) {
    //       console.log("Access token received: ", data.access_token); 
    //   } else {
    //       console.error("Failed to exchange public token:", data.error);
    //   }
    // } catch (error) {
    //   console.error('Error setting access token:', error);
    // }
  };


  const onExit = (err, metadata) => {
    if (err) {
      console.error("Plaid link exited with error: ", err)
    }
    console.log("Exit metadata:", metadata)
  };

  

  return (
      <nav className="h-16 bg-darker px-6 py-4 border-b border-light-gray">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold">
              <span className="text-primary-green relative">
                C
                <span className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-primary-green transform -translate-x-1/2"></span>
              </span>
              <span className="text-white">ash</span>
              <span className="text-primary-green">C</span>
              <span className="text-white">ore</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className={`px-1 py-2 ${isActiveLink('/dashboard') 
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/budgeting" 
              className={`px-1 py-2 ${isActiveLink('/budgeting') 
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              Budgeting
            </Link>
            {/* <Link 
              to="/savings" 
              className={`px-1 py-2 ${isActiveLink('/savings') 
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              Savings
            </Link>
            <Link 
              to="/loans" 
              className={`px-1 py-2 ${isActiveLink('/loans') 
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              Loans
            </Link>
            <Link 
              to="/settings" 
              className={`px-1 py-2 ${isActiveLink('/settings') 
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              Settings
            </Link> */}
          </div>

          {/* Single Button Position */}
          <button 
            onClick={linkToken ? () => setShowPlaidModal(true) : fetchLinkToken}
            disabled={isLoading}
            className="px-3 py-2 bg-primary-green text-white text-sm font-semibold rounded-md hover:bg-primary-green/90 transition-colors absolute right-[300px] top-4 disabled:opacity-50"
          >
            {isLoading ? 'Getting Token...' : (linkToken ? 'Link Bank Account' : 'Get Plaid Link')}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <img
                src="/avatar-placeholder.png"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm">Test User</span>
              <span className="text-gray-400 text-xs">testuser123@gmail.com</span>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;