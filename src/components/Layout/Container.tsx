import styled from "@emotion/styled";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
}

function Container({ children }: ContainerProps) {
  return <ContainerWrapper>{children}</ContainerWrapper>;
}

export default Container;

const ContainerWrapper = styled("div")<Partial<ContainerProps>>`
  width: 100%;
  padding-left: 3rem;
  padding-right: 3rem;

  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
  }
`;
