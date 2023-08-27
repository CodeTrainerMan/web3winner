import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TransactionsProvider } from './context/TransactionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TransactionsProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </TransactionsProvider>,
)
// ReactDOM.render(
//   <TransactionProvider>
//     <React.StrictMode>
//       <App/>
//     </React.StrictMode>
//   </TransactionProvider>,
//   document.getElementById("root")
// )