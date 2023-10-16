const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  animationFinished: false,
};

const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    setAnimationFinished: (state, action) => {
      state.animationFinished = action.payload;
    },
  },
});

export const { setAnimationFinished } = animationSlice.actions;

export const selectAnimationFinished = (state) =>
  state.animation.animationFinished;

export default animationSlice.reducer;
