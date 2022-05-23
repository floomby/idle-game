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

  return (
    <Container style={{ marginLeft: "0", marginRight: "0" }} className="mt-1">
      <Row>
        <Col>
          <Table
            borderless={true}
            className="unselectable-text"
            style={{ tableLayout: "fixed" }}
          >
            <tbody>
              {Object.entries(resources)
                .filter(([key, value]) => isUnlocked(value[1], tech))
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>
                      <strong>
                        {key === "dollars" ? "$" : `${key} - `}
                        {value[0]}
                      </strong>
                    </td>
                    <td>
                      {key === "dollars" ? (
                        <></>
                      ) : (
                        <Button
                          style={{ color: "red" }}
                          disabled={
                            !(
                              prices[key] &&
                              resources["dollars"][0] >=
                                prices[key] * multiplier
                            )
                          }
                          className="air-button btn-sm"
                          onClick={() => {
                            dispatch(purchaseResource([key, multiplier]));
                          }}
                        >
                          <strong>
                            {prices[key]
                              ? `$${(multiplier * prices[key]).toFixed(2)}`
                              : "unavailable"}
                          </strong>
                        </Button>
                      )}
                    </td>
                    <td>
                      {key === "dollars" ? (
                        <></>
                      ) : (
                        <Button
                          style={{ color: "green" }}
                          disabled={
                            !(resources[key] && resources[key][0] >= multiplier)
                          }
                          className="air-button btn-sm"
                          onClick={() => {
                            dispatch(
                              purchaseResource([key, -multiplier * prices[key]])
                            );
                          }}
                        >
                          <strong>
                            {prices[key]
                              ? `$${(multiplier * prices[key]).toFixed(2)}`
                              : "unavailable"}
                          </strong>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
        <Col>
          <h3></h3>
        </Col>
      </Row>
    </Container>
  );
}
