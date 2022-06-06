import React from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { completeEvent } from "../redux/gameStateSlice";
import { Button, Table } from "react-bootstrap";
import { resourceDelta } from "../redux/resourcesSlice";

export function Special() {
  const events = useSelector(
    (state: RootState) => state.gameState.completedEvents
  );
  const dispatch = useDispatch();
  const resources = useSelector((state: RootState) => state.resources.values);

  const minePrice = 1000;

  return (
    <>
      <Table borderless>
        <tbody>
          {events["Unlocked Mine Purchasing"] && !events["Mine Purchased"] ? (
            <tr>
              <td>
                <span style={{ color: "white" }}>
                  <strong>Acquire mining license</strong>
                </span>
              </td>
              <td>
                <Button
                  disabled={resources["dollars"][0] < minePrice}
                  className="air-button"
                  onClick={() => {
                    dispatch(completeEvent("Mine Purchased"));
                    dispatch(resourceDelta({ dollars: -minePrice }));
                  }}
                >
                  <strong>${minePrice}</strong>
                </Button>
              </td>
            </tr>
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </>
  );
}
