import React from 'react';
import Preloader from "./AppIndex";

export const App = () => {
  return ( <div style={{background: 'black'}}>
     <Preloader duration={1500} width={450} height={630} offsetLine={100} endPos={934} dotHorizontalOffset={0.03} offsetLine={150} restartDelay={1000}/> </div>
  );
};
