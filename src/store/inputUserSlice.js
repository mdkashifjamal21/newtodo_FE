import { createSlice } from "@reduxjs/toolkit";


const initialState = {
        value:'',
    };
    
    const inputUserSlice = createSlice({
        name: "inputUser",
        initialState,
        reducers: {
            inputUserName: (state, action) => {
                state.name = action.payload;
            }
        }
    });

    export const { inputUserName} = inputUserSlice.actions;
    export default inputUserSlice.reducer;