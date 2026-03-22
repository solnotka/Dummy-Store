import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Product } from '../../pages/Goods/models/types'

export const PRODUCTS_API_URL = 'https://dummyjson.com/products'

const LIST_LIMIT = '250'

export type GoodsStatus = 'loading' | 'succeeded' | 'failed'

type GoodsState = {
  allData: Product[] | null
  status: GoodsStatus | null
}

const initialState: GoodsState = {
  allData: null,
  status: null,
}

export type ProductsResponse = {
  products: Product[]
  total: number
}

function parseProductsResponse(data: unknown): Product[] {
  const parsed = data as ProductsResponse
  return Array.isArray(parsed.products) ? parsed.products : []
}

export const fetchData = createAsyncThunk(
  'goods/fetchData',
  async (_, { rejectWithValue }) => {
    const url = new URL(PRODUCTS_API_URL)
    url.searchParams.set('limit', LIST_LIMIT)
    const res = await fetch(url.toString())
    if (!res.ok) return rejectWithValue(res.status)
    const data: unknown = await res.json()
    return parseProductsResponse(data)
  },
)

export const filterData = createAsyncThunk(
  'goods/filterData',
  async (arg: { q: string }, { rejectWithValue }) => {
    const q = arg.q.trim()
    if (!q) return rejectWithValue('empty_query')
    const url = new URL(`${PRODUCTS_API_URL}/search`)
    url.searchParams.set('q', q)
    url.searchParams.set('limit', LIST_LIMIT)
    const res = await fetch(url.toString())
    if (!res.ok) return rejectWithValue(res.status)
    const data: unknown = await res.json()
    return parseProductsResponse(data)
  },
)

const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {
    clearData: (state) => {
      state.allData = null
      state.status = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.allData = action.payload
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = 'failed'
        state.allData = null
      })
      .addCase(filterData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(filterData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.allData = action.payload
      })
      .addCase(filterData.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { clearData } = goodsSlice.actions
export const goodsReducer = goodsSlice.reducer
