import { configureStore } from "@reduxjs/toolkit";

import userReducer from './userSlice';  
import inputUserSlice from "./inputUserSlice";

const store = configureStore({  
  reducer: {  
    user: userReducer,  // Include the user slice in the store  
    inputUser : inputUserSlice
  },  
});  

export default store;  