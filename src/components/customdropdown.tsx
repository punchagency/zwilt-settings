import React, { useState, useEffect } from 'react';

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

  const formatSelectedOption = (value: string) => {
    const mappings: { [key: string]: string } = {
      'may-2024': 'Billing Period : May 2024',
      'april-2024': 'Billing Period : April 2024',
      'march-2024': 'Billing Period : March 2024',
    };

    if (mappings[value]) {
      return mappings[value];
    }

    const dateMatch = /(\d{1,2})-(\d{4})/.exec(value);
    if (dateMatch) {
      const [_, day, year] = dateMatch;
      if (parseInt(day) >= 1 && parseInt(day) <= 31) {
        return `Billing Period : ${new Date(`${year}-${parseInt(day)}`).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
      }
    }

    return 'Billing Period : Select a period';
  };

  const selectedOptionLabel = formatSelectedOption(selectedValue || internalValue);

  return (
    <div className={`custom-dropdown w-[16.66vw] h-[2.55vw] rounded-[15px] border-[0.98px] border-[#e0e0e9] bg-[#ffffff] font-medium text-[#282833] relative ${className}`}>
      <div   className="dropdown-button w-[16.66vw] h-[2.55vw] text-[0.83vw] text-left leading-[1.25vw]"   onClick={handleToggle}>
        <span className="dropdown-text grid mt-[0.6vw] ml-[0.75vw] font-medium text-[0.83vw]">{selectedOptionLabel}</span>
        <span className="dropdown-indicator">
          {isOpen ? (
            <svg className="ml-[15.25vw] -mt-[0.7vw]" height="0.41vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.8047 6.90137L6.90347 1.00015L1.00226 6.90137" stroke="#282833" strokeWidth="1.96707" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="ml-[15.25vw] -mt-[0.7vw]" width="0.72vw" height="0.41vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6.90121 6.90121L12.8024 1" stroke="#282833" strokeWidth="1.96707" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-content w-[16.66vw] h-[8.85vw] text-[0.83vw] text-[#282833B2] mt-[0.5vw] bg-white grid border rounded-[0.78vw] shadow-custom3 z-10 p-2 absolute top-[100%] left-0">
          {options.map(option => (
            <div
              key={option.value}
              className="dropdown-option w-[15.7vw] h-[2.60vw] flex px-[0.5vw] rounded-[0.78vw] items-center hover:bg-[#F4F4FA] font-normal"
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
