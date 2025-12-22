import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * 解決 Error #299 的核心：
 * 您的 index.html 中定義的是 <div id="app"></div>
 * 因此這裡必須精確尋找 'app' 元素。
 */
const rootElement = document.getElementById('app');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  // 增加容錯檢查
  const fallback = document.getElementById('root');
  if (fallback) {
    ReactDOM.createRoot(fallback).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } else {
    console.error("Critical Error: No mounting point found (id='app' or 'root').");
  }
}
