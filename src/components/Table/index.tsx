import CheckedBox from "@/assets/icons/checkedBox";
import UncheckedBox from "@/assets/icons/unCheckedBox";
import { Checkbox, styled } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Column {
  id: string;
  width?: number;
  name: any;
  render?: (value: any, id?: any) => any;
}

interface CustomTableProps {
  columns: Array<Column>;
  data: Array<any>;
  nestedColumns?: Array<Column>;
  nestedTableTitle?: string;
  paginationName?: string;
  noCheckbox?: boolean;
  onClick?: () => any;
  onSelect?: (e: Array<any>) => void;
  selectedRows?: Array<string>;
}

interface CustomTableCellProps {
  width: number;
  padding?: string;
}

interface CustomTableRowProps {
  nested?: boolean;
  clickable?: boolean;
}

const CustomTableWrapper = styled("div")`
  width: 100%;
`;

const CustomTableRow = styled("div")<CustomTableRowProps>(
  ({ nested, clickable }) => `
  width: 100%;
  display: flex;
  align-items: center;
  border-width: 0px 0px 1px 0px;
  padding-left: 0.5rem;
  border-style: solid;
  border-color: #ebebeb;
  cursor: ${nested || clickable ? "pointer" : "default"};
`
);

const CustomTableHead = styled("div")`
  color: #111929cc;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  width: 100%;
  //   padding: 8px 0px;
`;
const CustomTableCell = styled("div")<CustomTableCellProps>(
  ({ width, padding = "1rem" }) => `
    width: ${width}%;
    padding: ${padding};
word-wrap: break-word;
`
);

const CustomTableBody = styled("div")`
  max-height: 40rem;
  overflow-y: auto;

  /* for webkit-based browsers */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
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

const NestedTableWrapper = styled("div")`
  > h2 {
    font-weight: 500;
    font-size: 1.375rem;
    line-height: 2.06rem;
    margin-left: 1.5rem;
  }
