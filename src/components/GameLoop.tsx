import React, { useEffect } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { capitalDelta } from "../redux/capitalSlice";
import { resourceDelta } from "../redux/resourcesSlice";

export function GameLoop() {
  const light_rockets = useSelector((state: RootState) => state.capital.values.light_rockets);
  const scientists = useSelector((state: RootState) => state.capital.values.scientists);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("tick");
      dispatch(resourceDelta({ dollars: light_rockets[0] }));
    }, 1000);
    return () => clearInterval(interval);
  }, [light_rockets, dispatch]);

  return <></>;
}
