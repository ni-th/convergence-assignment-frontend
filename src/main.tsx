import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import BulkUploadPage from './pages/BulkUploadPage.jsx'
import CustomerCreatePage from './pages/CustomerCreatePage.jsx'
import CustomerEditPage from './pages/CustomerEditPage.jsx'
import CustomerListPage from './pages/CustomerListPage.jsx'
import CustomerViewPage from './pages/CustomerViewPage.jsx'
import HomePage from './pages/HomePage.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/create" element={<CustomerCreatePage />} />
          <Route path="customers/edit" element={<CustomerEditPage />} />
          <Route path="customers/view" element={<CustomerViewPage />} />
          <Route path="customers/bulk-upload" element={<BulkUploadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
