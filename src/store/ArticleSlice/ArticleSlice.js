import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ky from 'ky'

const apiUrl = 'https://blog.kata.academy/api/'

const initialState = {
  article: {
    slug: '',
    title: '',
    description: '',
    body: '',
    createdAt: '',
    updatedAt: '',
    tagList: [],
    favorited: false,
    favoritesCount: 0,
    author: {
      username: '',
      image: '',
      following: '',
    },
  },
  options: {
    status: null,
    error: null,
    formats: false,
  },
}

export const fetchArticle = createAsyncThunk('Article/fetchArticle', async (slugValue, { rejectWithValue }) => {
  try {
    const getArticle = await ky.get(`${apiUrl}articles/${slugValue}`).json()
    return getArticle
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const ArticleSlice = createSlice({
  name: 'Article',
  initialState: initialState,
  reducers: {
    toggleFormats(state, action) {
      state.options.formats = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticle.pending, (state) => {
        state.options.status = 'loading'
        state.options.error = null
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.options.status = 'fulfilled'
        state.article = action.payload.article
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.options.status = 'rejected'
        state.options.error = action.payload
      })
  },
})

export const { toggleFormats } = ArticleSlice.actions

export default ArticleSlice.reducer
