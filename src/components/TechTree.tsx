import React, { useState, useEffect } from "react";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { unlockTech } from "../redux/techSlice";
import { DefaultNode, Graph } from "@visx/network";
import {
  useTooltip,
  useTooltipInPortal,
  TooltipWithBounds,
} from "@visx/tooltip";
import { localPoint } from '@visx/event';

import tech from "../tech.json";

export type NetworkProps = {
  width: number;
  height: number;
};

interface CustomNode {
  x: number;
  y: number;
  color?: string;
}

interface CustomLink {
  source: CustomNode;
  target: CustomNode;
  dashed?: boolean;
}

const nodes: CustomNode[] = [
  { x: 50, y: 20, color: "#26deb0" },
  { x: 200, y: 250, color: "#26deb0" },
  { x: 300, y: 40, color: "#26deb0" },
  { x: 100, y: 40, color: "#26deb0" },
];

const links: CustomLink[] = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0], dashed: true },
];

const graph = {
  nodes,
  links,
};

export function TechTree() {
  // const createNode = (x: number, y: number) => {
  //   const color = randomColor();
  //   setState(({ graph: { nodes, edges }, counter, ...rest }) => {
  //     const id = counter + 1;
  //     const from = Math.floor(Math.random() * (counter - 1)) + 1;
  //     return {
  //       graph: {
  //         nodes: [...nodes, { id, label: `Node ${id}`, color, x, y }],
  //         edges: [...edges, { from, to: id }],
  //       },
  //       counter: id,
  //       ...rest,
  //     };
  //   });
  // };
  // const [state, setState] = useState({
  //   counter: 5,
  //   graph: {
  //     nodes: [
  //       { id: 1, label: "Node 1", color: "#e04141" },
  //       { id: 2, label: "Node 2", color: "#e09c41" },
  //       { id: 3, label: "Node 3", color: "#e0df41" },
  //       { id: 4, label: "Node 4", color: "#7be041" },
  //       { id: 5, label: "Node 5", color: "#41e0c9" },
  //     ],
  //     edges: [
  //       { from: 1, to: 2 },
  //       { from: 1, to: 3 },
  //       { from: 2, to: 4 },
  //       { from: 2, to: 5 },
  //     ],
  //   },
  //   events: {
  //     select: ({ nodes, edges }: { nodes: any; edges: any }) => {
  //       console.log("Selected nodes:");
  //       console.log(nodes);
  //       console.log("Selected edges:");
  //       console.log(edges);
  //       alert("Selected node: " + nodes);
  //     },
  //     doubleClick: ({ pointer: { canvas } }: { pointer: any }) => {
  //       createNode(canvas.x, canvas.y);
  //     },
  //   },
  // });
  // const { graph, events } = state;
  // const graph = useSelector((state: RootState) => state.tech.graph);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(unlockTech("Fusion"));
  }, []);

  console.log(graph);

  useEffect(() => {
    console.log(graph);
  }, [graph]);

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

  const handleMouseOver = (event: any) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords!.x,
      tooltipTop: coords!.y,
      tooltipData: "Hello",
    });
    console.log("Here");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      hideTooltip();
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 className="text-center">Tech Tree</h3>
      <svg width={640} height={480} ref={containerRef}>
        <rect width={640} height={480} rx={14} fill={"#272b4d"} />
        <Graph<CustomLink, CustomNode>
          graph={graph}
          top={20}
          left={100}
          nodeComponent={({ node: { color } }) =>
            color ? <DefaultNode fill={color} onMouseOver={handleMouseOver}
            onMouseLeave={hideTooltip} /> : <DefaultNode />
          }
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
          Data value <strong>{"tooltipData"}</strong>
        </TooltipInPortal>
      )}
    </div>
  );
}
