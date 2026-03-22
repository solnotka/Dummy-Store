import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { store } from './store'
import { dropStaleAuthStorage, restoreSession } from './store/slices/userSlice'
import { antdTheme } from './theme/antdTheme'

dropStaleAuthStorage()
store.dispatch(restoreSession())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={ruRU} theme={antdTheme}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
