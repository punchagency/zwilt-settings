import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

interface CustomDropdownProps {
  options: { value: string; label: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options = [],
  selectedValue,
  onSelect,
  defaultValue = '',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (value: string) => {
    onSelect(value);
    setInternalValue(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target && !target.closest('.custom-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const selectedOptionLabel = internalValue || 'Select option';

  return (
    <div className={`custom-dropdown w-[9.948vw] h-[2.552vw] rounded-[0.781vw] border-[1px] border-gray-300 bg-[#ffffff] relative ${className}`}>
      <div className="dropdown-button h-[2.552vw] mt-[0.6vw] text-[0.833vw] text-left" onClick={handleToggle}>
        <span className="dropdown-text ml-[0.5vw] mt-[0.5vw]">{selectedOptionLabel}</span>
        <span className="dropdown-indicator">
          {isOpen ? (
            <svg className="ml-[8vw] -mt-[0.7vw]" height="0.41vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.8047 6.90137L6.90347 1.00015L1.00226 6.90137" stroke="#282833" strokeWidth="1.96707" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="ml-[8vw] -mt-[0.7vw]" width="0.72vw" height="0.41vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6.90121 6.90121L12.8024 1" stroke="#282833" strokeWidth="1.96707" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>

      {isOpen && (
        <div className="dropdown-content w-[12vw]  mt-[0.5vw] bg-white border rounded-[0.78vw] shadow-custom3 z-10 p-2 absolute top-[100%] left-0 overflow-y-auto">
          {options.map(option => (
            <div
              key={option.value}
              className="dropdown-option h-[2.5vw] flex items-center hover:bg-[#F4F4FA] font-normal px-[0.5vw] rounded-[0.78vw]"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
