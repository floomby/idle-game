import React, { useEffect, useState } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { capitalDelta } from "../redux/capitalSlice";
import { resourceDelta } from "../redux/resourcesSlice";
import { advanceFrame } from "../redux/gameStateSlice";

export function GameLoop() {
  const light_launch_vehicles = useSelector((state: RootState) => state.capital.values.light_launch_vehicles);
  const scientists = useSelector((state: RootState) => state.capital.values.scientists);
  const market = useSelector((state: RootState) => state.resources.market);
  const frame = useSelector((state: RootState) => state.gameState.frame);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("tick");
      // TODO set market prices)
      dispatch(advanceFrame());
      dispatch(resourceDelta({ dollars: light_launch_vehicles[0] }));
    }, 1000);
    return () => clearInterval(interval);
  }, [light_launch_vehicles, dispatch, frame]);

  return <></>;
}
