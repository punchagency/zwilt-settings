import React, { useEffect, useRef, useState } from "react";
import DropdownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { Checkbox, styled, Tooltip } from "@mui/material";
import Image from "next/image";
import Avatar from "../avatar";
interface CustomDropdownT {
  data: Array<any>;
  label: string;
  extraLabel?: string;
  extra: string;
  extraX?: string;
  placeholder: string;
  value?: Array<number | string>;
  onChange?: (e: Array<any>) => void;
  defaultOpenValue?: boolean;
  listWrapperStyle?: any;
  wrapperStyle?: any;
  dropdownWrapperStyle?: any;
  isUp?: any;
}

interface DropdownContentWrapperT {
  open?: boolean;
}
const DropdownContentWrapper = styled("div")<DropdownContentWrapperT>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items; center;
  font-size: 0.875rem;
  color: #02120d;
  font-weight: 500;
  width: 100%;

  padding: 0.6rem 0.9rem;
  gap: 8px;

  > span {
    display: flex;
    align-items: center;
  }
  > svg {
    width: 1rem;
    // height: 0.25rem;
    transform: ${(props) => (props.open ? "rotate(180deg)" : "")};
    transition: 0.3s all linear;
    margin-top: auto;
    margin-bottom: auto;
  }
`;

const DropdownWrapper = styled("div")`
  border: 1px solid #d0d5dd;
  border-radius: 8px;
`;

const FormDropdownInputWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 5px;
  position: relative;

  .label {
    color: #52625d;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
  }

  > div {
    display: flex;
    justify-content: space-between;
  }
  > span {
    font-family: inter;
    font-size: 0.7rem;
    line-height: 1.125rem;
    font-weight: 400;
    color: #667085;
  }
`;

const FromDropdownExtraInfo = styled("div")`
  font-family: inter;
  color: #244bb6;
  font-weight: 400;
  line-height: 1.25rem;
  font-size: 0.875rem;
`;

const DropDownMenuWrapper = styled("div")``;

interface DropdownProps {
  isUp?: boolean;
}

const DropdownContent = styled("div")<DropdownProps>`
  position: absolute;
  bottom: ${(props: any) => (!props.isUp ? "auto" : "1px")};
  top: ${(props: any) => (!props.isUp ? "100%" : "auto")};
  z-index: 1;
  display: flex;
  flex-direction: column;
  background: white;
  width: 100%;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
`;

const ControlPanelWrapper = styled("div")`
  display: flex;
  gap: 0.625rem;
  width: 100%;
  margin-top: 0.5rem;
  > button {
    padding: 0.5rem 0.9rem;
    border: 1px solid #02120d;
    border-radius: 8px;
    flex: 1;
    font-size: 0.875rem;
    background: #fff;
    cursor: pointer;
  }

  > .btn-primary {
    background: #244bb6;
    color: #f8f9fb;
    border: none;
  }
`;

const SearchBox = styled("div")`
  padding: 0.625rem 0.875rem;
  // width: 30%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  border-radius: 8px;
  border: 1px solid #eaecf0;
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  max-width: 308px;
  background: white;
  margin-left: 1rem;
  width: 40%;
  > input {
    all: unset;
    font-size: 0.875rem;
    line-height: 1rem;
    flex: 1;
    color: #52625d;
    width: 80%;
  }

  > svg {
    width: 1rem;
    height: 1rem;
  }
`;

const DropdownMenuListWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  max-height: 190px;
`;
const DropdownMenuListHeader = styled("div")`
  border-bottom: 1px solid #d0d5dd;
  padding: 8px 0px;
  padding-right: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
  }

  > div > .title {
    color: #02120d;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  > div > .number {
    font-size: 0.75rem;
    color: #244bb6;
    font-weight: 400;
    line-height: 1.125rem;
    margin-left: 0.5rem;
  }
`;
const DropdownMenuList = styled("div")`
  padding: 1rem;
  max-height: 300px;
  overflow: auto;

  /* for webkit-based browsers */
  ::-webkit-scrollbar {
    width: 5px;
    radius: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #d0d5dd;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  ::-webkit-scrollbar-corner {
    background: #f1f1f1;
  }

  /* for Firefox */
  .scrollbar {
    width: 5px;
  }

  .scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  .scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  .scrollbar-thumb:hover {
    background: #555;
  }

  .scrollbar-corner {
    background: #f1f1f1;
  }
