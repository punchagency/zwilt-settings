import React, { useEffect, useRef , useState } from 'react';
import { useFormik } from 'formik';

// Define the form values type
interface FormValues {
  questionDelay: string;
}

// Custom Dropdown Component
type Option = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleOptionClick = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`custom-dropdown relative ${className}`}>
      <div className="dropdown-button cursor-pointer flex justify-between items-center p-2" onClick={handleToggle}>
        <span>{selectedValue || 'Select option'}</span>
        <span className="dropdown-indicator">
          {isOpen ? (
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#282833" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 5L5 1L9 5" stroke="#282833" strokeWidth="2" />
            </svg>
          )}
        </span>
      </div>

      {isOpen && (
        <div className="dropdown-content absolute w-full bg-white border border-gray-300 z-10">
          {options.map(option => (
            <div
              key={option.value}
              className="dropdown-option p-2 hover:bg-gray-100 cursor-pointer"
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

// Example usage of the component
const MyComponent = () => {
  const [initialValues, setInitialValues] = useState<FormValues>({ questionDelay: '' });

  useEffect(() => {
    // Check if we are in the browser
    const savedValue = typeof window !== 'undefined' ? localStorage.getItem('questionDelay') : '';
    setInitialValues({ questionDelay: savedValue || '' });
  }, []);

  const formik = useFormik<FormValues>({
    initialValues,
    onSubmit: values => {
      // Save the value to local storage on submission
      localStorage.setItem('questionDelay', values.questionDelay);
      console.log(values);
      alert('Form submitted successfully!'); // Optional success message
    },
  });

  const handleDropdownSelect = (value: string) => {
    formik.setFieldValue('questionDelay', value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Custom Dropdown */}
      <div className="ml-24">
        <CustomDropdown
          options={[
            { value: '', label: 'Select option' },
            { value: '0', label: 'No Delay' },
            { value: '1', label: '1 second' },
            { value: '2', label: '2 seconds' },
            { value: '3', label: '3 seconds' },
            { value: '4', label: '4 seconds' },
            { value: '5', label: '5 seconds' },
          ]}
          selectedValue={formik.values.questionDelay}
          onSelect={handleDropdownSelect}
          className="mr-[30.8vw] h-[2.552vw] text-[#8C8C8C] text-[0.833vw] -mt-[4.75vw] mx-auto"
        />
      </div>
      <button type="submit" className="mt-4">Submit</button>
    </form>
  );
};

export default MyComponent;
