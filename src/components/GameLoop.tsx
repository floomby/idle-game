import React, { useEffect, useRef } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { capitalDelta } from "../redux/capitalSlice";
import { resourceDelta } from "../redux/resourcesSlice";
import { advanceFrame, completeEvent } from "../redux/gameStateSlice";
import { applyProgress } from "../redux/techSlice";
import { updateMarket } from "../redux/resourcesSlice";
import { random } from "../common";
import { addNews } from "../redux/newsSlice";

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

  useEffect(() => {
    const updater = () => {
      dispatch(
        resourceDelta({
          dollars:
            ((light_launch_vehicles[0] + 5 * heavy_launch_vehicles[0]) *
              (Date.now() - timeLast.current)) /
            1000,
        })
      );
      if (progressable.length > 0) {
        dispatch(
          applyProgress({
            tech: progressable[Math.floor(Math.random() * progressable.length)],
            progress:
              (research_director[0] *
                scientists[0] *
                0.001 *
                (Date.now() - timeLast.current)) /
              1000,
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
      }

      dispatch(advanceFrame());
      console.log("progress delta is", totalProgress - progressLast.current);
      progressLast.current = totalProgress;
      timeLast.current = Date.now();
    };
    if (Date.now() - timeLast.current > 1000) {
      updater();
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
  ]);

  return <></>;
}
