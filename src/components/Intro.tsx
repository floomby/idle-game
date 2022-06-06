import React, { useEffect, useState } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { setName } from "../redux/playerSlice";
import { useTransition, animated, config as springConfig } from "react-spring";
import { Container, Form, Row } from "react-bootstrap";
import {
  GameStates,
  setGameState,
  advanceDialog,
  resetDialog,
} from "../redux/gameStateSlice";
import Story from "./Story";

export function Intro() {
  const name = useSelector((state: RootState) => state.player.name);
  const gameState = useSelector((state: RootState) => state.gameState);
  const dispatch = useDispatch();

  const transition = useTransition(gameState, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig.gentle,
  });

  // Just to remind myself that this is needed for everything except at the start
  // useEffect(() => {
  //   dispatch(resetDialog());
  // }, []);

  return transition(({ opacity }, state) =>
    state.phase === GameStates.Naming ? (
      <animated.div
        style={{
          width: "100vw",
          left: 0,
          position: "absolute",
          opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
        }}
      >
        <Container style={{ width: "100%" }}>
          <Row className="align-items-center" style={{ height: "100vh" }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(setGameState(GameStates.Story));
              }}
            >
              <Form.Group controlId="name">
                <Form.Control
                  autoFocus
                  className="air-form text-center"
                  autoComplete="off"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => dispatch(setName(e.target.value))}
                />
              </Form.Group>
            </Form>
          </Row>
        </Container>
      </animated.div>
    ) : (
      <animated.div
        style={{
          width: "100vw",
          left: 0,
          position: "absolute",
          opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
        }}
      >
        <Container style={{ width: "100%" }}>
          <Row className="align-items-center" style={{ height: "100vh" }}>
            <Story index={gameState.dialogIndex} />
          </Row>
        </Container>
      </animated.div>
    )
  );
}
