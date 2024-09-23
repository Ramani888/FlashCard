import {configureStore} from '@reduxjs/toolkit';
import myReducer from '../redux/StateSlice'

const store = configureStore({
  reducer: {
    myState: myReducer,
  },
});

export default store;
