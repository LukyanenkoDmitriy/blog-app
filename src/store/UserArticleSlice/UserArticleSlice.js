import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ky from 'ky'

const apiUrl = 'https://blog.kata.academy/api/'

const initialState = {
  deleteArticle: null,
  error: null,
  status: null,
  likeError: null,
}

export const createArticleFetch = createAsyncThunk(
  'userArticleSlice/createArticleFetch',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      const result = ky
        .post(`${apiUrl}articles`, {
          headers: {
            Authorization: `Token ${token}`,
          },
          json: {
            article: data,
          },
        })
        .json()
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteArticleFetch = createAsyncThunk(
  'userArticleSlice/deleteArticleFetch',
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      const result = ky
        .delete(`${apiUrl}articles/${slug}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .json()
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateArticleFetch = createAsyncThunk(
  'userArticleSlice/updateArticleFetch',
  async ({ slug, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      const result = ky
        .put(`${apiUrl}articles/${slug}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
          json: {
            article: data,
          },
        })
        .json()
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addLikeFetch = createAsyncThunk('userArticleSlice/addLikeFetch', async (slug, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken')
    const result = ky
      .post(`${apiUrl}articles/${slug}/favorite`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .json()
    return result
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const deleteLikeFetch = createAsyncThunk(
  'userArticleSlice/deleteLikeFetch',
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      const result = ky
        .delete(`${apiUrl}articles/${slug}/favorite`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .json()
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const userArticleSlice = createSlice({
  name: 'userArticleSlice',
  initialState: initialState,
  reducers: {
    clearStatus(state) {
      state.status = null
      state.deleteArticle = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createArticleFetch.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createArticleFetch.fulfilled, (state) => {
        state.status = 'fulfilled'
      })
      .addCase(createArticleFetch.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })
      .addCase(deleteArticleFetch.fulfilled, (state) => {
        state.deleteArticle = 'fulfilled'
        state.error = null
      })
      .addCase(deleteArticleFetch.rejected, (state, action) => {
        state.deleteArticle = 'rejected'
        state.error = action.payload
      })
      .addCase(updateArticleFetch.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateArticleFetch.fulfilled, (state) => {
        state.status = 'fulfilled'
        state.error = null
      })
      .addCase(updateArticleFetch.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })
      .addCase(addLikeFetch.fulfilled, (state) => {
        state.likeError = null
      })
      .addCase(addLikeFetch.rejected, (state, action) => {
        state.likeError = action.payload
      })
      .addCase(deleteLikeFetch.fulfilled, (state) => {
        state.likeError = null
      })
      .addCase(deleteLikeFetch.rejected, (state, action) => {
        state.likeError = action.payload
      })
  },
})

export const { clearStatus } = userArticleSlice.actions

export default userArticleSlice.reducer