`;

const DropdownMenuItem = styled("div")`
  border-bottom: 1px solid #d0d5dd;
  padding: 0.5rem 0px;
  display: flex;
  align-items: center;

  > img {
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }

  > .name {
    margin-left: 8px;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
`;

const ProjectAvatars = styled("div")`
  display: flex;
  > div {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 2px solid white;
    position: relative;
  }

  > div:nth-of-type(2),
  div:nth-of-type(3),
  div:nth-of-type(4),
  div:nth-of-type(5) {
    margin-left: -0.6rem;
  }
`;

const MembersNumber = styled("span")`
  width: 2rem;
  height: 2rem;
  font-size: 0.7rem;
  position: relative;
  margin-left: -0.6rem;
  color: #7f56d9;
  border: 2px solid white;
  border-radius: 50%;
  line-height: 1.1rem;
  background: #f9f5ff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
`;

const CustomDropdown: React.FC<CustomDropdownT> = ({
  data,
  label,
  extra,
  extraLabel,
  extraX,
  placeholder,
  value,
  onChange,
  isUp = false,
  defaultOpenValue = false,
  listWrapperStyle = {},
  wrapperStyle = {},
  dropdownWrapperStyle = {},
}) => {
  const [open, setOpen] = useState(defaultOpenValue);
  const [selected, setSelected] = useState<Array<string | number>>(value || []);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleSelect = (id: string | number) => {
    setSelected([...selected, id]);
  };
  const validateUrl = (imageUrl: string) => {
    if (imageUrl && /^https?:\/\/\S+\.\S+/i.test(imageUrl)) {
      return imageUrl;
    }
    return "";
  };

  const getFullData = (id: string | number) => {
    console.log("value id", id);
    return data?.find((d) => d?.id === id);
  };

  useEffect(() => {
    setSelected((value as Array<number | string>) || []);
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [shownData, setShownData] = useState(data);

  const handleUnselect = (id: string | number) => {
    // const index = selected?.indexOf(id);
    let newSelected = selected;
    newSelected = newSelected.filter((select) => select !== id);
    setSelected(newSelected);
  };

  const checkSelected = (id: number | string) => {
    return selected?.indexOf(id) > -1;
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | number,
  ) => {
    if (e.target.checked) {
      handleSelect(id);
    } else {
      handleUnselect(id);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setSelected([]);
    } else {
      const newSelected = data.map((d) => d.id);
      setSelected(newSelected);
    }
  };
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    let newData = data;
    if (searchData) {
      newData = data.filter((d) =>
        d.name?.toLowerCase()?.includes(searchData.toLowerCase()),
      );
    }
    setShownData(newData);
  }, [data, searchData]);

  useEffect(() => {
    onChange && onChange(selected);
  }, [selected]);

  const getPlaceholder = () => {
    const members = selected?.map((s) => getFullData(s));
    if (members.length > 0) {
      return (
        <ProjectAvatars>
          {members?.slice(0, 5)?.map((v: any) => (
            <Tooltip
              title={v?.name}
              key={v?.id || Math.random()}
              arrow
              placement="top"
            >
              <div style={{ display: "inline-block" }}>
                <Avatar
                  img={validateUrl(v?.image) || validateUrl(v?.profileImg)}
                  initial={v?.name}
                  width="2rem"
                  height="2rem"
                />
              </div>
            </Tooltip>
          ))}

          {members?.length > 5 && (
            <MembersNumber>+{members?.length - 5 || 0}</MembersNumber>
          )}
        </ProjectAvatars>
      );
    } else {
      return placeholder;
    }
  };

  return (
    <FormDropdownInputWrapper ref={dropdownRef} style={wrapperStyle}>
      <div>
        <label className="label">{label}</label>
        {extraLabel && (
          <FromDropdownExtraInfo>
            {extraLabel} {selected?.length || 0}
          </FromDropdownExtraInfo>
        )}
      </div>
      {extraX && <span>{extraX}</span>}
      <DropdownWrapper
        onClick={() => setOpen(!open)}
        style={dropdownWrapperStyle}
      >
        <DropdownContentWrapper open={open}>
          <span>{getPlaceholder()}</span>
          <DropdownIcon />
        </DropdownContentWrapper>
      </DropdownWrapper>
      {open && (
        <DropdownContent isUp={isUp}>
          <DropdownMenuListWrapper
            style={{
              ...listWrapperStyle,
            }}
          >
            <DropdownMenuListHeader>
              <div>
                <Checkbox
                  size="small"
                  onChange={toggleSelectAll}
                  checked={selected?.length === data?.length}
                />
                <span className="title">{extraLabel || "Members"}</span>
                <span className="number">{`(${selected?.length || 0}/${
                  data?.length || 0
                })`}</span>
              </div>
              <SearchBox>
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearchData(e.target.value)}
                  value={searchData}
                />
                <SearchIcon />
              </SearchBox>
            </DropdownMenuListHeader>
            <DropdownMenuList>
              {shownData?.map((dataItem, index) => (
                <DropdownMenuItem key={dataItem?.id || index}>
                  <Checkbox
                    size="small"
                    checked={checkSelected(dataItem?.id)}
                    onChange={(e) => {
                      handleSelectChange(e, dataItem?.id);
                    }}
                  />
                  {/* <Image src={ProjectImg} alt="" /> */}
                  <Tooltip title={dataItem?.name} arrow placement="top">
                    <span style={{ display: "inline-block" }}>
                      <Avatar
                        img={
                          validateUrl(dataItem?.image) ||
                          validateUrl(dataItem?.profileImg)
                        }
                        initial={dataItem?.name}
                        width="2rem"
                        height="2rem"
                      />
                    </span>
                  </Tooltip>
                  <span className="name">{dataItem?.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuList>
          </DropdownMenuListWrapper>
        </DropdownContent>
      )}
    </FormDropdownInputWrapper>
  );
};

export default CustomDropdown;
