import React from "react";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onChange, disabled = false }) => {
  return (
    <div className={`relative w-[1.25vw] h-[1.25vw] bg-[#ffffff] border-[0.05vw] border-[#e0e0e9] rounded-[0.4vw] ${disabled ? 'opacity-50' : ''}`}>
      <input
        id={id}
        className={`w-full h-full appearance-none outline-none checked:after:content-[''] checked:after:w-[0.78vw] checked:after:h-[0.78vw] checked:after:rounded-[0.2vw] checked:after:bg-[#282833] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
    </div>
  );
};

export default Checkbox;
