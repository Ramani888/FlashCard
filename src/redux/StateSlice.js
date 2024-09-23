import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cardTypeName: '',
  cardTypeId: '',
};

const StateSlice = createSlice({
  name: 'myState',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.cardTypeName = action.payload?.cardTypeName;
      state.cardTypeId = action.payload?.cardTypeId;
    },
  },
});

export const {setState} = StateSlice.actions;
export default StateSlice.reducer;
