import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: true,
  hasErrors: false,
  stores: [],
}

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    getStores: state => {
      state.loading = true
    },
    getStoresSuccess: (state, { payload }) => {
      state.stores = payload
      state.loading = false
      state.hasErrors = false
    },
    getStoresFailure: state => {
      state.loading = false
      state.hasErrors = true
    },
  },
})

export const { getStores, getStoresSuccess, getStoresFailure } = storesSlice.actions
export const storesSelector = state => state.stores
export default storesSlice.reducer

export function fetchStores() {
  return async dispatch => {
    dispatch(getStores())
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER}/stores`)
      const data = await response.json()

      dispatch(getStoresSuccess(data))
    } catch (error) {
      console.log(error)
      dispatch(getStoresFailure())
    }
  }
}
