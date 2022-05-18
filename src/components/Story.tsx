import React, { useEffect } from "react";
import {
  GameStates,
  setGameState,
  advanceDialog,
} from "../redux/gameStateSlice";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container } from "react-bootstrap";
import { useTransition, config as springConfig, animated } from "react-spring";

// Something like this (I still don't know what the story or the gameplay are exactly)
const story = [
  `Continuous, accelerating advancements in aerospace technology has brought earth to the point where a sizable orbital infrastructure has began to build up. There is a constant need for raw materials to construct this infrastructure. For the continuing construction resources will need to be sourced from elsewhere in the solar system. The moon and near earth asteroids are the first targets for these expanding resource gathering operations.`,
  `You are a businessman who has recently taken control of earths leading private space company. This is a cutthroat business, and you must be aggressive to maintain your position. Small early advantages can have outsized impacts on the future, or so your economists tell you.`,
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

  const advance = () => {
    if (gameState.dialogIndex === story.length - 1) {
      dispatch(setGameState(GameStates.Playing));
    } else {
      dispatch(advanceDialog());
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", advance, false);
    return () => {
      document.removeEventListener("keydown", advance, false);
    };
  }, []);

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
        <p className="text-center">{story[index]}</p>
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
