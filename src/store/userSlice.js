// src/store/userSlice.js  
import { createSlice } from '@reduxjs/toolkit';  

const userSlice = createSlice({  
  name: 'user',  
  initialState: null,  
  reducers: {  
    setUser(state, action) {  
      return action.payload;  // Store user data  
    },  
    clearUser(state) {  
      return null;  // Clear user data  
    },  
  },  
});  

// Export actions to update user state  
export const { setUser, clearUser } = userSlice.actions;  
// Export the reducer to be used in the store  
export default userSlice.reducer;  