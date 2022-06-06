import React, { useEffect, useCallback } from "react";
import {
  GameStates,
  setGameState,
  advanceDialog,
} from "../redux/gameStateSlice";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container } from "react-bootstrap";
import { useTransition, config as springConfig, animated } from "react-spring";
import { initTech } from "../redux/techSlice";

// Something like this (I still don't know what the story or the gameplay are exactly)
const story = [
  `...Something, something, engaging story, something...`,
  `You are a entrepreneur who has recently started a space company.`,
];

export default function Story(props: { index: number }) {
  const gameState = useSelector((state: RootState) => state.gameState);
  const dispatch = useDispatch();

  const transition = useTransition(props.index, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig.gentle,
  });

  const advance = useCallback(() => {
    if (gameState.dialogIndex === story.length - 1) {
      dispatch(setGameState(GameStates.Playing));
      dispatch(initTech());
    } else {
      dispatch(advanceDialog());
    }
  }, [dispatch, gameState.dialogIndex]);

  useEffect(() => {
    document.addEventListener("keydown", advance, false);
    return () => {
      document.removeEventListener("keydown", advance, false);
    };
  }, [advance]);

  return transition(({ opacity }, index) => (
    <>
      <animated.div
        style={{
          position: "absolute",
          width: "100%",
          left: 0,
          opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
        }}
      >
        <p className="text-center" style={{ color: "white" }}>
          <strong>{story[index]}</strong>
        </p>
      </animated.div>
      <div
        style={{ width: "10%", marginLeft: "auto" }}
        className="fixed-bottom mb-3"
      >
        <Button
          className="air-button ml-3"
          onClick={(e) => {
            if (index === story.length - 1) {
              dispatch(setGameState(GameStates.Playing));
            } else {
              dispatch(advanceDialog());
            }
          }}
        >
          Next
        </Button>
      </div>
    </>
  ));
}
