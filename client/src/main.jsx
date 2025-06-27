import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './Redux/store.js';
import { HashRouter } from 'react-router-dom'; // ✅ Changed here

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter> {/* ✅ Changed from BrowserRouter to HashRouter */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </HashRouter>
  </StrictMode>
);
