import React from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { exposeResource, ResourceType } from "../redux/resourcesSlice";

export function ResourcesDisplay() {
  const resources = useSelector((state: RootState) => state.resources);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Test"
          onClick={() => dispatch(exposeResource("silicon"))}
        >
          Test
        </button>
        <ul>
          {Object.keys(resources.values)
            .filter((k) => resources.values[k as ResourceType][1])
            .map((k) => (
              <li key={k}><span>{k} - {resources.values[k as ResourceType]}</span></li>
            ))}
        </ul>
      </div>
    </div>
  );
}
