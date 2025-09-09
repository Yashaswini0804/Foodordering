import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Landingscreen() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = localStorage.getItem('currentuser');
    if (user) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='row landing justify-content-center'>
        <div className='col-md-12 text-center' >
           <h2 style={{color:'white', fontSize:'100px'}}>Ruchira</h2>
           <h1 style={{color:'white'}}> </h1>
           <button 
             className='btn landing-btn' 
             style={{color:'black'}} 
             onClick={handleGetStarted}
           >
             Get Started
           </button>
        </div>
    </div>
  )
}

export default Landingscreen
