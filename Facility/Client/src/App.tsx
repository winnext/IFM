import React from 'react';
// routes
import Router from './routes';
//components
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Router />
    </>
  );
}

export default App;
