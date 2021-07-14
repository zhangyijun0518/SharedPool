import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const initialState = {
  loading: false,
  hasErrors: false,
  product: {},
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    getProduct: state => {
      state.loading = true
    },
    getProductSuccess: (state, { payload }) => {
      state.product = payload
      state.loading = false
      state.hasErrors = false
    },
    getProductFailure: state => {
      state.loading = false
      state.hasErrors = true
    },
    updateProduct: state => {
      state.loading = true
    },
    updateProductSuccess: (state, { payload }) => {
      // state.product = payload
      state.loading = false
      state.hasErrors = false
    },
    updateProductFailure: state => {
      state.loading = false
      state.hasErrors = true
    },
  },
})

export const { getProduct, getProductSuccess, getProductFailure, updateProduct, updateProductSuccess, updateProductFailure } = productSlice.actions
export const productSelector = state => state.product
export default productSlice.reducer

export function fetchProduct(id) {
  return async dispatch => {
    dispatch(getProduct())

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER}/product/${id}`)
      const data = await response.json()

      dispatch(getProductSuccess(data))
    } catch (error) {
      dispatch(getProductFailure())
    }
  }
}

export function putProduct(product) {
  const {store_ids} = product;
  return async dispatch => {
    // dispatch(updateProduct())

    try {
      await axios.put(`${process.env.REACT_APP_API_SERVER}/product?store_ids=${store_ids}`, product)
      // const data = await response.json()

      // dispatch(updateProductSuccess(data))
    } catch (error) {
      // dispatch(updateProductFailure())
    }
  }
}

