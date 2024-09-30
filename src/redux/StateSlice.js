import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cardTypeName: '',
};

const StateSlice = createSlice({
  name: 'myState',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.cardTypeName = action.payload?.cardTypeName;
    },
  },
});

export const {setState} = StateSlice.actions;
export default StateSlice.reducer;
