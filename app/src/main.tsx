import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { store } from './store.ts'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from "react-router";
import LogIn from './components/Login.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LogIn />
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
