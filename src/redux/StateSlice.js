import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  theme: '', 
};

const StateSlice = createSlice({
  name: 'myState',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.theme = action.payload.theme;
    },
  },
});

export const {setState} = StateSlice.actions;
export default StateSlice.reducer;
