import React, { useState } from "react";
import { Intro } from "./components/Intro";
import { ResourcesDisplay } from "./components/ResourcesDisplay";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { GameStates } from "./redux/gameStateSlice";
import { TechTree } from "./components/TechTree";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

export function App() {
  const gameState = useSelector((state: RootState) => state.gameState.phase);

  return (
    <>
      {gameState === GameStates.Playing ? (
        <div>
          <ResourcesDisplay />
          <TechTree />
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
}

export default App;
