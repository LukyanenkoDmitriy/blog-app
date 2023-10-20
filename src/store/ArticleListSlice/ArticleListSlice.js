import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ky from 'ky'

const apiUrl = 'https://blog.kata.academy/api/'

const initialState = {
  status: null,
  articles: [],
  error: null,
  articlesCount: 0,
  articlesPage: 1,
}

export const fetchArticleList = createAsyncThunk(
  'ArticleList/fetchArticleList',
  async (offset = 0, { rejectWithValue }) => {
    try {
      const value = offset
      const getArticles = await ky.get(`${apiUrl}articles?offset=${value}`).json()
      return getArticles
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchLoginArticleList = createAsyncThunk(
  'ArticleList/fetchLoginArticleList',
  async (offset = 0, { rejectWithValue }) => {
    try {
      const value = offset
      const token = localStorage.getItem('userToken')
      const getArticles = await ky
        .get(`${apiUrl}articles?offset=${value}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .json()
      return getArticles
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const ArticleListSlice = createSlice({
  name: 'ArticleList',
  initialState: initialState,
  reducers: {
    changePages(state, action) {
      state.articlesPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticleList.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchArticleList.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.articles = action.payload.articles
        state.articlesCount = action.payload.articlesCount
      })
      .addCase(fetchArticleList.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })
      .addCase(fetchLoginArticleList.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchLoginArticleList.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.articles = action.payload.articles
        state.articlesCount = action.payload.articlesCount
      })
      .addCase(fetchLoginArticleList.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })
  },
})

export const { changePages } = ArticleListSlice.actions

export default ArticleListSlice.reducer
