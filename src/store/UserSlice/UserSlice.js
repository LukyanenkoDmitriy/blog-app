import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ky, { HTTPError } from 'ky'

const apiUrl = 'https://blog.kata.academy/api/'

const initialState = {
  isLogged: localStorage.getItem('userToken'),
  error: null,
  editUserError: null,
  status: null,
  successUpdate: false,
  user: {
    email: '',
    token: '',
    username: '',
    bio: 'Hey, teacher, leave them kids alone',
    image: null,
  },
}

export const fetchLoginUser = createAsyncThunk('userSlice/fetchLoginUser', async (data, { rejectWithValue }) => {
  try {
    const result = await ky
      .post(`${apiUrl}/users/login`, {
        json: {
          user: {
            email: data.email,
            password: data.password,
          },
        },
      })
      .json()
    localStorage.setItem('userToken', result.user.token)
    return result
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorResult = await error.response.json()
      return rejectWithValue(errorResult)
    }
  }
})

export const savedLoginUser = createAsyncThunk('userSlice/savedLoginUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken')
    const result = await ky
      .get(`${apiUrl}user`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .json()
    return result
  } catch (error) {
    rejectWithValue(error.message)
  }
})

export const updateUser = createAsyncThunk('userSlice/updateUser', async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken')
    const result = await ky
      .put(`${apiUrl}user`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        json: {
          user: data,
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
})

const UserSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {
    logOutReducer(state) {
      localStorage.removeItem('userToken')
      state.isLogged = localStorage.getItem('userToken')
      state.error = null
      state.editUserError = null
      state.status = null
      state.user = {
        email: '',
        token: '',
        username: '',
        bio: 'Hey, teacher, leave them kids alone',
        image: null,
      }
    },
    clearErrors(state) {
      state.editUserError = null
    },
    clearStateSuccess(state) {
      state.successUpdate = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.user = action.payload.user
        state.isLogged = localStorage.getItem('userToken')
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload.errors
      })
      .addCase(savedLoginUser.fulfilled, (state, action) => {
        state.error = null
        state.user = action.payload.user
        state.status = 'fulfilled'
      })
      .addCase(savedLoginUser.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.successUpdate = true
        state.editUserError = null
        state.user = action.payload.user
        state.status = 'fulfilled'
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'rejected'
        state.editUserError = action.payload.errors
        state.successUpdate = false
      })
  },
})

export const { logOutReducer, clearErrors, clearStateSuccess } = UserSlice.actions

export default UserSlice.reducer
