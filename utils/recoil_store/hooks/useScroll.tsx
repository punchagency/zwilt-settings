
import { useEffect } from "react";

const useSlimScrollbar = () => {
  useEffect(() => {
    const handleMouseEnter = () => {
      document.documentElement.classList.add("slim-scrollbar");
    };
    const handleMouseLeave = () => {
      document.documentElement.classList.remove("slim-scrollbar");
    };
    const handleMouseDown = () => {
      document.documentElement.classList.add("slim-scrollbar");
    };
    const handleMouseUp = () => {
      document.documentElement.classList.remove("slim-scrollbar");
    };

    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mousedown", handleMouseDown);
    document.documentElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      document.documentElement.removeEventListener(
        "mousedown",
        handleMouseDown
      );
      document.documentElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
};

export default useSlimScrollbar;
