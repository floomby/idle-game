import React, { useMemo, useState, useEffect } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { capitalDelta } from "../redux/capitalSlice";
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
import { Modifiers, multiplierFromModifiers } from "../common";

import capitalRaw from "../capital.json";

const capitalData = new Map<
  string,
  {
    cost: Record<string, number>;
    prerequisites: {
      tech: string[];
      capitalRequirements: Partial<Record<string, number>>;
      events: string[];
    };
    description: string | undefined;
    display: {
      name: string;
      acquire: string;
    };
  }
>(
  capitalRaw.map((item) => [
    item.name,
    {
      cost: item.cost as Record<string, number>,
      prerequisites: item.prerequisites,
      description: item.description,
      display: item.display,
    },
  ])
);

const isUnlocked = (
  capitalType: string,
  tech: any,
  events: any,
  capital: Record<string, [number, boolean]>
) => {
  const data = capitalData.get(capitalType)!;

  return (
    data.prerequisites.tech.every(
      (prerequisite) => tech[prerequisite]?.unlocked
    ) &&
    Object.entries(data.prerequisites.capitalRequirements).every(
      ([key, value]) => {
        return capital[key][0] >= value!;
      }
    ) &&
    data.prerequisites.events.every(
      (prerequisite) => !!events[prerequisite]
    )
  );
};

const ResourceTooltip = (props: {
  resources: Record<string, number>;
  covered: boolean[];
}) => {
  return (
    <ul
      style={{
        marginBottom: "0px",
        listStyle: "none",
        marginLeft: "-27px",
        marginRight: "5px",
      }}
    >
      {Object.entries(props.resources).map(([key, value], index) => {
        return (
          <li key={key} style={{}}>
            {key}:{" "}
            <span style={props.covered[index] ? {} : { color: "red" }}>
              {" "}
              {-(value as number)}
            </span>
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
  return Object.entries(a).map(([key, value]) => {
    return b[key as string] && b[key as string]![0] + value >= 0;
  });
};

const CapitalItem = (props: {
  capitalType: string;
  multiplier: number;
  shown: boolean;
}) => {
  const resources = useSelector((state: RootState) => state.resources.values);
  const capital = useSelector((state: RootState) => state.capital.values);
  const tech = useSelector((state: RootState) => state.tech.values);
  const value = useSelector(
    (state: RootState) => state.capital.values[props.capitalType]
  );
  const dispatch = useDispatch();
  const deltaCapital: Partial<Record<string, number>> = {};
  deltaCapital[props.capitalType] = 1 * props.multiplier;
  const display = capitalData.get(props.capitalType)!.display;

  const deltaResource = useMemo(() => {
    const ret = structuredClone(
      capitalData.get(props.capitalType)?.cost as Record<string, number>
    );
    Object.entries(ret).forEach(([key, value]) => {
      ret[key as string] = -(value as number) * props.multiplier;
    });
    return ret;
  }, [props.capitalType, props.multiplier]);

  return (
    <>
      {props.shown ? (
        <Container>
          <Row>
            <Col>
              <span>
                <OverlayTrigger
                  placement="right"
                  trigger={
                    capitalData.get(props.capitalType)?.description
                      ? ["hover", "focus"]
                      : []
                  }
                  delay={{ show: 200, hide: 150 }}
                  overlay={
                    <Tooltip>
                      {capitalData.get(props.capitalType)?.description}
                    </Tooltip>
                  }
                >
                  <h6 style={{ marginTop: "10px", color: "white" }}>
                    <strong>
                      {display.name}: {value}
                    </strong>
                  </h6>
                </OverlayTrigger>
              </span>
            </Col>
            <Col>
              <OverlayTrigger
                placement="left"
                delay={{ show: 200, hide: 150 }}
                overlay={
                  <Tooltip>
                    <ResourceTooltip
                      resources={deltaResource}
                      covered={costCovered(deltaResource, resources)}
                    />
                  </Tooltip>
                }
              >
                <span>
                  <Button
                    disabled={
                      !Object.entries(
                        costCovered(deltaResource, resources)
                      ).every((x) => x[1])
                    }
                    className="air-button"
                    onClick={() => {
                      dispatch(capitalDelta(deltaCapital));
                      dispatch(resourceDelta(deltaResource));
                      dispatch(addNews(`${props.capitalType} bought`));
                    }}
                  >
                    {display.acquire}
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

export function Capital(props: { modifiers: Modifiers }) {
  const tech = useSelector((state: RootState) => state.tech.values);
  const capital = useSelector((state: RootState) => state.capital.values);
  const events = useSelector((state: RootState) => state.gameState.completedEvents);
  const [multiplier, setMultiplier] = useState(
    multiplierFromModifiers(props.modifiers)
  );
  useEffect(() => {
    setMultiplier(multiplierFromModifiers(props.modifiers));
  }, [props.modifiers]);

  const unlocked = useMemo(() => {
    return Array.from(capitalData.keys()).map((capitalType) => [
      capitalType,
      isUnlocked(capitalType, tech, events, capital),
    ]);
  }, [tech, capital, events]);

  return (
    <>
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
          <div style={{ width: "100%", height: "8px"}} />
          <div
            className="text-center"
            style={{ width: "100%", color: "white" }}
          >
            <h5>
              Unlocked:{" "}
              {unlocked.reduce((acm, [, shown]) => acm + (shown ? 1 : 0), 0)} /{" "}
              {capitalRaw.length}
            </h5>
          </div>
          {unlocked.map(([capitalType, shown]) => {
            return (
              <CapitalItem
                key={capitalType as string}
                capitalType={capitalType as string}
                multiplier={multiplier}
                shown={shown as boolean}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
