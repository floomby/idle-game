import React, { useEffect, useState, useRef } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { Modifiers, multiplierFromModifiers } from "../common";
import { purchaseResource } from "../redux/resourcesSlice";

const isUnlocked = (prerequisites: string[], tech: any) => {
  return prerequisites.every((prerequisite) => tech[prerequisite]?.unlocked);
};

export function ResourcesDisplay(props: { modifiers: Modifiers }) {
  const resources = useSelector((state: RootState) => state.resources.values);
  const prices = useSelector(
    (state: RootState) => state.resources.market.prices
  );
  const tech = useSelector((state: RootState) => state.tech.values);
  const dispatch = useDispatch();

  const [multiplier, setMultiplier] = useState(
    multiplierFromModifiers(props.modifiers)
  );
  useEffect(() => {
    setMultiplier(multiplierFromModifiers(props.modifiers));
  }, [props.modifiers]);

  // I am doing this in the story component now, this way when I restore from saves this does not create problems
  // const mounted = useRef(false);
  // useEffect(() => {
  //   if (mounted.current) return;
  //   dispatch(initMarket());
  // }, [dispatch]);
  // useEffect(() => {
  //   mounted.current = true;
  // }, []);

  const data = Object.entries(resources).map(
    ([resource, [amount, prerequisites]]) => [
      resource,
      amount,
      isUnlocked(prerequisites, tech),
    ]
  );

  const unlockedResources = data.filter(([, , unlocked]) => unlocked);

  return (
    <Table
      borderless={true}
      className="unselectable-text"
      style={{ tableLayout: "fixed", margin: "0" }}
    >
      <tbody style={{ color: "white" }}>
        {unlockedResources.map(([resource, amount]) => (
          <tr key={resource as string}>
            <td>
              <strong>
                {resource === "dollars" ? "$" : `${resource} : `}
                {resource === "dollars"
                  ? (amount as number).toFixed(2)
                  : amount}
              </strong>
            </td>
            <td>
              {resource === "dollars" ? (
                unlockedResources.length > 1 ? (
                  <>Buy Resources</>
                ) : (
                  <></>
                )
              ) : (
                <Button
                  style={{ color: "red" }}
                  disabled={
                    !(
                      prices[resource as string] &&
                      resources["dollars"][0] >=
                        prices[resource as string] * multiplier
                    )
                  }
                  className="air-button btn-sm"
                  onClick={() => {
                    dispatch(
                      purchaseResource([resource as string, multiplier])
                    );
                  }}
                >
                  <strong>
                    {prices[resource as string]
                      ? `$${(multiplier * prices[resource as string]).toFixed(
                          2
                        )}`
                      : "unavailable"}
                  </strong>
                </Button>
              )}
            </td>
            <td>
              {resource === "dollars" ? (
                unlockedResources.length > 1 ? (
                  <>Sell Resources</>
                ) : (
                  <></>
                )
              ) : (
                <Button
                  style={{ color: "green" }}
                  disabled={
                    !(
                      resources[resource as string] &&
                      resources[resource as string][0] >= multiplier
                    )
                  }
                  className="air-button btn-sm"
                  onClick={() => {
                    dispatch(
                      purchaseResource([
                        resource as string,
                        -multiplier / prices[resource as string],
                      ])
                    );
                  }}
                >
                  <strong>
                    {prices[resource as string]
                      ? `$${(multiplier * prices[resource as string]).toFixed(
                          2
                        )}`
                      : "unavailable"}
                  </strong>
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
