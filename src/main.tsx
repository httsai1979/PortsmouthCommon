import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * 核心修復：這段程式碼會同時尋找 'app' 和 'root' 容器。
 * 確保 React 能夠正確掛載到網頁上，徹底解決 Error #299 (白畫面)。
 */
const rootElement = document.getElementById('app') || document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  console.error("找不到掛載點，請確認 index.html 裡面有 <div id='app'></div>");
}
