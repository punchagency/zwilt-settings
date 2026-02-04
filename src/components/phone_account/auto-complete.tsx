import React, { useEffect, useState } from "react";
import Autosuggest, {
  ChangeEvent,
  SuggestionsFetchRequestedParams,
} from "react-autosuggest";
import { CityOption } from "./AddPhoneModal";

const cities: any[] = [];

const getSuggestions = (value: string) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : cities.filter(
        (city) =>
          city.areaCode.toLowerCase().includes(inputValue) ||
          city.city.toLowerCase().includes(inputValue) ||
          city.state.toLowerCase().includes(inputValue)
      );
};

const getSuggestionValue = (suggestion: any) => suggestion.areaCode;

const renderSuggestion = (suggestion: any) => (
  <div className="flex justify-between">
    <span>{suggestion.areaCode}</span>
    <span className="text-gray-500">{`${suggestion.city}, ${suggestion.state}`}</span>
  </div>
);

type AutoCompleteProps = {
  defaultValue: string;
  onValueChange: (value: string) => void;
};

const AutoComplete: React.FC<AutoCompleteProps> = ({
  defaultValue,
  onValueChange,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onChange = (
    event: React.FormEvent<HTMLElement>,
    { newValue }: ChangeEvent
  ) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  const onSuggestionsFetchRequested = ({
    value,
  }: SuggestionsFetchRequestedParams) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: "Enter Area Code",
    value,
    onChange,
  };

  return (
    <div className="flex flex-col items-start">
      <label className="text-[#282833] text-sm font-medium mb-2">
        Enter Area Code
      </label>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={{
          container: "relative w-full rounded-lg",
          input:
            "border border-gray-300 rounded-lg w-full py-2 px-4 outline-none focus:ring-0 focus:ring-gray-300",
          suggestionsContainer:
            "absolute z-10 w-full bg-white shadow-lg rounded-lg mt-1",
          suggestion: "px-4 py-2 cursor-pointer",
          suggestionHighlighted: "bg-gray-200",
        }}
      />
    </div>
  );
};

export default AutoComplete;
