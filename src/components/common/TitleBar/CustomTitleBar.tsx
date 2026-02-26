import styled from "@emotion/styled";
import React from "react";
import DefaultBackgroundImg from "@/assets/images/user-management-title-background.svg";
import Image from "next/image";
import Container from "@/components/Layout/Container";

interface CustomTitleBarProps {
  backgroundUrl?: string;
  height?: string;
  title: string;
  children?: React.ReactNode;
}

function CustomTitleBar({
  backgroundUrl = DefaultBackgroundImg,
  title,
  height,
  children,
}: CustomTitleBarProps) {
  return (
    <CustomTitleBarWrapper backgroundUrl={backgroundUrl} height={height}>
      <Container>
        <CustomTitleBarContent>
          <h1 className="custom-title-bar__title">{title}</h1>
          <div className="custom-title-bar__panel">{children}</div>
        </CustomTitleBarContent>
      </Container>
    </CustomTitleBarWrapper>
  );
}

export default CustomTitleBar;

const CustomTitleBarWrapper = styled("div")<Partial<CustomTitleBarProps>>`
  width: 100%;
  height: ${(props) => props.height || "12.5rem"};
  background-image: ${(props) => {
    const { src } = props.backgroundUrl as unknown as { src: string };
    return props.backgroundUrl ? `url(${src})` : `url(${DefaultBackgroundImg})`;
  }};
  background-size: cover;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    height: auto;
    min-height: 10rem;
    padding: 0 1.5rem;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 6rem;
    padding: 0 1rem;
  }
`;

const CustomTitleBarContent = styled("div")`
  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 0;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
  }

  > .custom-title-bar__title {
    color: #2b2a2f;
    font-size: 2.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2.625rem;
    padding-top: 2.25rem;
    margin: 0;

    @media (max-width: 1024px) and (min-width: 769px) {
      font-size: 1.75rem;
      line-height: 2.25rem;
      padding-top: 1.75rem;
    }

    @media (max-width: 768px) {
      font-size: 0.875rem;
      line-height: 1rem;
      padding-top: 1rem;
      text-align: center;
      white-space: nowrap;
      margin-left: 0;
      padding-left: 0;
    }
  }

  > .custom-title-bar__panel {
    display: flex;
    justify-content: space-between;

    @media (max-width: 1024px) and (min-width: 769px) {
      flex-wrap: wrap;
      gap: 0.8rem;
      padding: 0.5rem 0;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem 0;
    }
  }

  > .custom-title-bar__panel__left-menu {
  }

  > .custom-title-bar__panel__right-menu {
  }
`;
