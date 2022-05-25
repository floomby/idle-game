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
            them. Keep clicking on stuff and making stuff. The alt, ctrl, and shift
            key can be used to buy and sell in bulk. Explore around and
            see what you can find. See if you can unlock everything.
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

  const save = (postfix: string) => {
    // console.log("saving");
    // console.log(player);
    // console.log(resources);
    // console.log(gameState);
    // console.log(tech);
    // console.log(capital);
    // console.log(news);
    localStorage.setItem(`player${postfix}`, JSON.stringify(player));
    localStorage.setItem(`resources${postfix}`, JSON.stringify(resources));
    localStorage.setItem(`gameState${postfix}`, JSON.stringify(gameState));
    localStorage.setItem(`tech${postfix}`, JSON.stringify(tech));
    localStorage.setItem(`capital${postfix}`, JSON.stringify(capital));
    localStorage.setItem(`news${postfix}`, JSON.stringify(news));
  };

  const load = (postfix: string) => {
    let invalid = false;
    const player = localStorage.getItem(`player${postfix}`);
    if (!player) {
      console.error("Unable to load: player");
      invalid = true;
    }
    const resources = localStorage.getItem(`resources${postfix}`);
    if (!resources) {
      console.error("Unable to load: resources");
      invalid = true;
    }
    const gameState = localStorage.getItem(`gameState${postfix}`);
    if (!gameState) {
      console.error("Unable to load: gameState");
      invalid = true;
    }
    const tech = localStorage.getItem(`tech${postfix}`);
    if (!tech) {
      console.error("Unable to load: tech");
      invalid = true;
    }
    const capital = localStorage.getItem(`capital${postfix}`);
    if (!capital) {
      console.error("Unable to load: capital");
      invalid = true;
    }
    const news = localStorage.getItem(`news${postfix}`);
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
      <Button
        onClick={() => setShow(!show)}
        className="air-button"
        style={{ marginTop: "-9px", marginLeft: "-9px", float: "left" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-gear"
          viewBox="0 0 16 16"
        >
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
        </svg>
      </Button>
      <HelpModal
        show={show}
        hide={() => setShow(!show)}
        save={() => save("")}
        load={() => load("")}
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
