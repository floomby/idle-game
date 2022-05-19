import React, { useState } from "react";
import { Intro } from "./components/Intro";
import { ResourcesDisplay } from "./components/ResourcesDisplay";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { GameStates } from "./redux/gameStateSlice";
import { TechTree } from "./components/TechTree";
import { Capital } from "./components/Capital";
import { Container, Row, Col } from "react-bootstrap";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

export function App() {
  const gameState = useSelector((state: RootState) => state.gameState.phase);

  return (
    <>
      {gameState === GameStates.Playing ? (
        <Container
          style={{ width: "100vw", marginLeft: "0", marginRight: "0" }}
          fluid
        >
          <Row>
            <Col md={6}>
              <TechTree />
            </Col>
            <Col md={6}>
              <Capital />
            </Col>
          </Row>
          <ResourcesDisplay />
        </Container>
      ) : (
        <Intro />
      )}
    </>
  );
}

export default App;
