import React from "react";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailCheckbox: React.FC<CheckboxProps> = ({ id, checked, onChange }) => {
  return (
    <div className="relative w-[1.25vw] h-[1.25vw] bg-[#ffffff] border-[0.05vw] border-[#e0e0e9] rounded-[0.4vw]">
      <input
        id={id}
        className="w-full h-full cursor-pointer appearance-none outline-none checked:after:content-[''] checked:after:w-[0.78vw] checked:after:h-[0.78vw] checked:after:rounded-[0.2vw] checked:after:bg-[#282833] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
    </div>
  );
};

export default EmailCheckbox;