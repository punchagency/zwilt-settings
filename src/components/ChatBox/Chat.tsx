import { calculatePxToPercentage } from './styled';

const ChatIcon = ({ isHovered }:any) => (
  <svg
    width={calculatePxToPercentage(30)}
    height={calculatePxToPercentage(30)}
    viewBox="0 0 30 30"
    fill={'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.2109 25.8565L17.2109 21.0312"
      stroke="#323232"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2172 21.0547V25.8547"
      stroke="#323232"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2156 21.0578H10.0156C6.70243 21.0578 4.01562 18.371 4.01562 15.0578V10.2578C4.01562 6.94461 6.70243 4.25781 10.0156 4.25781H19.6156C22.9288 4.25781 25.6156 6.94461 25.6156 10.2578V15.0578C25.6156 18.371 22.9288 21.0578 19.6156 21.0578H17.2156"
      stroke="#323232"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default ChatIcon;
