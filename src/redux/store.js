// Import Redux Toolkit and other necessary libraries
import { configureStore } from "@reduxjs/toolkit"; // Redux Toolkit's store configuration
import { productReducer } from "./reducers/productReducer"; // Our product reducer
import loggerMiddleware from "./middleware/loggerMiddleware"; // Custom middleware for logging

// Import Redux Persist utilities for state persistence
import { persistStore, persistReducer } from 'redux-persist'; // Persistence functions
import storage from 'redux-persist/lib/storage'; // Default storage engine (localStorage for web)
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'; // Redux Persist action types

// Configuration for Redux Persist
const persistConfig = {
    key: 'root', // Key used for the persisted state in storage
    storage, // Storage engine to use (localStorage)
    whitelist: [ // List of state properties to persist
        'actualProducts',
        'products',
        'login',
        'loading',
        'userDetails',
        'darkMode',
        'navHeight',
    ],
};

// Create a persisted version of our reducer
const persistedReducer = persistReducer(persistConfig, productReducer);

// Configure and create the Redux store
export const store = configureStore({
    reducer: {
        productReducer: persistedReducer // Use our persisted reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Ignore these Redux Persist actions in serializability checks
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }).concat(loggerMiddleware),
});

// Create the persistor object for Redux Persist
export const persistor = persistStore(store);
