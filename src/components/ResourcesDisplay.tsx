import React, { useEffect } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
// import { } from "../redux/resourcesSlice";

const isUnlocked = (prerequisites: string[], tech: any) => {
  return prerequisites.every((prerequisite) => tech[prerequisite]?.unlocked);
};

export function ResourcesDisplay() {
  const resources = useSelector((state: RootState) => state.resources);
  const tech = useSelector((state: RootState) => state.tech.values);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(exposeResource("dollars"));
  // }, [dispatch]);

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
          {Object.entries(resources.values)
            .filter(([key, value]) => isUnlocked(value[1], tech))
            .map(([key, value]) => (
              <li key={key}>
                <span>
                  <strong>
                    {key} - {value[0]}
                  </strong>
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
