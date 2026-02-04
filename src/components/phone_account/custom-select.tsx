import Image, { StaticImageData } from "next/image";
import Select, { components, StylesConfig } from "react-select";

interface Option<T> {
  value: string;
  label: string;
  userId: string;
  imageUrl?: T;
}

interface CustomSelectProps {
  data: any[];
  getOptionLabel: (option: any) => string;
  getOptionValue: (option: any) => string;
  getImageUrl?: (option: any) => StaticImageData;
  onChange: (selectedOption: any | null) => void;
  placeholder?: string;
  padding?: string;
  defaultValue?: string;
}

const CustomSelect = ({
  data,
  getOptionLabel,
  getOptionValue,
  getImageUrl,
  onChange,
  placeholder,
  padding,
  defaultValue,
}: CustomSelectProps) => {
  //@ts-ignore
  const options: Option[] = data?.map((item) => ({
    value: getOptionValue(item),
    label: getOptionLabel(item),
    imageUrl: getImageUrl && getImageUrl(item),
    userId: item.user?._id,
  }));
  const handleChange = (selectedOption: any | null) => {
    onChange(selectedOption);
  };

  const customStyles: StylesConfig<Option<any>, false> = {
    control: (provided) => ({
      ...provided,
      height: "2.55vw",
      borderRadius: "0.78vw",
      border: "0.983536px solid #d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      padding: padding,
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      border: "none",
      // width: "0.63vw",
      // height: "0.31vw",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.83vw",
      fontWeight: "400",
      color: "#6F6F76",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const SingleValue = (props: any) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center">
          {getImageUrl && (
            <Image
              src={
                props.data.imageUrl ??
                "https://zwilt.s3.amazonaws.com/42orqxXf_1695110728039650955aaef4301a49705a551.jpeg"
              }
              alt=""
              width={30}
              height={30}
              className="w-[1.56vw] h-[1.56vw] rounded-full"
            />
          )}

          <span className="text-[0.83vw] font-medium text-[#282833] ml-[0.26vw]">
            {props.data.label}
          </span>
        </div>
      </components.SingleValue>
    );
  };

  const Option = (props: any) => {
    return (
      <components.Option {...props}>
        <div className="flex items-center w-full">
          {getImageUrl && (
            <Image
              src={
                props.data.imageUrl ??
                "https://zwilt.s3.amazonaws.com/42orqxXf_1695110728039650955aaef4301a49705a551.jpeg"
              }
              alt=""
              width={30}
              height={30}
              className="w-[1.56vw] h-[1.56vw] rounded-full"
            />
          )}

          <span className="text-[0.83vw] font-medium text-[#282833] ml-[0.26vw]">
            {props.data.label}
          </span>
        </div>
      </components.Option>
    );
  };
  return (
    <>
      <Select
        options={options}
        onChange={(selectedOption) => handleChange(selectedOption)}
        getOptionLabel={(option: any) => option.label}
        getOptionValue={(option: any) => option.value}
        components={{ SingleValue, Option: Option }}
        styles={customStyles}
        placeholder={placeholder}
        defaultInputValue={defaultValue}
        className="w-full placeholder:font-normal"
      />
    </>
  );
};

export default CustomSelect;
