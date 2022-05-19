import React from "react";
import { ResourcesDisplay } from "./ResourcesDisplay";

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
        className="no-scrollbars"
      >
        <div
          style={{
            borderRadius: "14px",
            background: "#272b4d",
            height: "1024px",
            width: "100%",
          }}
        ></div>
      </div>
    </>
  );
}
