import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const initialState = {
  loading: false,
  hasErrors: false,
  store: {},
}

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    getStore: state => {
      state.loading = true
    },
    getStoreSuccess: (state, { payload }) => {
      state.store = payload
      state.loading = false
      state.hasErrors = false
    },
    getStoreFailure: state => {
      state.loading = false
      state.hasErrors = true
    },
  },
})

export const { getStore, getStoreSuccess, getStoreFailure } = storeSlice.actions
export const storeSelector = state => state.store
export default storeSlice.reducer

export function fetchStore(id) {
  return async dispatch => {
    dispatch(getStore())

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER}/store?id=${id}`)
      const data = await response.json()

      dispatch(getStoreSuccess(data))
    } catch (error) {
      dispatch(getStoreFailure())
    }
  }
}

export function putStore(store) {
  return async dispatch => {
    // dispatch(updatestore())

    try {
      await axios.put(`${process.env.REACT_APP_API_SERVER}/store`, store)
      // const data = await response.json()

      // dispatch(updatestoreSuccess(data))
    } catch (error) {
      // dispatch(updatestoreFailure())
    }
  }
}
