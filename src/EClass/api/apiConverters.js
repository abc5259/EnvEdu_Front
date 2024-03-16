export class ApiConverter {
  converters = [new MatrixApiConverter(), new ChartApiConverter()];

  convert(data) {
    const type = data.classroomSequenceType;
    const converter = this.converters.filter(converter =>
      converter.isSupport(type)
    );

    if (converter.length != 1) return data;

    return converter[0].convert(data);
  }
}

export class MatrixApiConverter {
  isSupport(type) {
    return type === "MATRIX";
  }
  convert(data) {
    return {
      ...data,
      properties: JSON.stringify(data.data[0]),
      data: JSON.stringify(data.data.slice(1)),
    };
  }

  convertApiToAssignmentData(chunk) {
    const data = JSON.parse(chunk.data);
    data.unshift(JSON.parse(chunk.properties));
    return {
      ...chunk,
      data,
    };
  }
}

export class ChartApiConverter {
  isSupport(type) {
    return type === "CHART";
  }
  convert({
    classroomSequenceType,
    studentVisibleStatus,
    title,
    canSubmit,
    canShare,
    data,
  }) {
    const { graphIdx, variables, axisData, metaData } = data;
    return {
      classroomSequenceType,
      studentVisibleStatus,
      properties: JSON.stringify(data.data[0]),
      data: JSON.stringify(data.data.slice(1)),
      title,
      canSubmit,
      canShare,
      chartType: this.convertChartType(graphIdx),
      uuid: null,
      legendPosition: metaData.legendPostion.toUpperCase(),
      labelPosition: metaData.datalabelAnchor.toUpperCase(),
      axisProperties: this.convertAxisProperties(graphIdx, variables, axisData),
    };
  }

  convertAxisProperties(graphIdx, variables, axisData) {
    if (graphIdx == 0 || graphIdx == 1) {
      return variables.map(variable =>
        this.convertAxisPropertie(variable, axisData)
      );
    }

    if (graphIdx == 2 || graphIdx == 4) {
      return variables.map(variable =>
        this.convertAxisPropertieWithBubble(variable, axisData)
      );
    }

    if (graphIdx == 5) {
      return variables.map(variable =>
        this.convertAxisPropertieWithMix(variable, axisData)
      );
    }

    return [];
  }

  convertChartType(graphIdx) {
    switch (graphIdx) {
      case 0:
        return "BAR";
      case 1:
        return "LINE";
      case 2:
        return "BUBBLE";
      case 4:
        return "SCATTER";
      case 5:
        return "BAR_LINE_MIXED";
      default:
        return -1;
    }
  }

  convertAxisPropertie(variable, axisData) {
    return {
      axis: variable.axis === "Y" ? "Y1" : "X",
      axisName: variable.name,
      axisType: variable.type.toUpperCase(),
      minimumValue: axisData.min,
      maximumValue: axisData.max,
      stepSize: axisData.stepSize,
    };
  }

  convertAxisPropertieWithBubble(variable, axisData) {
    const { xAxis, yAxis } = axisData;
    return {
      axis: variable.axis === "Y" ? "Y1" : variable.axis,
      axisName: variable.name,
      axisType: variable.type.toUpperCase(),
      minimumValue: variable.axis === "X" ? xAxis.min : yAxis.min,
      maximumValue: variable.axis === "X" ? xAxis.max : yAxis.max,
      stepSize: variable.axis === "X" ? xAxis.stepSize : yAxis.stepSize,
    };
  }

  convertAxisPropertieWithMix(variable, axisData) {
    console.log(axisData);
    const { y1Axis, y2Axis } = axisData;
    return {
      axis: variable.axis,
      axisName: variable.name,
      axisType: variable.type.toUpperCase(),
      minimumValue:
        variable.axis === "X"
          ? 0
          : variable.axis === "Y1"
          ? y1Axis.min
          : y2Axis.min,
      maximumValue:
        variable.axis === "X"
          ? 0
          : variable.axis === "Y1"
          ? y1Axis.max
          : y2Axis.max,
      stepSize:
        variable.axis === "X"
          ? 0
          : variable.axis === "Y1"
          ? y1Axis.stepSize
          : y2Axis.stepSize,
    };
  }

  convertApiToAssignmentData(chunk) {
    const data = JSON.parse(chunk.data);
    data.unshift(JSON.parse(chunk.properties));
    const metaData = {
      legendPosition: chunk.legendPosition,
      datalabelAnchor: chunk.labelPosition,
    };
    return {
      ...chunk,
      data: {
        graphIdx: this.convertGraphIndex(chunk.chartType),
        data: data,
        variables: this.convertAxisPropertiesTovariables(
          chunk.axisProperties,
          chunk.chartType
        ),
        axisData: this.convertToAxisData(chunk.axisProperties, chunk.chartType),
        metaData,
      },
    };
  }
  convertToAxisData(axisProperties, chartType) {
    if (chartType === "BAR" || chartType === "LINE") {
      const xAxis = this.convertToAxis(axisProperties, "X");
      const yAxis = this.convertToAxis(axisProperties, "Y1");
      if (xAxis._min == null) {
        return {
          min: yAxis._min,
          max: yAxis._max,
          stepSize: yAxis._stepSize,
        };
      }
      return {
        min: xAxis._min,
        max: xAxis._max,
        stepSize: xAxis._stepSize,
      };
    }
    if (chartType === "BUBBLE" || chartType === "SCATTER") {
      const xAxis = this.convertToAxis(axisProperties, "X");
      const yAxis = this.convertToAxis(axisProperties, "Y1");
      return {
        xAxis,
        yAxis,
      };
    }

    if (chartType === "BAR_LINE_MIXED") {
      const y1Axis = this.convertToAxis(axisProperties, "Y1");
      const y2Axis = this.convertToAxis(axisProperties, "Y2");
      return {
        y1Axis,
        y2Axis,
      };
    }
    return {};
  }

  convertToAxis(axisProperties, axis) {
    const axisData = axisProperties.filter(
      axisPropertie => axisPropertie.axis === axis
    );

    return {
      _min: axisData[0]?.minimumValue,
      _max: axisData[0]?.maximumValue,
      _stepSize: axisData[0]?.stepSize,
    };
  }

  convertAxisPropertiesTovariables(axisProperties, chartType) {
    return axisProperties.map(axisPropertie => ({
      _name: axisPropertie.axisName,
      _type:
        axisPropertie.axisType === "CATEGORICAL" ? "Categorical" : "Numeric",
      _isSelected: true,
      _axis: this.convertAxis(axisPropertie.axis, chartType),
      _graph: axisPropertie.graph,
      _unit: "",
    }));
  }

  convertAxis(axis, chartType) {
    if (chartType === "BAR_LINE_MIXED") return axis;
    if (axis === "X") return axis;
    if (axis === "Y1") return "Y";
    return axis;
  }

  convertGraphIndex(chartType) {
    switch (chartType) {
      case "BAR":
        return 0;
      case "LINE":
        return 1;
      case "BUBBLE":
        return 2;
      case "SCATTER":
        return 4;
      case "BAR_LINE_MIXED":
        return 5;
      default:
        return -1;
    }
  }
}
