import { createSlice } from '@reduxjs/toolkit';

const mySlice = createSlice({
    name: 'mySlice',
    initialState: {
        value: 0,
        hello: 'Hello World',
        helloobj: {
            hello: 'Hello World'
        },
        helloobjBIG: {
            hello1: 'Hello World1',
            hello2: 'Hello World2',
        }
    },
    reducers: {
        sethello: (state, action) => {
            state.hello = action.payload;
        },
        sethelloobj: (state, action) => {
            state.helloobj.hello = action.payload;
        },
        sethelloobjBIG: (state, action) => {
            state.helloobjBIG = action.payload;
        },


    },
});

export const { sethello, sethelloobj, sethelloobjBIG } = mySlice.actions;

export default mySlice.reducer;