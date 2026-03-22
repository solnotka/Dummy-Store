import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const LOGIN_URL = 'https://dummyjson.com/auth/login'
const ME_URL = 'https://dummyjson.com/auth/me'

export const AUTH_TOKEN_KEY = 'dummyjson_access_token'
/** Сессия восстанавливается после перезагрузки только при значении `'1'` (галочка «Запомнить»). */
export const AUTH_PERSIST_KEY = 'dummyjson_persist_session'

export function dropStaleAuthStorage() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token && localStorage.getItem(AUTH_PERSIST_KEY) !== '1') {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_PERSIST_KEY)
  }
}

type MeUser = {
  firstName?: string
  lastName?: string
  username?: string
}

type LoginSuccess = {
  accessToken: string
  firstName?: string
  lastName?: string
  username?: string
}

export type UserState = {
  token: string | null
  name: string | null
  username: string | null
  isAuthenticated: boolean
  status: 'idle' | 'loading' | 'restoring'
  error: string | null
}

const initialState: UserState = {
  token: null,
  name: null,
  username: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
}

function displayName(u: MeUser | LoginSuccess): string {
  const fn = u.firstName ?? ''
  const ln = u.lastName ?? ''
  const full = `${fn} ${ln}`.trim()
  return full || (u.username ?? '')
}

export const loginUser = createAsyncThunk<
  { token: string; name: string; username: string },
  { username: string; password: string; remember: boolean },
  { rejectValue: string }
>('user/login', async ({ username, password, remember }, { rejectWithValue }) => {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = (await res.json()) as LoginSuccess & { message?: string }

  if (!res.ok) {
    const msg =
      typeof data.message === 'string' ? data.message : 'Не удалось войти'
    return rejectWithValue(msg)
  }

  if (!data.accessToken) {
    return rejectWithValue('Ответ сервера без токена')
  }

  if (remember) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken)
    localStorage.setItem(AUTH_PERSIST_KEY, '1')
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_PERSIST_KEY)
  }

  return {
    token: data.accessToken,
    name: displayName(data),
    username: data.username ?? username,
  }
})

export const restoreSession = createAsyncThunk<
  { token: string; name: string; username: string },
  void,
  { rejectValue: string }
>(
  'user/restoreSession',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)!
    const res = await fetch(ME_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = (await res.json()) as MeUser & { message?: string }

    if (!res.ok) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_PERSIST_KEY)
      const msg =
        typeof data.message === 'string' ? data.message : 'Сессия недействительна'
      return rejectWithValue(msg)
    }

    return {
      token,
      name: displayName(data),
      username: data.username ?? '',
    }
  },
  {
    condition: () =>
      localStorage.getItem(AUTH_PERSIST_KEY) === '1' &&
      Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  },
)

export const logoutUser = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_PERSIST_KEY)
  window.location.reload()
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.name = action.payload.name
        state.username = action.payload.username
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload ?? 'Ошибка входа'
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = 'restoring'
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.name = action.payload.name
        state.username = action.payload.username
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.status = 'idle'
        if (action.meta.aborted) return
        state.token = null
        state.name = null
        state.username = null
        state.isAuthenticated = false
      })
      .addCase(logoutUser.pending, () => ({ ...initialState }))
  },
})

export const { clearAuthError } = userSlice.actions
export const userReducer = userSlice.reducer
