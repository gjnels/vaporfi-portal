import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { SupabaseProvider } from './contexts/supabaseContext'
import { Toaster } from 'react-hot-toast'
import { Layout } from './components/Layout'
import { ErrorPage } from './routes/ErrorPage'
import { Promos } from './routes/Promos'
import { FlavorPicker } from './routes/FlavorPicker'
import { NicotineCalculator } from './routes/Nicotine'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <div className='h-screen'>
        <ErrorPage />
      </div>
    ),
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Promos />,
          },
          {
            path: 'custom-blends',
            element: <FlavorPicker />,
          },
          {
            path: 'nicotine-calculator',
            element: <NicotineCalculator />,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SupabaseProvider>
      <RouterProvider router={router} />
      <Toaster />
    </SupabaseProvider>
  </React.StrictMode>
)