`;

interface PageInfoT {
  firstItemIndex: number;
  lastItemIndex: number;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  noCheckbox,
  nestedColumns,
  nestedTableTitle,
  paginationName,
  onClick,
  onSelect,
  selectedRows,
}) => {
  const [showRow, setShowRow] = useState("");

  const [dataShown, setDataShown] = React.useState(data);
  const [limit] = React.useState(5);
  const [page, setPage] = React.useState(0);
  function handlePageChange(event: any, page: number) {
    setPage(page);
    const start = page * limit;
    const end = start + limit;
    setDataShown(data?.slice(start, end));
  }
  function calculateItemIndices(
    totalItems: number,
    itemsPerPage: number,
    currentPage: number
  ) {
    const firstItemIndex = (currentPage - 1) * itemsPerPage;
    const lastItemIndex =
      Math.min(firstItemIndex + itemsPerPage, totalItems) - 1;

    return {
      firstItemIndex,
      lastItemIndex,
    };
  }
  useEffect(() => {
    const start = 0;
    const end = start + limit;
    setPageInfo({ firstItemIndex: 0, lastItemIndex: limit - 1 });
    setPage(0);
    setDataShown(data?.slice(start, end));
  }, [limit]);
  const [pageInfo, setPageInfo] = useState<PageInfoT>({
    firstItemIndex: 0,
    lastItemIndex: 4,
  });

  useEffect(() => {
    setPageInfo(calculateItemIndices(data?.length, limit, page + 1));
  }, [page]);

  const getCellSize = () => {
    const columnsWithWidth = columns.filter(
      (column) => column.width !== undefined
    );
    const columnWidths = columns.map((column) => column.width ?? 0);
    const width = columnWidths.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    return (97 - width) / (columns.length - columnsWithWidth.length);
  };
  const [selected, setSelected] = useState<Array<string | number>>([]);

  const handleSelect = (id: string | number) => {
    setSelected([...selected, id]);
  };

  const handleUnselect = (id: string | number) => {
    let newSelected = selected;
    newSelected = newSelected.filter((select) => select !== id);
    setSelected(newSelected);
  };

  const checkSelected = (id: number | string) => {
    return selected?.indexOf(id) > -1;
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | number
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
      const newSelected = data?.map((d) => d.id);
      setSelected(newSelected);
    }
  };

  useEffect(() => {
    onSelect && onSelect(selected);
  }, [selected]);

  useEffect(() => {
    if (
      !(
        selectedRows === undefined ||
        selectedRows === null ||
        selectedRows === selected ||
        selected?.length === 0
      )
    ) {
      setSelected(selectedRows || []);
    }
  }, [selectedRows]);
  return (
    <CustomTableWrapper>
      <CustomTableHead>
        <CustomTableRow>
          {noCheckbox ? (
            ""
          ) : (
            <CustomTableCell width={3} padding={"0rem"}>
              <Checkbox
                onChange={toggleSelectAll}
                icon={<UncheckedBox />}
                checkedIcon={<CheckedBox />}
                checked={selected?.length === data?.length}
                size="small"
              />
            </CustomTableCell>
          )}

          {columns.map((column) => (
            <CustomTableCell
              key={column.name}
              width={column.width ?? getCellSize()}
            >
              {column.name}
            </CustomTableCell>
          ))}
        </CustomTableRow>
      </CustomTableHead>
      <CustomTableBody>
        {data?.map((row) => (
          <>
            <CustomTableRow
              onClick={() => {
                if (onClick) {
                  return onClick();
                } else {
                  if (showRow === row.id) {
                    return setShowRow("");
                  }
                  return setShowRow(row.id);
                }
              }}
              // onClick={() => {
              //   if (showRow === row.id){
              //      return setShowRow("");}
              //   return setShowRow(row.id);
              // }}
              nested={!!row.nestedTable}
              clickable={onClick !== undefined}
              key={row.id}
            >
              {noCheckbox ? (
                ""
              ) : (
                <CustomTableCell width={3} padding={"0rem"}>
                  <Checkbox
                    checked={checkSelected(row.id)}
                    size="small"
                    icon={<UncheckedBox />}
                    checkedIcon={<CheckedBox />}
                    onChange={(e) => {
                      handleSelectChange(e, row.id);
                    }}
                  />
                </CustomTableCell>
              )}

              {columns.map((column) => {
                // const cell = row.find((r: any) => r[column.id])

                return (
                  <CustomTableCell
                    key={column.id}
                    width={column?.width ?? getCellSize()}
                  >
                    {column.render
                      ? column.render(row[column.id], row)
                      : row[column.id]}
                  </CustomTableCell>
                );
              })}
            </CustomTableRow>
            {showRow === row.id && row.nestedTable && (
              <NestedTableWrapper>
                <h2>{nestedTableTitle}</h2>
                <CustomTableHead>
                  <CustomTableRow>
                    {nestedColumns?.map((column) => (
                      <CustomTableCell
                        key={column.id}
                        width={column.width ?? getCellSize()}
                      >
                        {column.name}
                      </CustomTableCell>
                    ))}
                  </CustomTableRow>
                </CustomTableHead>
                <CustomTableBody>
                  {row.nestedTable.map((row: any, index: number) => (
                    <CustomTableRow key={row.id}>
                      {nestedColumns?.map((column, index) => {
                        // const cell = row.find((r: any) => r[column.id])

                        return (
                          <CustomTableCell
                            key={column.id}
                            width={column?.width ?? getCellSize()}
                          >
                            {column.render
                              ? column.render(row[column.id])
                              : row[column.id]}
                          </CustomTableCell>
                        );
                      })}
                    </CustomTableRow>
                  ))}
                </CustomTableBody>
              </NestedTableWrapper>
            )}
          </>
        ))}
      </CustomTableBody>
    </CustomTableWrapper>
  );
};

const CustomTableMemo = React.memo(CustomTable);

export default CustomTableMemo;
