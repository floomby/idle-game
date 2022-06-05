import React, { useEffect, useRef, useState } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { capitalDelta } from "../redux/capitalSlice";
import { resourceDelta } from "../redux/resourcesSlice";
import { advanceFrame, completeEvent } from "../redux/gameStateSlice";
import { applyProgress } from "../redux/techSlice";
import { updateMarket } from "../redux/resourcesSlice";
import { random } from "../common";
import { addNews } from "../redux/newsSlice";
import { Container } from "react-bootstrap";

// This is not the most efficient way to do this
export function GameLoop(props: { autosave: () => void }) {
  const light_launch_vehicles = useSelector(
    (state: RootState) => state.capital.values.light_launch_vehicles
  );
  const heavy_launch_vehicles = useSelector(
    (state: RootState) => state.capital.values.heavy_launch_vehicles
  );
  const scientists = useSelector(
    (state: RootState) => state.capital.values.scientists
  );
  const research_director = useSelector(
    (state: RootState) => state.capital.values.research_director
  );
  const market = useSelector((state: RootState) => state.resources.market);
  const progressable = useSelector(
    (state: RootState) => state.tech.progressable
  );
  const frame = useSelector((state: RootState) => state.gameState.frame);
  const completedEvents = useSelector(
    (state: RootState) => state.gameState.completedEvents
  );
  const tech = useSelector((state: RootState) => state.tech.values);
  const totalProgress = useSelector(
    (state: RootState) => state.tech.progressCounter
  );
  const name = useSelector((state: RootState) => state.player.name);
  const aluminumMines = useSelector(
    (state: RootState) => state.capital.values.aluminum_mine
  );
  const steelMines = useSelector(
    (state: RootState) => state.capital.values.steel_mine
  );
  const dispatch = useDispatch();

  const mounted = useRef(false);
  const progressLast = useRef(0);
  const timeLast = useRef(0);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      progressLast.current = totalProgress;
      timeLast.current = Date.now();
    }
  }, [totalProgress]);

  // I had a plan for this, I can't remember what it was though
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updater = (timeDeltaArg?: number) => {
      const timeDelta = timeDeltaArg || Date.now() - timeLast.current;
      dispatch(
        resourceDelta({
          dollars:
            ((light_launch_vehicles[0] + 5 * heavy_launch_vehicles[0]) *
              timeDelta) /
            1000,
        })
      );
      dispatch(
        resourceDelta({ aluminum: (aluminumMines[0] * timeDelta) / 1000 })
      );
      if (progressable.length > 0) {
        dispatch(
          applyProgress({
            tech: progressable[Math.floor(Math.random() * progressable.length)],
            progress:
              (research_director[0] * scientists[0] * 0.001 * timeDelta) / 1000,
          })
        );
      }
      // Yes, I know, steel is not what is actually mined, it is created by adding small amounts of carbon to iron
      dispatch(resourceDelta({ steel: (steelMines[0] * timeDelta) / 1000 }));
      if (progressable.length > 0) {
        dispatch(
          applyProgress({
            tech: progressable[Math.floor(Math.random() * progressable.length)],
            progress:
              (research_director[0] * scientists[0] * 0.001 * timeDelta) / 1000,
          })
        );
      }
      if (frame % 10 === 0) {
        props.autosave();
        dispatch(
          updateMarket(
            Object.fromEntries(
              Object.entries(market.prices).map(([key, value]) => {
                return [key, [random(value, value / 30), value]];
              })
            )
          )
        );
        if (
          !completedEvents["Quantum News"] &&
          tech["Computing III"].progress >= 0.5
        ) {
          dispatch(completeEvent("Quantum News"));
          dispatch(
            addNews(
              "Scientists begin to fear impending quantum computing will create chaos as encryption schemes used for decades prove to no longer be secure."
            )
          );
        }
      }
      if (frame === 2) {
        dispatch(
          addNews(
            `${name} expresses excitement to media as first round of VC proves to be a massive successes.`
          )
        );
        dispatch(
          resourceDelta({
            dollars: 100000,
          })
        );
      }
      if (frame === 15) {
        dispatch(completeEvent("Unlocked Mine Purchasing"));
      }

      dispatch(advanceFrame());
      console.log(
        "progress per second is",
        (totalProgress - progressLast.current) / (timeDelta / 1000)
      );
      progressLast.current = totalProgress;
      timeLast.current = Date.now();
    };
    const timeDelta = Date.now() - timeLast.current;
    if (timeDelta > 1000) {
      updater(timeDelta);
    }
    const interval = setInterval(updater, 1000);
    return () => clearInterval(interval);
  }, [
    light_launch_vehicles,
    dispatch,
    frame,
    heavy_launch_vehicles,
    progressable,
    research_director,
    scientists,
    completedEvents,
    tech,
    name,
    props,
    market.prices,
    totalProgress,
    timeLast,
    aluminumMines,
    steelMines,
  ]);

  return (
    <Container
      className="fixed-bottom text-end"
      style={{ width: "100vw", color: "red" }}
    >
      {message}
    </Container>
  );
}
