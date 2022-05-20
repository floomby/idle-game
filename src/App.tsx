import React, { useState, useEffect, useRef } from "react";
import { Intro } from "./components/Intro";
import { ResourcesDisplay } from "./components/ResourcesDisplay";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { GameStates } from "./redux/gameStateSlice";
import { TechTree } from "./components/TechTree";
import { Capital } from "./components/Capital";
import { Container, Row, Col } from "react-bootstrap";
import { News } from "./components/News";
import { Modifiers, ModifiersKeys } from "./common";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { GameLoop } from "./components/GameLoop";

// TODO: fix typings in this thing (idk react event typings)
function useEventListener(eventName: string, handler: any, element = window) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: any) => (savedHandler.current! as any)(event);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

export function App() {
  const gameState = useSelector((state: RootState) => state.gameState.phase);

  const [modifiers, setModifiers] = useState<Modifiers>({
    shift: false,
    alt: false,
    ctrl: false,
  });

  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setModifiers({
        ...modifiers,
        shift: true,
      });
    }
    if (event.key === "Alt") {
      setModifiers({
        ...modifiers,
        alt: true,
      });
    }
    if (event.key === "Control") {
      setModifiers({
        ...modifiers,
        ctrl: true,
      });
    }
  });

  useEventListener("keyup", (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setModifiers({
        ...modifiers,
        shift: false,
      });
    }
    if (event.key === "Alt") {
      setModifiers({
        ...modifiers,
        alt: false,
      });
    }
    if (event.key === "Control") {
      setModifiers({
        ...modifiers,
        ctrl: false,
      });
    }
  });

  useEventListener("blur", (event: FocusEvent) => {
    setModifiers({
      shift: false,
      alt: false,
      ctrl: false,
      });
  });

  return (
    <>
      {gameState === GameStates.Playing ? (
        <Container
          style={{ width: "100vw", marginLeft: "0", marginRight: "0" }}
          fluid
        >
          <Row className="mb-2">
            <News />
            <br />
          </Row>
          <Row>
            <Col md={6}>
              <TechTree />
            </Col>
            <Col md={6}>
              <Capital modifiers={modifiers}/>
            </Col>
          </Row>
          <ResourcesDisplay modifiers={modifiers} />
          <GameLoop />
        </Container>
      ) : (
        <Intro />
      )}
    </>
  );
}

export default App;
