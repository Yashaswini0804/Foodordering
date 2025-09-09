import React,{useState } from 'react'
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';
import { Link } from 'react-router-dom';
function Registerscreen() {
    const [name,setname]= useState('');
    const [email,setemail]= useState('');
    const [password,setpassword]= useState('');
    const[cpassword,setcpassword]=useState('');
    const [loading, setloading] = useState( false);
    const [error, seterror] = useState();
    const [success, setsuccess] = useState();
    

   

 async function register(){
   if(!validateForm()) {
      return;
  }
 if(password===cpassword){
    const user={
        name,
        email,
        password,
        cpassword
    }
  try {
   setloading(true);
     const result = (await axios.post('/api/users/register',user)).data
     setloading(false);
     setsuccess(true);
 
     alert("Regidtration successful")
     window.location.href="/login"
     setname('');
     setemail('');
     setpassword('');
     setcpassword('');
  } catch (error) {
   console.log(error);
   setloading(false);
   seterror(true);
  }
 }
 else{
    alert("password not match")
 }
}

const validateForm = () => {
   if (!validateName(name)) {
       alert("Please enter a valid name");
       return false;
   }
   if (!validateEmail(email)) {
       alert("Please enter a valid email");
       return false;
   }
   if (!validatePassword(password)) {
       alert("Password must be at least 8 characters long");
       return false;
   }
   return true;
}

const validateName = (name) => {
   return /^[a-zA-Z ]+$/.test(name)
 }

 const validateEmail = (email) => {
   return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[gmail.com]{2,}$/.test(email)
 }

 const validatePassword = (password) => {
   return password.length >= 8
 }


  return (
    <div>
{loading && <Loader/>}
{error && <Error/>}

    <div className='row justify-content-center mt-5'>
     <div className='col-md-5 mt-5'>
     {success && <Success message={'Registration Success'}/>}

       <div className='bs'>
        <h2>Register</h2>
         <input type='text' className='form-control' placeholder='name' 
         value={name} onChange={(e) => setname(e.target.value)} />
         <input type='email' className='form-control' placeholder='email'
            value={email} onChange={(e) => setemail(e.target.value)} />
         <input type='password' className='form-control' placeholder='password'
            value={password} onChange={(e) => setpassword(e.target.value)} />
         <input type='password' className='form-control' placeholder='comfirm password'
            value={cpassword} onChange={(e) => setcpassword(e.target.value)} />
            
            <button className='btn btn-primary mt-3' onClick={register}>Register</button>

            <div className="login-link">
          Alredy have an account? 
          <Link to="/login">Login</Link>
        </div>
       </div>
      
     </div>
    </div>
    </div>
  )
}

export default Registerscreen
