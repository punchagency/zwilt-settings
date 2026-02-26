import React, { useEffect } from "react";
import { styled } from "@mui/material";
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import palettes from "@/constants/palettes";
// import arrowImage from "@/assets/icons/dropdown-arrow.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Divider, Popover, TextField } from "@mui/material";
import TimePickerViews from "./sub-component/TimeSelector";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimeSelector from "./sub-component/TimeSelector";
import CustomDateSelector from "./sub-component/CustomDateSelector";

type InputProps = {
  placeholder?: string;
  label?: string;
  type?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  value?: string;
  error?: string;
  styles?: {};
  labelStyle?: {};
  required?: boolean;
  inputLabel?: string;
  disabled?: boolean;
  options?: TOption[];
  customSelectOptions?: any;
  isSelected?: boolean;
  children?: any;
};

type TOption = { label: string; value: string };

const Input = ({
  placeholder,
  label,
  type,
  onChange,
  children,
  onBlur,
  value,
  options,
  error,
  required,
  disabled,
  styles,
  labelStyle,
  inputLabel,
  isSelected,
  customSelectOptions,
}: InputProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCustomSelectChange = (value: string) => {
    setSelectedValue(value);
    setIsDropdownOpen(false);
    onChange && onChange({ target: { value } });
  };

  useEffect(() => {
    if (value !== undefined && value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value, selectedValue]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClose = (event: React.MouseEvent<Document>) => {
    // Check if the click occurred outside the popover content
    if (anchorEl && !anchorEl.contains(event.target as Node)) {
      setAnchorEl(null);
      setIsDropdownOpen(false);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <InputContainer>
      {label && (
        <InputLabel style={{ ...labelStyle }}>
          <span>
            {label} {required && <Mandatory>*</Mandatory>}
          </span>
          {error?.length ? <Required>{error}</Required> : ""}
        </InputLabel>
      )}
      <InputDiv>
        {(type === "input" || !type) && (
          <InputFieldsContainer>
            {inputLabel && <InputFieldItem>{inputLabel}</InputFieldItem>}
            <InputField
              disabled={disabled}
              style={{
                padding: inputLabel ? "0.75rem 4rem" : "0.75rem 0.875rem",
              }}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder ? placeholder : "Enter name"}
            />
          </InputFieldsContainer>
        )}
        {type === "select" && (
          <SelectField
            disabled={disabled}
            value={value?.length ? value : "default"}
            onBlur={onBlur}
            onChange={onChange}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23344054' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              ...styles,
            }}
          >
            <option value="default" disabled selected>
              Select an option
            </option>
            {options?.map((data) => (
              <option key={data?.value} value={data?.value}>
                {data?.label}
              </option>
            ))}
          </SelectField>
        )}
        {type === "date" && (
          <InputField
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            type="date"
            placeholder={placeholder ? placeholder : "Enter name"}
          />
        )}
        {type === "time" && (
          <InputFieldsContainer>
            {children}
            {/* <TimeSelector value={value} onChange={onChange}/> */}
          </InputFieldsContainer>
        )}
        {type === "customDate" && (
          <CustomSelectMainWrapper>
            <CustomSelects onClick={handleClick}>
              <PlaceHolderWrapper>
                <CustomSelectPlaceholder>
                  {value && value}
                </CustomSelectPlaceholder>
                <CustomSelectArrowIcon>
                  <KeyboardArrowDownIcon
                    style={{
                      transform: isDropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: ".5s ease-in-out",
                    }}
                  />
                </CustomSelectArrowIcon>
              </PlaceHolderWrapper>
            </CustomSelects>
            {isDropdownOpen && (
              <CustomDropDownWrapper>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    left: 0,
                    "@media (min-width: 1990px)": {
                      left: "120px",
                    },
                    "@media (min-width: 1366px) and (max-width: 1441px)": {
                      left: "50px",
                    },
                    "@media (min-width: 1442px) and (max-width: 1771px)": {
                      left: "80px",
                    },
                  }}
                >
                  {children}
                </Popover>
              </CustomDropDownWrapper>
            )}
          </CustomSelectMainWrapper>
        )}
        {/* {type ==='customDate' && 
                    <InputFieldsContainer>
                    {children}
                    </InputFieldsContainer>
                 } */}
        {type === "multiple-inputs" && (
          <InputFieldsContainer>
            <InputSelectFieldsItem disabled={disabled}>
              {/* <option disabled selected>Select</option> */}
              <option value="first">US</option>
              <option value="second" selected>
                NG
              </option>
              <option value="third" selected>
                PK
              </option>
            </InputSelectFieldsItem>
            <InputFields
              disabled={disabled}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder ? placeholder : "Enter name"}
            />
          </InputFieldsContainer>
        )}
        {type === "customSelect" && (
          <CustomSelectMainWrapper>
            <CustomSelects onClick={toggleDropdown}>
              <PlaceHolderWrapper>
                <CustomSelectPlaceholder>
                  {value && value}
                </CustomSelectPlaceholder>
                <CustomSelectArrowIcon>
                  <KeyboardArrowDownIcon
                    style={{
                      transform: isDropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: ".5s ease-in-out",
                    }}
                  />
                </CustomSelectArrowIcon>
              </PlaceHolderWrapper>
            </CustomSelects>
            {isDropdownOpen && (
              <CustomDropDownWrapper>
                {customSelectOptions(handleCustomSelectChange)}
              </CustomDropDownWrapper>
            )}
          </CustomSelectMainWrapper>
        )}
      </InputDiv>
    </InputContainer>
  );
};

