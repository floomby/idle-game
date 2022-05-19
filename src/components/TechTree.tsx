import React, { useState, useEffect, useRef } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { unlockTech, initTech, applyProgress } from "../redux/techSlice";
import { DefaultNode, Graph } from "@visx/network";
import {
  useTooltip,
  useTooltipInPortal,
  TooltipWithBounds,
} from "@visx/tooltip";
import { localPoint } from "@visx/event";
// import { Annotation, CircleSubject, Connector, Label } from "@visx/annotation";
import tinycolor from "tinycolor2";

import tech from "../tech.json";

export type NetworkProps = {
  width: number;
  height: number;
};

interface CustomNode {
  name: string;
  x: number;
  y: number;
  color?: string;
  description: string;
  completed: boolean;
  progress: number;
}

interface CustomLink {
  source: CustomNode;
  target: CustomNode;
  dashed?: boolean;
}

export function TechTree() {
  const graph = useSelector((state: RootState) => state.tech.graph);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initTech());
  }, [dispatch]);

  // console.log(graph);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  // If you don't want to use a Portal, simply replace `TooltipInPortal` below with
  // `Tooltip` or `TooltipWithBounds` and remove `containerRef`
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // use TooltipWithBounds
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  });

  const deflicker = useRef([false, false]);
  let deflickerIndex = useRef(0);
  const handleMouseOver = (event: any, description: string) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    // console.log(event.target.ownerSVGElement);
    showTooltip({
      tooltipLeft: coords!.x,
      tooltipTop: coords!.y,
      tooltipData: description,
    });
    deflicker.current[0] = deflicker.current[1] = true;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!deflicker.current[0] && !deflicker.current[1]) hideTooltip();
      deflickerIndex.current = (deflickerIndex.current + 1) % 2;
      deflicker.current[deflickerIndex.current] = false;
    }, 100);
    return () => clearInterval(interval);
  }, [hideTooltip]);

  return (
    <div>
      <h3 className="text-center">Tech Tree</h3>
      <div
        style={{
          // width: "50vw",
          height: "50vh",
          overflowY: "scroll",
          overflowX: "scroll",
          margin: "0",
        }}
        className="unselectable-text no-scrollbars"
      >
        <svg width={1000} height={480} ref={containerRef}>
          <rect width={1000} height={480} rx={14} fill={"#272b4d"} />
          <Graph<CustomLink, CustomNode>
            graph={graph}
            top={50}
            left={50}
            nodeComponent={({ node: { color, name, x, y, description, completed, progress } }) => (
              <>
                <DefaultNode
                  fill={tinycolor(color || "#21D4FD").darken(40 * progress).toString()}
                  onMouseOver={(event: any) =>
                    handleMouseOver(event, description)
                  }
                  onMouseOut={hideTooltip}
                  onMouseDown={() => {
                    dispatch(applyProgress({ tech: name, progress: 1 }));
                  }}
                />
                <text
                  x={0}
                  y={0}
                  fill={ completed ? "green" : "black" }
                  onMouseDown={() => dispatch(applyProgress({ tech: name, progress: 1 }))}
                >
                  {name}
                </text>
              </>
            )}
            linkComponent={({ link: { source, target, dashed } }) => (
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                strokeWidth={2}
                stroke="#999"
                strokeOpacity={0.6}
                strokeDasharray={dashed ? "8,4" : undefined}
              />
            )}
          />
        </svg>
        {tooltipOpen && (
          <TooltipInPortal
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            <div style={{ width: "20vw" }}>
              {tooltipData as string}
            </div>
          </TooltipInPortal>
        )}
      </div>
    </div>
  );
}
