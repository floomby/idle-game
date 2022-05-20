import React, { useMemo } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { capitalDelta, CapitalType } from "../redux/capitalSlice";
import { resourceDelta } from "../redux/resourcesSlice";
import {
  Button,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { addNews } from "../redux/newsSlice";
import structuredClone from "@ungap/structured-clone";

import capital from "../capital.json";

const capitalData = new Map<
  string,
  { cost: Record<string, number>; prerequisites: string[] }
>(
  capital.map((item) => [
    item.name,
    {
      cost: item.cost as Record<string, number>,
      prerequisites: item.prerequisites,
    },
  ])
);

const isUnlocked = (capitalType: CapitalType, tech: any) => {
  return capitalData
    .get(capitalType)!
    .prerequisites.every((prerequisite) => tech[prerequisite]?.unlocked);
};

const ResourceTooltip = (props: { resources: Record<string, number> }) => {
  return (
    <ul style={{ marginBottom: "0px" }}>
      {Object.entries(props.resources).map(([key, value]) => {
        return (
          <li key={key}>
            {key}: {-(value as number)}
          </li>
        );
      })}
    </ul>
  );
};

const costCovered = (
  a: Record<string, number>,
  b: Record<string, [number, string[]]>
) => {
  return Object.entries(a).every(([key, value]) => {
    return b[key as string] && b[key as string]![0] + value >= 0;
  });
};

const CapitalItem = (props: { capitalType: CapitalType }) => {
  const resources = useSelector((state: RootState) => state.resources.values);
  const tech = useSelector((state: RootState) => state.tech.values);
  const value = useSelector(
    (state: RootState) => state.capital.values[props.capitalType]
  );
  const dispatch = useDispatch();
  const deltaCapital: Partial<Record<CapitalType, number>> = {};
  deltaCapital[props.capitalType] = 1;
  const deltaResource = useMemo(() => {
    const ret = structuredClone(
      capitalData.get(props.capitalType)?.cost as Record<string, number>
    );
    Object.entries(ret).forEach(([key, value]) => {
      ret[key as string] = -(value as number);
    });
    return ret;
  }, [props.capitalType]);

  return (
    <>
      {isUnlocked(props.capitalType, tech) ? (
        <Container>
          <Row>
            <Col>
              <span>
                <h6 style={{ marginTop: "10px" }}>
                  <strong>
                    {props.capitalType}: {value}
                  </strong>
                </h6>
              </span>
            </Col>
            <Col>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <ResourceTooltip resources={deltaResource} />
                  </Tooltip>
                }
              >
                <span>
                  <Button
                    disabled={!costCovered(deltaResource, resources)}
                    className="air-button"
                    onClick={() => {
                      dispatch(capitalDelta(deltaCapital));
                      dispatch(resourceDelta(deltaResource));
                      dispatch(addNews(`${props.capitalType} bought`));
                    }}
                  >
                    Add {props.capitalType.toString()}
                  </Button>
                </span>
              </OverlayTrigger>
            </Col>
          </Row>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
};

export function Capital() {
  return (
    <>
      <h3 className="text-center">Capital</h3>
      <div
        style={{
          // width: "50vw",
          height: "50vh",
          overflowY: "scroll",
          overflowX: "scroll",
          margin: "0",
        }}
        className="no-scrollbars unselectable-text"
      >
        <div
          style={{
            borderRadius: "14px",
            background: "#272b4d",
            height: "1024px",
            width: "100%",
          }}
        >
          <br />
          <CapitalItem capitalType="scientists" />
          <CapitalItem capitalType="light_rockets" />
        </div>
      </div>
    </>
  );
}
