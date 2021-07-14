import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: true,
  hasErrors: false,
  products: [],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProducts: state => {
      state.loading = true
    },
    getProductsSuccess: (state, { payload }) => {
      state.products = payload
      state.loading = false
      state.hasErrors = false
    },
    getProductsFailure: state => {
      state.loading = false
      state.hasErrors = true
    },
  },
})

export const { getProducts, getProductsSuccess, getProductsFailure } = productsSlice.actions
export const productsSelector = state => state.products
export default productsSlice.reducer

export function fetchProducts(keyword) {
  return async dispatch => {
    dispatch(getProducts())
    try {
      const url = keyword ? `${process.env.REACT_APP_API_SERVER}/product?q=${keyword}` : `${process.env.REACT_APP_API_SERVER}/products`;
      const response = await fetch(url)
      const data = await response.json()

      dispatch(getProductsSuccess(data))
    } catch (error) {
      console.log(error)
      dispatch(getProductsFailure())
    }
  }
}
