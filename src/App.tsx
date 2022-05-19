import React, { useState } from "react";
import { Intro } from "./components/Intro";
import { ResourcesDisplay } from "./components/ResourcesDisplay";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { GameStates } from "./redux/gameStateSlice";
import { TechTree } from "./components/TechTree";
import { Capital } from "./components/Capital";
import { Container, Row, Col } from "react-bootstrap";
import { News } from "./components/News";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { GameLoop } from "./components/GameLoop";

export function App() {
  const gameState = useSelector((state: RootState) => state.gameState.phase);

  return (
    <>
      {gameState === GameStates.Playing ? (
        <Container
          style={{ width: "100vw", marginLeft: "0", marginRight: "0" }}
          fluid
        >
          <Row className="mb-2">
            <News />
            <br/>
          </Row>
          <Row>
            <Col md={6}>
              <TechTree />
            </Col>
            <Col md={6}>
              <Capital />
            </Col>
          </Row>
          <ResourcesDisplay />
          <GameLoop />
        </Container>
      ) : (
        <Intro />
      )}
    </>
  );
}

export default App;
