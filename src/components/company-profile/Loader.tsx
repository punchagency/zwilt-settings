import React from "react";

const loaderStyle: React.CSSProperties = {
  borderBottom: "0.2vw solid rgba(255, 255, 255, 0.5)",
  borderLeft: "0.2vw solid rgba(255, 255, 255, 0.5)",
  borderRight: "0.2vw solid rgba(255, 255, 255, 0.5)",
  borderTop: "0.2vw solid #ffffff",
  borderRadius: "100%",
  height: "1.5vw",
  width: "1.5vw",
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
    <div className="flex items-center justify-center w-full">
      <style>{keyframes}</style>
      <div style={loaderStyle}></div>
    </div>
  );
};

export default Loader;
