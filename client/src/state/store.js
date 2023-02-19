import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import boardReducer from "./boardSlice";
import favoriteReducer from "./favoriteSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
    favorite: favoriteReducer,
  },
});
