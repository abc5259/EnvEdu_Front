import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  margin-top: -50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  & > * {
    width: 500px;
  }
`;

export const DataWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;
