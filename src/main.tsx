import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem, Toaster, ToastRoot, ToastTitle, ToastDescription, ToastCloseTrigger } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import { toaster } from './utils/toast';
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster toaster={toaster}>
          {(toast) => (
            <ToastRoot key={toast.id}>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
              <ToastCloseTrigger />
            </ToastRoot>
          )}
        </Toaster>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);