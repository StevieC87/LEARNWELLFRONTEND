
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
// Import session storage
//import sessionStorage from 'redux-persist/lib/storage/session'; // defaults to sessionStorage for web
import rootReducer from './store/rootReducer'; // Your root reducer
import customStorage from '@/utils/storage'; // Path to your custom storage

// Configuring Redux Persist
const persistConfig = {
    key: 'root',
    storage: customStorage, // Use sessionStorage instead of localStorage',
    blacklist: 'Booking'
};

// Creating a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuring the store with the persisted reducer
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // We'll address this later
        }),
});

export const persistor = persistStore(store);

export default store;
