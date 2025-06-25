
// import { configureStore } from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// // Import all reducers
// import userReducer from '../Redux/Slices/userSlice.js';
// import productSliceReducer from "../Redux/Slices/productslice.js";
// import userInfoSliceReducer from "../Redux/Slices/userInfoSlice.js";
// import subscriptionSliceReducer from "../Redux/Slices/subscriptionSlice.js";
// import deliverySliceReducer from "../Redux/Slices/delivery.js";
// import adminsubscriptionSliceReducer from "../Redux/Slices/adminmanagementsubscription.js";
// import deliverymanagementSliceReducer from "../Redux/Slices/deliverymanagement.js";
// import adminmessagesliceReducer from "../Redux/Slices/adminmessages.js";
// import cancelsubscriptionSliceReducer from "../Redux/Slices/adminsubcancel.js";
// import verifyDeliverySliceReducer from "../Redux/Slices/deliverystatusmanagement.js"
// // Persist config for ONLY the auth token
// const authPersistConfig = {
//   key: 'user',
//   storage,
//   whitelist: ['userInfo'] // Only persist the token field from user slice
// };

// const rootReducer = combineReducers({
//   // Only persist the user reducer's token
//   user: persistReducer(authPersistConfig, userReducer),
  
//   // All other reducers remain unpresisted
//   products: productSliceReducer,
//   userInfo: userInfoSliceReducer,
//   subscriptions: subscriptionSliceReducer,
//   delivery: deliverySliceReducer,
//   adminsubscriptions: adminsubscriptionSliceReducer,
//   deliveriesmanagement: deliverymanagementSliceReducer,
//   adminmessages: adminmessagesliceReducer,
//   cancelsubscription : cancelsubscriptionSliceReducer,
//   verifyDelivery : verifyDeliverySliceReducer
// });

// export const store = configureStore({
//   reducer: rootReducer, // Note: We're not persisting the entire reducer anymore
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(
//       // Optional: Add logging middleware for debugging
//       (store) => (next) => (action) => {
//         if (process.env.NODE_ENV === 'development') {
//           if (action.type.endsWith('/fulfilled')) {
//             console.log('Redux Action:', action.type);
//           }
//         }
//         return next(action);
//       }
//     ),
//   devTools: process.env.NODE_ENV !== 'production'
// });

// // Export persistor only for the auth token persistence
// export const persistor = persistStore(store);


import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all reducers
import userReducer from '../Redux/Slices/userSlice.js';
import productSliceReducer from "../Redux/Slices/productslice.js";
import userInfoSliceReducer from "../Redux/Slices/userInfoSlice.js";
import subscriptionSliceReducer from "../Redux/Slices/subscriptionSlice.js";
import deliverySliceReducer from "../Redux/Slices/delivery.js";
import adminsubscriptionSliceReducer from "../Redux/Slices/adminmanagementsubscription.js";
import deliverymanagementSliceReducer from "../Redux/Slices/deliverymanagement.js";
import adminmessagesliceReducer from "../Redux/Slices/adminmessages.js";
import cancelsubscriptionSliceReducer from "../Redux/Slices/adminsubcancel.js";
import verifyDeliverySliceReducer from "../Redux/Slices/deliverystatusmanagement.js";
import deliveryBoyAuthSliceReducer from "../Redux/Slices/deliveryboi.js"; // Add the new delivery boy auth slice

// Persist config for user auth
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['userInfo'] // Only persist the token field from user slice
};

// Persist config for delivery boy auth
const deliveryBoyPersistConfig = {
  key: 'deliveryBoyAuth',
  storage,
  whitelist: ['token'] // Only persist the token field from delivery boy slice
};

const rootReducer = combineReducers({
  // Persisted reducers
  user: persistReducer(userPersistConfig, userReducer),
  deliveryBoyAuth: persistReducer(deliveryBoyPersistConfig, deliveryBoyAuthSliceReducer),
  
  // Non-persisted reducers
  products: productSliceReducer,
  userInfo: userInfoSliceReducer,
  subscriptions: subscriptionSliceReducer,
  delivery: deliverySliceReducer,
  adminsubscriptions: adminsubscriptionSliceReducer,
  deliveriesmanagement: deliverymanagementSliceReducer,
  adminmessages: adminmessagesliceReducer,
  cancelsubscription: cancelsubscriptionSliceReducer,
  verifyDelivery: verifyDeliverySliceReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // Optional: Add logging middleware for debugging
      (store) => (next) => (action) => {
        if (process.env.NODE_ENV === 'development') {
          if (action.type.endsWith('/fulfilled')) {
            console.log('Redux Action:', action.type);
          }
        }
        return next(action);
      }
    ),
  devTools: process.env.NODE_ENV !== 'production'
});

// Export persistor for both user and delivery boy auth token persistence
export const persistor = persistStore(store);