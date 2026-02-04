import React, { useState, useEffect } from 'react';

interface CustomDropdownProps {
  name: string; // New prop for the name
  options: { value: string; label: string }[];
  selectedValue: string | number;
  onSelect: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  name,
  options = [],
  selectedValue,
  onSelect,
  defaultValue = '',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<any>(defaultValue);

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

  const formatSelectedOption = (value: string) => {
    return value || 'Select option';
  };

  const selectedOptionLabel = formatSelectedOption(selectedValue || internalValue);

  return (
    <div className={`custom-dropdown relative ${className}`}>
      <div
        className="dropdown-button border border-[#e0e0e9] rounded-[10px] h-[2.55vw] flex items-center justify-between p-2 bg-[#ffffff] text-[#282833] font-medium text-[0.83vw]"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-labelledby={name}
      >
        <span className="text-[#282833B2] text-[0.83vw] leading-[1.25vw] ml-[0.75vw]">
          {selectedOptionLabel}
        </span>
        <span className="ml-2">
          {isOpen ? (
            <svg className="w-[0.72vw] h-[0.41vw]" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.8047 6.90137L6.90347 1.00015L1.00226 6.90137" stroke="#282833" strokeWidth="1.96707" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="w-[0.72vw] h-[0.41vw]" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6.90121 6.90121L12.8024 1" stroke="#282833" strokeWidth="1.96707" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-content w-full absolute top-[100%] left-0 mt-1 bg-white border border-gray-300 rounded shadow-custom3 z-10">
          {options.map(option => (
            <div
              key={option.value}
              className="dropdown-option px-[0.5vw] py-[0.5vw] hover:bg-[#F4F4FA] cursor-pointer text-[#282833B2] text-[0.83vw] font-normal"
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
