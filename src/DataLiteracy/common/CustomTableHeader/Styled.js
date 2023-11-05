import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Column = styled.div`
  width: 100%;
  background-color: #f8f8f8;
  /* padding: 0px 10px; */
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 700;

  ${props =>
    props.$isNotEnd &&
    css`
      border-right: 1px solid rgba(34, 36, 38, 0.15);
    `}
`;

export const FirstColumn = styled(Column)`
  max-width: 150px;
`;

export const HeaderWrapper = styled.div`
  padding: 0 10px;
  box-shadow: 0 8px 5px -5px rgba(0, 0, 0, 0.3);
  z-index: 3;
  height: 100%;
`;

export const Header = styled.div`
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  height: 100%;
`;

export const HeaderStartar = styled(Header)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Th = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Circle = styled.div`
  cursor: pointer;
  background-color: #dfe0e1;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #cacbcd;
  }
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  line-height: 2;
  ${props =>
    props.$isNotEnd &&
    css`
      border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    `}
`;

export const Data = styled.div`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  &:focus {
    outline: none;
  }
  cursor: crosshair;
  padding: 5px 10px;
  background-color: inherit;
  line-height: 2;
  background-color: #fff;
  font-size: 14px;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Input = styled.input`
  background-color: inherit;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  &:focus {
    outline: none;
  }
`;

export const InputDiv = styled.div`
  background-color: inherit;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  &:focus {
    outline: none;
  }
`;

export const RowNumber = styled.div`
  font-size: 14px;

  padding: 5px 10px;
  background-color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 2;
  background-color: #fff;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;
