import React, { useEffect, useRef, useState, useCallback } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { capitalDelta } from "../redux/capitalSlice";
import { resourceDelta, updateMarketPressure } from "../redux/resourcesSlice";
import { advanceFrame, completeEvent } from "../redux/gameStateSlice";
import { applyProgress } from "../redux/techSlice";
import { updateMarket } from "../redux/resourcesSlice";
import { random } from "../common";
import { addNews } from "../redux/newsSlice";
import { Container } from "react-bootstrap";

// There is a maintainability problem with the way I am doing this.

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
  const siliconMines = useSelector(
    (state: RootState) => state.capital.values.silicon_mine
  );
  const dispatch = useDispatch();

  const crashResource = useCallback(
    (resource: string) => {
      dispatch(
        updateMarket({
          [resource]: [
            market.prices[resource] / 2,
            market.targets[resource] / 2,
          ],
        })
      );
      dispatch(updateMarketPressure({ [resource]: 0 }));
      dispatch(addNews(`The market for ${resource} has crashed!`));
    },
    [dispatch, market]
  );

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

  const [message, setMessage] = useState("");

  useEffect(() => {
    const updater = (timeDeltaArg?: number) => {
      const timeDelta = (timeDeltaArg || Date.now() - timeLast.current) / 1000;
      // Yes, I know, steel is not what is actually mined, it is created by adding small amounts of carbon to iron
      dispatch(
        resourceDelta({
          dollars:
            (light_launch_vehicles[0] + 5 * heavy_launch_vehicles[0]) *
            timeDelta,
          aluminum: aluminumMines[0] * timeDelta,
          steel: steelMines[0] * timeDelta,
          silicon: siliconMines[0] * timeDelta,
        })
      );
      if (progressable.length > 0) {
        dispatch(
          applyProgress({
            tech: progressable[Math.floor(Math.random() * progressable.length)],
            progress: research_director[0] * scientists[0] * 0.001 * timeDelta,
          })
        );
      }
      if (frame > 0 && frame % 10 === 0) {
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
        dispatch(
          addNews(`${name} announces plans to explore vertical integration`)
        );
        dispatch(completeEvent("Unlocked Mine Purchasing"));
      }

      Object.entries(market.pressure).forEach(([resource, pressure]) => {
        if (
          !completedEvents[`Dumping ${resource}`] &&
          Math.sqrt(-pressure) * 2 > frame
        ) {
          dispatch(completeEvent(`Dumping ${resource}`));
          dispatch(
            addNews(
              `World Trade Organization launches investigation into ${resource} dumping`
            )
          );
        }
        if (Math.sqrt(-pressure) > frame) {
          crashResource(resource);
        }
      });

      dispatch(advanceFrame());
      setMessage(
        `Research/second ${(
          (totalProgress - progressLast.current) /
          timeDelta
        ).toFixed(2)}`
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
    market,
    totalProgress,
    timeLast,
    aluminumMines,
    steelMines,
    crashResource,
  ]);

  return (
    <Container
      className="fixed-bottom text-end"
      style={{
        width: "100vw",
        color: "green",
        marginBottom: "0.5em",
        marginRight: "0.2em",
        zIndex: -1,
      }}
    >
      {message}
    </Container>
  );
}
