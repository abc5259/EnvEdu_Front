import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import { useGraphDataStore } from "../../../store/graphStore";
import { useBarStore } from "../../../store/barStore";
import * as Styled from "./Styled";
import LabelInput from "../../../common/Labellnput/LabelInput";
import MetadataEditor from "../MetadataEditor/MetadataEditor";
import EditorWrapper from "../EditorWrapper/EditorWrapper";

function BarEditor() {
  const { variables, changeAxis } = useGraphDataStore();
  const { min, max, stepSize, changeMinValue, changeMaxValue, changeStepSize } =
    useBarStore();

  const onChangeMinMax = (type, value) => {
    if (type === "MIN") {
      changeMinValue(value);
    }
    if (type === "MAX") {
      changeMaxValue(value);
    }
  };

  const onChangeStepSize = value => {
    changeStepSize(value);
  };

  return (
    <EditorWrapper>
      <Styled.Box>
        <Styled.Title>축 선택</Styled.Title>
        <Styled.ButtonSelectorWrapper>
          {variables.map((variable, index) => {
            if (!variable.getIsSelected) return;
            return (
              <ButtonSelector
                key={index}
                value={variable.getName}
                defaultValue={variable.getAxis}
                selectList={["X", "Y"]}
                onChange={axis => changeAxis(index, axis)}
              />
            );
          })}
        </Styled.ButtonSelectorWrapper>
      </Styled.Box>
      <Styled.Box>
        <Styled.Title>범위 설정</Styled.Title>
        <Styled.LabelInputWrapper>
          <LabelInput
            labelName={"최솟값"}
            defaultValue={min}
            onChange={value => onChangeMinMax("MIN", value)}
          />
          <LabelInput
            labelName={"최댓값"}
            defaultValue={max}
            onChange={value => onChangeMinMax("MAX", value)}
          />
        </Styled.LabelInputWrapper>
      </Styled.Box>
      <Styled.Box>
        <Styled.Title>축 간격 설정</Styled.Title>
        <Styled.LabelInputWrapper>
          <LabelInput
            labelName={"간격"}
            defaultValue={stepSize}
            onChange={onChangeStepSize}
          />
        </Styled.LabelInputWrapper>
      </Styled.Box>
      <MetadataEditor />
    </EditorWrapper>
  );
}

export default BarEditor;
