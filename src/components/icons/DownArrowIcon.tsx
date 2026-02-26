import * as React from "react";
import { SVGProps } from "react";

interface GroupByIconProps extends SVGProps<SVGSVGElement> {
  strokeColorType?: string;
}

const DownArrowIcon: React.FC<GroupByIconProps> = ({
  strokeColorType,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={6}
    fill="none"
    {...props}
  >
    <path
      fill={strokeColorType ? strokeColorType : "#000"}
      d="M5 6 .759 1.759 2.173.344 5 3.173 7.829.343l1.415 1.415L5 6Z"
    />
  </svg>
);
export default DownArrowIcon;
