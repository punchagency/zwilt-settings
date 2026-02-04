import React from "react";
import { ClipLoader } from "react-spinners";

const loaderStyle: React.CSSProperties = {
  // width: "48px",
  // height: "48px",
  // border: "5px dotted #50589F",
  // borderRadius: "50%",
  // display: "inline-block",
  // position: "relative",
  // boxSizing: "border-box",
  // animation: "rotation 2s linear infinite",

  borderBottom: "4px solid rgba(255, 255, 255, 0.5)",
  borderLeft: "4px solid rgba(255, 255, 255, 0.5)",
  borderRight: "4px solid rgba(255, 255, 255, 0.5)",
  borderTop: "4px solid #ffffff",
  borderRadius: "100%",
  height: "32px",
  width: "32px",
  animation: "spin .6s infinite linear",
  textIndent: "999em",
  margin: "3em auto",
};

const Loader: React.FC = () => {
  const keyframes = `


@keyframes spin {
	from {transform: rotate(0deg);}
	to {transform: rotate(359deg);}
}
  `;

  return (
    <div className="flex items-center justify-center w-full min-h-[50vh]">
      {/* <style>{keyframes}</style>
      <div style={loaderStyle}></div> */}

      <ClipLoader color="#282833" size={"5vh"} />
    </div>
  );
};

export default Loader;

// @keyframes rotation {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }
