import React, { useEffect } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { exposeResource, ResourceType } from "../redux/resourcesSlice";

export function ResourcesDisplay() {
  const resources = useSelector((state: RootState) => state.resources);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(exposeResource("dollars"));
  }, [dispatch]);

  return (
    <div>
      <div>
        {/* <button
          aria-label="Test"
          onClick={() => dispatch(exposeResource("silicon"))}
        >
          Test
        </button> */}
        <ul>
          {Object.keys(resources.values)
            .filter((k) => resources.values[k as ResourceType][1])
            .map((k) => (
              <li key={k}>
                <span>
                  <strong>
                    {k} - {resources.values[k as ResourceType]}
                  </strong>
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
