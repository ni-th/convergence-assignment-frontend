# Frontend - Customer Management Application

A modern React-based frontend application for managing customers, built with TypeScript, Vite, and Material-UI.

## Description

This application provides a user-friendly interface for performing CRUD operations on customer data. It includes features for listing customers, creating new customers, editing existing ones, viewing customer details, and bulk uploading customer information.

## Features

- **Home Page**: Welcome page for the application.
- **Customer List**: View all customers in a paginated list.
- **Customer Create**: Add new customers with form validation.
- **Customer Edit**: Modify existing customer information.
- **Customer View**: Display detailed information for a specific customer.
- **Bulk Upload**: Upload multiple customers via file import.
- **Responsive Design**: Optimized for desktop and mobile devices using Material-UI and Tailwind CSS.

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Library**: Material-UI (@mui/material)
- **Styling**: Tailwind CSS, Emotion
- **HTTP Client**: Axios
- **Linting**: ESLint with TypeScript support
- **Development**: Hot Module Replacement (HMR) with Vite

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

## Usage

- Navigate through the application using the sidebar menu.
- Use the customer management pages to perform operations on customer data.
- Ensure the backend API is running and configured in `src/services/apiClient.ts`.

## Scripts

- `npm run dev`: Start the development server with hot reload.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint to check for code issues.
- `npm run preview`: Preview the production build locally.

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Footer.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
├── pages/
│   ├── BulkUploadPage.jsx
│   ├── CustomerCreatePage.jsx
│   ├── CustomerEditPage.jsx
│   ├── CustomerListPage.jsx
│   ├── CustomerViewPage.jsx
│   └── HomePage.jsx
├── services/
│   ├── apiClient.ts
│   └── customerService.ts
├── types/
│   └── types.ts
├── App.css
├── App.tsx
├── index.css
├── jsx-modules.d.ts
└── main.tsx
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -am 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
