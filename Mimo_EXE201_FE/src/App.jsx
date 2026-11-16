import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import CookieConsent from './components/common/CookieConsent';
import { initAnalytics, trackPageView } from './utils/analytics';
import './App.css';

function App() {
  // Google Analytics: chỉ bật khi người dùng đã đồng ý cookie; gửi page_view mỗi khi đổi route
  useEffect(() => {
    initAnalytics();

    let lastPath = null;
    const sendIfChanged = (state) => {
      const path = state.location.pathname;
      if (path !== lastPath) {
        lastPath = path;
        trackPageView(path);
      }
    };

    sendIfChanged(router.state);
    return router.subscribe(sendIfChanged);
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <CookieConsent />
    </AuthProvider>
  );
}

export default App;
