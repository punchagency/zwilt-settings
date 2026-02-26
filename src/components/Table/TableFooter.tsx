import React from 'react'
import Pagination from '../pagination'
import ExpandMoreIcon from "../../assets/img/arrow-down.svg";
import Dropdown from "../dropdown";
import Image from 'next/image';

interface TableFooterT {
    length: number;
    setLimit: (value: number) => void;
    page: number;
    count: number;
    limit: number;
    pageInfo: any;
    handlePageChange: (event: any, page: number) => void;
}

function TableFooter({length, setLimit, page, count, limit, pageInfo, handlePageChange}: TableFooterT ) {
  return (
    <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            width: "70%",
            alignItems: "center",
          }}
        >
          <span
            style={{
              borderRight: "1px solid #EBEBEB",

              padding: ".8rem .7rem",
              fontSize: "0.875rem",

              width: "40%",
            }}
          >{`Total Rows -- ${length}`}</span>
          <Dropdown
            data={[5, 10, 20, 40, 'View all']}
            setValue={(x) => setLimit(x === 'View all' ? +length: x)}
            position="top"
            disabled={(page + 1) === count && (page + 1) !== 1}
          >
            <div
              style={{
                borderRight: "1px solid #EBEBEB",

                padding: ".8rem .8rem .8rem 0",
                gap: ".6rem",
                alignItems: "center",
                display: "flex",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                }}
              >{`Items per page ${limit}`}</span>

              <Image src={ExpandMoreIcon} alt="" />
            </div>
          </Dropdown>
          <span
            style={{
              // borderRight: "1px solid #EBEBEB",
              padding: ".8rem  ",
              marginLeft: "0.9rem",
              fontSize: "0.875rem",
              width: "40%",
            }}
          >{`${pageInfo.firstItemIndex + 1} - ${
            pageInfo.lastItemIndex + 1
          }  of ${length} items`}</span>
        </div>
        <div
          style={{
            borderRight: "1px solid #EBEBEB",
            height: "100%",
            padding: ".8rem .8rem 0.8rem 1rem",
          }}
        >
          <Pagination count={count} onChange={handlePageChange} page={page} />
        </div>
      </div>
  )
}

export default TableFooter