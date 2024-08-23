import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// `root`라는 id를 가진 DOM 노드를 선택합니다.
const rootElement = document.getElementById('root');

// `createRoot`를 사용하여 루트 객체를 생성합니다.
const root = ReactDOM.createRoot(rootElement);

// `render` 메서드를 사용하여 앱을 렌더링합니다.
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
