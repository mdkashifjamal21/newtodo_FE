// Login.js  
// Login.js  
import React from 'react';  
import { GoogleLogin } from '@react-oauth/google'; 
import MainTodo from '../components/MainTodo'; 
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';
import { inputUserName } from '../store/inputUserSlice';
import './Login.css';

const Login = () => {  
  const dispatch = useDispatch();  
  const user = useSelector((state) => state.user); // Access user state  
  
  const handleLoginSuccess = (credentialResponse) => {  
    const userData = parseJwt(credentialResponse.credential);  
    dispatch(setUser(userData));  // Store user data in Redux  
    console.log("Logged in user data:", userData);  
  };  

  const handleLoginError = () => {  
    console.log("Login Failed");  
  };  

  // Function to parse the JWT token from Google   
  const parseJwt = (token) => {  
    const base64Url = token.split('.')[1];  
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {  
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);  
    }).join(''));  
    return JSON.parse(base64);  
  };  

  if (user) {
    return <MainTodo />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Todo App</h1>
        <p className="login-subtitle">SignIn to manage your tasks</p>
        
        <div className="login-form">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Username" 
            onChange={(e) => dispatch(inputUserName(e.target.value))} 
          />
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              shape="pill"
              size="large"
              text="continue_with"
              useOneTap
            />
          </div>
        </div>
      </div>
    </div>
  );
};  

export default Login;