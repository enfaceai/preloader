import React from 'react';
import Preloader from "./AppIndex";

export const App = () => {
  console.log(Preloader, 'pre')
  return ( <div style={{background: 'black'}}>
     <Preloader duration={2000} offsetLine={100}/> </div>
  );
};
