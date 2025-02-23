import { useState } from "react";
import { useGraphDataStore } from "../../store/graphStore";
import { ReactComponent as PencilIcon } from "../../image/Pencil.svg";
import * as Styled from "./Styled";
import Select from "../../../DataLiteracy/common/Select/Select";

function CustomTable({ isChangeCategory = true }) {
  const { data, variables, changeValue, changeVariableType } =
    useGraphDataStore();
  const [editableCell, setEditableCell] = useState(null);

  const tableNumberData = data.map((d, idx) => {
    if (idx == 0) return "Rows#";
    return `${idx}`;
  });

  const headers = data[0];

  const onClickPencil = () => {};

  const onChangeType = (index, type) => {
    changeVariableType(index, type);
  };

  const onDoubleClickData = (row, col) => {
    setEditableCell({ row, col });
  };

  const handleInputChange = (e, row, col) => {
    const newValue = e.target.value;
    changeValue(row, col, newValue);
  };

  const onClickEnter = ({ key, isComposing }) => {
    if (isComposing) {
      return;
    }

    if (key !== "Enter") {
      return;
    }

    setEditableCell(null);
  };

  return (
    <Styled.Wrapper>
      <Styled.FirstColumn key={"starter"} $isNotEnd>
        <Styled.HeaderWrapper>
          <Styled.HeaderStartar>{tableNumberData[0]}</Styled.HeaderStartar>
        </Styled.HeaderWrapper>
        {tableNumberData.slice(1).map((d, idx) => (
          <Styled.RowNumber disabled key={idx}>
            {d}
          </Styled.RowNumber>
        ))}
      </Styled.FirstColumn>
      {headers.map((header, col) => (
        <Styled.Column key={col} $isNotEnd={col != headers.length - 1}>
          <Styled.HeaderWrapper>
            <Styled.Header>
              <Styled.Th $isNotEnd>
                <span>{header}</span>
                <Styled.Circle onClick={onClickPencil}>
                  <PencilIcon width={"15px"} height={"15px"} />
                </Styled.Circle>
              </Styled.Th>
              <Styled.Box>
                {isChangeCategory ? (
                  <Select
                    defaultValue={variables[col].type}
                    items={["Categorical", "Numeric"]}
                    onChange={type => onChangeType(col, type)}
                  />
                ) : (
                  variables[col].type
                )}
              </Styled.Box>
            </Styled.Header>
          </Styled.HeaderWrapper>
          {data.slice(1).map((d, row) => (
            <Styled.Data
              key={row}
              $isEditCell={
                editableCell &&
                editableCell.row === row + 1 &&
                editableCell.col === col
              }
            >
              {editableCell &&
              editableCell.row === row + 1 &&
              editableCell.col === col ? (
                <Styled.Input
                  value={d[col]}
                  spellCheck={false}
                  onChange={e => handleInputChange(e, row + 1, col)}
                  onBlur={() => setEditableCell(null)}
                  onKeyDown={e => onClickEnter(e)}
                />
              ) : (
                <Styled.InputDiv
                  onDoubleClick={() => onDoubleClickData(row + 1, col)}
                >
                  {d[col]}
                </Styled.InputDiv>
              )}
            </Styled.Data>
          ))}
        </Styled.Column>
      ))}
    </Styled.Wrapper>
  );
}

export default CustomTable;
