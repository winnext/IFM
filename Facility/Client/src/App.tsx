import React from 'react';
// import { useAppDispatch, useAppSelector } from "../app/hook";
// import {save} from "../features/tree/treeSlice"
// routes
import Router from './routes';
//components
import ScrollToTop from './components/ScrollToTop';

function App() {
  // const dispatch = useAppDispatch()
  // const tree = useAppSelector(state => state.tree)

  // dispatch(save(temp))
  return (
    <>
      <ScrollToTop />
      <Router />
    </>
  );
}

export default App;
