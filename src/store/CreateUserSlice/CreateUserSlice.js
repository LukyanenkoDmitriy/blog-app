import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ky, { HTTPError } from 'ky'

const apiUrl = 'https://blog.kata.academy/api/'

const initialState = {
  status: null,
  errors: null,
  user: {
    username: '',
    email: '',
    token: '',
  },
}

export const fetchCreateUser = createAsyncThunk(
  'createUserSlice/fetchCreateUser',
  async (data, { rejectWithValue }) => {
    try {
      const result = await ky
        .post(`${apiUrl}users`, {
          json: {
            user: {
              username: data.username,
              email: data.email,
              password: data.password,
            },
          },
        })
        .json()
      return result
    } catch (error) {
      if (error instanceof HTTPError) {
        const errorResult = await error.response.json()
        return rejectWithValue(errorResult)
      }
    }
  }
)

const CreateUserSlice = createSlice({
  name: 'createUserSlice',
  initialState: initialState,
  reducers: {
    clearError(state) {
      state.errors = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateUser.pending, (state) => {
        state.status = 'loading'
        state.errors = null
      })
      .addCase(fetchCreateUser.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.user = action.payload.user
      })
      .addCase(fetchCreateUser.rejected, (state, action) => {
        state.status = 'rejected'
        state.errors = action.payload.errors
      })
  },
})

export const { clearError } = CreateUserSlice.actions

export default CreateUserSlice.reducer
