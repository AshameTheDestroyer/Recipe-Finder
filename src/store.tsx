import { configureStore } from "@reduxjs/toolkit";
import MainState, { MainStateProps } from "./MainState";

export type StoreType = {
    main: MainStateProps;
};

const store = configureStore<StoreType>({
    reducer: {
        main: MainState,
    },
});

export default store;