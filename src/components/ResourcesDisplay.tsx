import React, { useEffect, useState, useRef } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { Modifiers, multiplierFromModifiers } from "../common";
import { purchaseResource, initMarket } from "../redux/resourcesSlice";

const isUnlocked = (prerequisites: string[], tech: any) => {
  return prerequisites.every((prerequisite) => tech[prerequisite]?.unlocked);
};

export function ResourcesDisplay(props: { modifiers: Modifiers }) {
  const resources = useSelector((state: RootState) => state.resources.values);
  const market = useSelector((state: RootState) => state.resources.market);
  const tech = useSelector((state: RootState) => state.tech.values);
  const dispatch = useDispatch();

  const [multiplier, setMultiplier] = useState(
    multiplierFromModifiers(props.modifiers)
  );
  useEffect(() => {
    setMultiplier(multiplierFromModifiers(props.modifiers));
  }, [props.modifiers]);

  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    dispatch(initMarket());
  }, [dispatch]);
  useEffect(() => {
    mounted.current = true;
  }, []);

  return (
    <Container style={{ marginLeft: "0", marginRight: "0" }} className="mt-1">
      <Row>
        <Col>
          <Table borderless={true} className="unselectable-text">
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
                          disabled={
                            !(
                              market[key] &&
                              resources["dollars"][0] > market[key] * multiplier
                            )
                          }
                          className="air-button btn-sm"
                          onClick={() => {
                            dispatch(purchaseResource([key, multiplier]));
                          }}
                        >
                          {market[key]
                            ? `$${market[key] * multiplier}`
                            : "unavailable"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
        <Col>
          <h3>Market info here</h3>
        </Col>
      </Row>
    </Container>
  );
}
