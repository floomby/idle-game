import React, { useState, useEffect, useRef, useCallback } from "react";
import { Intro } from "./components/Intro";
import { ResourcesDisplay } from "./components/ResourcesDisplay";
import { RootState } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { TechTree } from "./components/TechTree";
import { Capital } from "./components/Capital";
import { Container, Row, Col } from "react-bootstrap";
import { News } from "./components/News";
import { Modifiers, ModifiersKeys } from "./common";
import { Modal, Button } from "react-bootstrap";
import {
  GameStates,
  restore as restoreGameState,
} from "./redux/gameStateSlice";
import { restore as restorePlayer } from "./redux/playerSlice";
import { restore as restoreResources } from "./redux/resourcesSlice";
import { restore as restoreTech } from "./redux/techSlice";
import { restore as restoreCapital } from "./redux/capitalSlice";
import { restore as restoreNews } from "./redux/newsSlice";

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

const HelpModal = (props: {
  show: boolean;
  hide: () => void;
  save: () => void;
  load: () => void;
}) => {
  return (
    <Modal
      show={props.show}
      keyboard={false}
      centered={true}
      className="special_modal"
    >
      <Modal.Body>
        <p>
          <strong>
            This is a clicker game. (Sorry about that. I know the whole genre
            sucks.) <br />
            <br />
            ...anyways start by clicking on technologies to get to researching
            them. Keep clicking on stuff and making stuff. Explore around and
            see what you can find. There are secrets to discover.
          </strong>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="air-button"
          style={{ color: "black" }}
          onClick={props.load}
        >
          <strong>Load</strong>
        </Button>
        <Button
          variant="secondary"
          className="air-button"
          style={{ color: "black" }}
          onClick={props.save}
        >
          <strong>Save</strong>
        </Button>
        <Button
          variant="secondary"
          className="air-button"
          style={{ color: "black" }}
          onClick={props.hide}
        >
          <strong>Dismiss</strong>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export function App() {
  const player = useSelector((state: RootState) => state.player);
  const resources = useSelector((state: RootState) => state.resources);
  const gameState = useSelector((state: RootState) => state.gameState);
  const tech = useSelector((state: RootState) => state.tech);
  const capital = useSelector((state: RootState) => state.capital);
  const news = useSelector((state: RootState) => state.news);
  const dispatch = useDispatch();

  const save = () => {
    // console.log("saving");
    // console.log(player);
    // console.log(resources);
    // console.log(gameState);
    // console.log(tech);
    // console.log(capital);
    // console.log(news);
    localStorage.setItem("player", JSON.stringify(player));
    localStorage.setItem("resources", JSON.stringify(resources));
    localStorage.setItem("gameState", JSON.stringify(gameState));
    localStorage.setItem("tech", JSON.stringify(tech));
    localStorage.setItem("capital", JSON.stringify(capital));
    localStorage.setItem("news", JSON.stringify(news));
  };

  const load = () => {
    let invalid = false;
    const player = localStorage.getItem("player");
    if (!player) {
      console.error("Unable to load: player");
      invalid = true;
    }
    const resources = localStorage.getItem("resources");
    if (!resources) {
      console.error("Unable to load: resources");
      invalid = true;
    }
    const gameState = localStorage.getItem("gameState");
    if (!gameState) {
      console.error("Unable to load: gameState");
      invalid = true;
    }
    const tech = localStorage.getItem("tech");
    if (!tech) {
      console.error("Unable to load: tech");
      invalid = true;
    }
    const capital = localStorage.getItem("capital");
    if (!capital) {
      console.error("Unable to load: capital");
      invalid = true;
    }
    const news = localStorage.getItem("news");
    if (!news) {
      console.error("Unable to load: news");
      invalid = true;
    }

    if (invalid) return;

    console.log("loaded");
    dispatch(restorePlayer(player!));
    dispatch(restoreResources(resources!));
    dispatch(restoreGameState(gameState!));
    dispatch(restoreTech(tech!));
    dispatch(restoreCapital(capital!));
    dispatch(restoreNews(news!));
  };

  const [show, setShow] = useState(false);

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
    if (event.key === "Escape") {
      setShow(!show);
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
      <HelpModal
        show={show}
        hide={() => setShow(!show)}
        save={save}
        load={load}
      />
      {gameState.phase === GameStates.Playing ? (
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
              <Capital modifiers={modifiers} />
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
