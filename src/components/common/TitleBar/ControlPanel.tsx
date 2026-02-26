import { styled, MenuItem, Select } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";

interface DropdownData {
  defaultValue: string;
  data: Array<{
    value: string;
    label: string;
  }>;
  setValue?: (value: number) => void;
  hideValue?: boolean;
}

interface ActionButtonProps {
  actionBtnFunc?: () => void;
  actionBtnText?: string;
  actionBtnIcon?: React.ReactNode;
  actionBtnStyle?: "primary" | "secondary";
}

interface SearchBoxProps {
  placeholder?: string;
  searchBoxFunc?: (value: string) => void;
}

interface LocationFilterProps {
  value: string;
  options: Array<{ id: string; value: string; label: string }>;
  onChange: (value: string) => void;
}

interface ControlPanelProps {
  actionBtns?: Array<ActionButtonProps>;
  dropdownData?: DropdownData;
  searchBox?: SearchBoxProps;
  dateRangePicker?: React.ReactElement;
  rightSide?: React.ReactElement;
  locationFilter?: React.ReactElement;
}

const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void,
) => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback, handleClick]);
};

function Dropdown({ data, defaultValue, setValue, hideValue }: DropdownData) {
  const [open, setOpen] = useState(false);

  const getInitialIndex = () => {
    if (defaultValue && data) {
      const index = data.findIndex((item) => item.value === defaultValue);
      return index >= 0 ? index : 0;
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex());
  const [dropdownValue, setDropdownValue] = useState(data[getInitialIndex()]!);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => {
    setOpen(false);
  });

  const handleItemClick = (itemValue: number) => {
    setOpen(false);
    setValue!(itemValue);
    setDropdownValue(data[itemValue]);
    setCurrentIndex(itemValue);
  };

  useEffect(() => {
    if (data) {
      setDropdownValue(data[currentIndex]!);
    }
  }, [currentIndex, data]);

  // Update dropdown when defaultValue changes
  useEffect(() => {
    if (defaultValue && data) {
      const index = data.findIndex((item) => item.value === defaultValue);
      if (index >= 0 && index !== currentIndex) {
        setCurrentIndex(index);
        setDropdownValue(data[index]!);
      }
    }
  }, [defaultValue, data, currentIndex]);

  return (
    <DropdownWrapper ref={dropdownRef} selectedLabel={dropdownValue.label}>
      <div className="dropdown" onClick={() => setOpen(!open)}>
        <div className="dropdown__content">
          <span className="dropdown__content__label">
            {dropdownValue.label}
          </span>
        </div>
        <div className="dropdown__icon">
          <KeyboardArrowDownIcon
            sx={{ fontSize: "1.2rem", color: "#6F6F76" }}
          />
        </div>
      </div>
      {open && (
        <DropdownSlider selectedLabel={dropdownValue.label}>
          {data?.map((item, index) => (
            <DropdownItem
              key={item.value}
              onClick={() => handleItemClick(index)}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownSlider>
      )}
    </DropdownWrapper>
  );
}

function ActionButton({
  actionBtnFunc,
  actionBtnText,
  actionBtnIcon,
  actionBtnStyle,
}: ActionButtonProps) {
  return (
    <ActionButtonWrapper>
      <button
        className={`btn btn-${actionBtnStyle || "primary"}`}
        onClick={actionBtnFunc}
      >
        {actionBtnIcon && actionBtnIcon}
        {actionBtnText}
      </button>
    </ActionButtonWrapper>
  );
}

function SearchBox({ placeholder, searchBoxFunc }: SearchBoxProps) {
  const [searchValue, setSearchValue] = useState("");
  const debounceTime = 500;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchBoxFunc?.(searchValue);
    }, debounceTime);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue, searchBoxFunc, debounceTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  return (
    <SearchBoxWrapper>
      <SearchBoxInput
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
      />
      <SearchIcon sx={{ color: "#6F6F76", fontSize: "1.5rem" }} />
    </SearchBoxWrapper>
  );
}

function ControlPanel({
  actionBtns,
  dropdownData,
  searchBox,
  dateRangePicker,
  rightSide,
  locationFilter,
}: ControlPanelProps) {
  return (
    <ControlPanelWrapper>
      <div className="control-panel__left">
        {dropdownData && <Dropdown {...dropdownData} />}
        {locationFilter}
        {searchBox && <SearchBox {...searchBox} />}
        {dateRangePicker}
      </div>
      <div className="control-panel__right">
        {actionBtns &&
          actionBtns.map((actionBtn, index) => (
            <ActionButton key={index} {...actionBtn} />
          ))}
        {rightSide}
      </div>
    </ControlPanelWrapper>
  );
}

export default ControlPanel;

const SearchBoxInput = styled("input")`
  flex: 1;
  margin-left: 8px;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.25rem;

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.9rem;
    margin-left: 6px;
    line-height: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-left: 4px;
    line-height: 1rem;
  }

  &::placeholder {
    @media (max-width: 1024px) and (min-width: 769px) {
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
`;

const DropdownWrapper = styled("div")<{ selectedLabel?: string }>`
  position: relative;
  height: 3.375rem;
  width: auto;
  min-width: ${(props) =>
    props.selectedLabel === "Only Me" ? "140px" : "150px"};
  max-width: ${(props) =>
    props.selectedLabel === "Only Me" ? "160px" : "170px"};

  @media (max-width: 1024px) and (min-width: 769px) {
    height: 2.8rem;
    width: auto;
    min-width: ${(props) =>
      props.selectedLabel === "Only Me" ? "130px" : "140px"};
    max-width: ${(props) =>
      props.selectedLabel === "Only Me" ? "150px" : "160px"};
  }

  @media (max-width: 768px) {
    height: 2.2rem;
    width: auto;
    min-width: ${(props) =>
      props.selectedLabel === "Only Me" ? "120px" : "130px"};
    max-width: ${(props) =>
      props.selectedLabel === "Only Me" ? "140px" : "150px"};
  }

  > .dropdown {
    display: flex;
    padding: 0.9rem 1.3rem;
    align-items: center;
    gap: 0.625rem;
    border-radius: 0.9rem;
    border: 1px solid #c1c7ca;
    background: #fff;
    cursor: pointer;
    justify-content: center;

    @media (max-width: 1024px) and (min-width: 769px) {
      padding: 0.7rem 1rem;
      gap: 0.4rem;
      border-radius: 0.7rem;
      height: 2.8rem;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      padding: 0.3rem 0.5rem;
      gap: 0.2rem;
      border-radius: 0.4rem;
      height: 2.2rem;
      font-size: 0.7rem;
      white-space: nowrap;
    }

    > .dropdown__icon {
      > img {
        width: 0.6rem;
        height: 0.6rem;

        @media (max-width: 1024px) and (min-width: 769px) {
          width: 0.5rem;
          height: 0.5rem;
        }

        @media (max-width: 768px) {
          width: 0.4rem;
          height: 0.4rem;
        }
      }
    }

    > .dropdown__content {
      display: flex;
      flex-direction: row;
      gap: 0.6rem;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.25rem;

      @media (max-width: 1024px) and (min-width: 769px) {
        font-size: 0.85rem;
        line-height: 1.1rem;
        gap: 0.4rem;
      }

      @media (max-width: 768px) {
        font-size: 0.7rem;
        line-height: 0.9rem;
        gap: 0.2rem;
        font-weight: 500;
      }

      > .dropdown__content__label {
        @media (max-width: 1024px) and (min-width: 769px) {
          font-size: 0.85rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          font-size: 0.7rem;
          font-weight: 500;
        }
      }

      > .dropdown__content__value {
        @media (max-width: 1024px) and (min-width: 769px) {
          font-size: 0.85rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          font-size: 0.7rem;
          font-weight: 500;
        }
      }
    }
  }
`;

const DropdownSlider = styled("div")<{ selectedLabel?: string }>`
  position: absolute;
  top: 100%;
  left: 5%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: ${(props) =>
    props.selectedLabel === "Only Me" ? "125px" : "140px"};
  width: ${(props) => (props.selectedLabel === "Only Me" ? "130px" : "150px")};
  z-index: 1;
  display: block !important;

  @media (max-width: 1024px) and (min-width: 769px) {
    min-width: ${(props) =>
      props.selectedLabel === "Only Me" ? "115px" : "130px"};
    width: ${(props) =>
      props.selectedLabel === "Only Me" ? "125px" : "145px"};
    border-radius: 3.5px;
  }

  @media (max-width: 768px) {
    min-width: ${(props) =>
      props.selectedLabel === "Only Me" ? "100px" : "120px"};
    width: ${(props) =>
      props.selectedLabel === "Only Me" ? "120px" : "140px"};
    border-radius: 3px;
  }
`;

const DropdownItem = styled("div")`
  padding: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25rem;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 6px 8px;
    font-size: 0.85rem;
    font-weight: 500;
    line-height: 1.1rem;
  }

  @media (max-width: 768px) {
    padding: 4px 6px;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const SearchBoxWrapper = styled("div")`
  height: 3.375rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  background-color: #fff;
  padding: 0.9rem 1.8rem;
  border: 1px solid #c1c7ca;
  border-radius: 0.9rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.25rem;
  min-width: 200px;
  flex: 1;
  max-width: 400px;

  @media (max-width: 1024px) and (min-width: 769px) {
    height: 2.8rem;
    padding: 0.7rem 1.2rem;
    border-radius: 0.7rem;
    font-size: 0.9rem;
    min-width: 180px;
    max-width: 300px;
    gap: 0.4rem;
  }

  @media (max-width: 768px) {
    height: 2.2rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    font-size: 0.8rem;
    min-width: auto;
    max-width: none;
    flex: 1;
  }

  > img {
    width: 0.9rem;
    height: 1.1rem;

    @media (max-width: 1024px) and (min-width: 769px) {
      width: 0.8rem;
      height: 1rem;
    }

    @media (max-width: 768px) {
      width: 0.7rem;
      height: 0.9rem;
    }
  }
`;

const ActionButtonWrapper = styled("div")`
  height: 3.375rem;
  > .btn {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 0.9rem;
    border: 1px solid #50589f;
    padding: 0.6rem 1rem;
    cursor: pointer;
    height: 3.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
    white-space: nowrap;
    transition: all 0.2s ease;

    /* Shadow/xs */
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);

    @media (max-width: 1024px) and (min-width: 769px) {
      height: 2.8rem;
      padding: 0.5rem 0.9rem;
      border-radius: 0.7rem;
      font-size: 0.8rem;
      gap: 8px;
      line-height: 1.1rem;
    }

    @media (max-width: 768px) {
      height: 2.2rem;
      padding: 0.3rem 0.6rem;
      border-radius: 0.4rem;
      font-size: 0.7rem;
      gap: 6px;
      line-height: 1rem;
    }

    > img {
      @media (max-width: 1024px) and (min-width: 769px) {
        width: 16px;
        height: 16px;
      }

      @media (max-width: 768px) {
        width: 14px;
        height: 14px;
      }
    }
  }

  > .btn-primary {
    background: #50589f;
    color: white;

    &:hover {
      background: #40478f;
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      &:hover {
        background: #50589f;
      }
    }
  }

  > .btn-secondary {
    background: #ced3ff;
    border: 1px solid #ced3ff;
    color: #50589f;

    &:hover {
      background: #b8c0ff;
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      &:hover {
        background: #ced3ff;
      }
    }
  }
`;

const ControlPanelWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin: 1rem 0;
  width: 100%;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 0.8rem 0;
    margin: 0.8rem 0;
    gap: 0.8rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
    margin: 0.5rem 0;
    width: 100%;
  }

  @media (max-width: 379px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    margin: 0.25rem 0;
  }

  > .control-panel__left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    flex: 1;
    min-width: 0;

    @media (max-width: 1024px) and (min-width: 769px) {
      gap: 0.6rem;
      flex: 1;
      min-width: 0;
    }

    @media (max-width: 768px) {
      gap: 0.3rem;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    @media (max-width: 379px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      width: 100%;
    }
  }

  > .control-panel__right {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
    flex-shrink: 0;

    @media (max-width: 1024px) and (min-width: 769px) {
      gap: 0.6rem;
      margin-left: 0;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 0.75rem;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    @media (max-width: 379px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      margin-left: 0;
      width: 100%;
    }
  }
`;