export default Input;

const InputContainer: any = styled("div")(({ theme }) => ({
  flex: 1,
  fontSize: "1rem",
  marginTop: "0.5rem",
}));

const InputLabel = styled("div")(({ theme }) => ({
  fontWeight: 500,
  lineHeight: "1.5rem",
  color: palettes?.dark[0],
  marginBottom: "0.5rem",
  display: "flex",
  justifyContent: "space-between",
}));

const InputDiv = styled("div")(({ theme }) => ({
  display: "flex",
}));

const Required = styled("div")(({ theme }) => ({
  color: palettes?.red[0],
  fontSize: "0.6rem",
}));

const InputField = styled("input")(({ theme }) => ({
  borderRadius: "8px",
  padding: "0.75rem 0.875rem",
  color: palettes?.dark[0],
  border: `1px solid ${palettes?.gray[1]}`,
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  fontWeight: 400,
  lineHeight: "1.5rem",
  flex: 1,
  outline: "none",
}));

const InputFields = styled("input")(({ theme }) => ({
  borderRadius: "8px",
  padding: "0.75rem 4rem",
  color: palettes?.dark[0],
  border: `1px solid ${palettes?.gray[1]}`,
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  fontWeight: 400,
  lineHeight: "1.5rem",
  outline: "none",
  flex: 1,
}));

const InputFieldsContainer = styled("div")(({ theme }) => ({
  position: "relative",
  flex: 1,
  display: "flex",
}));

const InputFieldsItem = styled("div")(({ theme }) => ({
  position: "absolute",
  height: "100%",
  width: "3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
}));

const InputFieldItem = styled("div")(({ theme }) => ({
  position: "absolute",
  height: "100%",
  width: "3.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  outline: "none",
  borderTopLeftRadius: "8px",
  borderBottomLeftRadius: "8px",
  border: `1px solid ${palettes?.gray[1]}`,
}));

const SelectField = styled("select")(({ theme }) => ({
  borderRadius: "8px",
  padding: "0.75rem 0.875rem",
  color: palettes?.dark[0],
  border: `1px solid ${palettes?.gray[1]}`,
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  fontWeight: 400,
  lineHeight: "1.5rem",
  flex: 1,
  outline: "none",
  WebkitAppearance: "none",
  backgroundRepeat: "no-repeat",
  backgroundPositionX: "99%",
  backgroundPositionY: "50%",
}));

const Mandatory = styled("span")(({ theme }) => ({
  color: palettes?.red[0],
}));

const InputSelectFieldsItem = styled("select")(({ theme }) => ({
  position: "absolute",
  height: "100%",
  width: "3.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  outline: "none",
  borderTopLeftRadius: "8px",
  borderBottomLeftRadius: "8px",
  border: `1px solid ${palettes?.gray[1]}`,
}));

const CustomSelectMainWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  position: "relative",
}));
const CustomSelects = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "3rem",
  width: "100%",
  border: `1px solid ${palettes?.gray[1]}`,
  borderRadius: "8px",
  cursor: "pointer",

  "@media (max-width: 1539px)": {
    height: "4rem",
  },
}));
const CustomSelectPlaceholder = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  fontWeight: 400,
  lineHeight: "1.5rem",
  fontSize: "0.7rem",
  fontFamily: "Inter",
}));
const PlaceHolderWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
  height: "100%",
  padding: "0px 8px",
  fontWeight: 400,
  lineHeight: "1.5rem",

  // '@media (max-width: 1441px)':{
  //     height: '4rem',
  // },
}));
const CustomSelectArrowIcon = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
}));
const CustomDropDownWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: "999",
  position: "absolute",
  top: "4.3rem",
  left: 0,
  width: "100%",
  borderRadius: "8px",
  padding: "8px",
  border: "1px solid var(--stock, #E4E9F1)",
  background: "var(--white, #FFF)",
  opacity: 1,
  transition: "opacity 2.5s ease-in-out",
}));

const DividerWrapper = styled(Divider)(({ theme }) => ({
  background: "red",
  border: "1px solid red",
  width: "100%",
  height: "1px",
}));
