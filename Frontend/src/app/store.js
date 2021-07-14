import { configureStore } from '@reduxjs/toolkit';
import storeReducer from '../store/storeSlice';
import storesReducer from '../stores/storesSlice';
import productReducer from '../product/productSlice';
import productsReducer from '../products/productsSlice';

export default configureStore({
  reducer: {
    store: storeReducer,
    stores: storesReducer,
    product: productReducer,
    products: productsReducer,
  },
});
