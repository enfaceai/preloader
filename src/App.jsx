import React from 'react';
import Preloader from "./AppIndex";

export const App = () => {
  return ( <div style={{background: 'black', maxWidth: '300px'}}>
     <Preloader duration={1500} offsetLine={100} dotHorizontalOffset={0.03} offsetLine={150} restartDelay={1000}/> </div>
  );
};
