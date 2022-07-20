/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect, createRef } from 'react';
import { getCategoricalSchemeRegistry, styled } from '@superset-ui/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import {
  SupersetPluginChartBulletV2Props,
  SupersetPluginChartBulletV2StylesProps,
} from './types';

const categorialSchemeRegistry = getCategoricalSchemeRegistry();
// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<SupersetPluginChartBulletV2StylesProps>`
  background-color: ${({ theme }) => '#ffffff'};
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
    font-size: ${({ theme, headerFontSize }) =>
      theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) =>
      theme.typography.weights[boldText ? 'bold' : 'normal']};
  }

  .legend-cont {
    display: flex;
    flex-wrap: nowrap;
    align-self: end;
    height: 5vh;
    width: 100%;
    margin: 20% 3% 0% 2%;
  }

  .colorBox {
    display: flex;
    position: relative;
  }

  .tickNums {
    font-weight: normal;
    position: absolute;
    bottom: -20px;
    font-size: 13px;
  }

  .ticksBottom {
    bottom: -20px;
  }

  .ticksTop {
    top: -12px;
  }
  .tickPointer {
    text-align: center;
  }

  pre {
    height: ${({ theme, headerFontSize, height }) =>
      height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]}px;
  }

  .wrapper {
    text-transform: uppercase;
    color: #000;
    cursor: help;
    font-size: 20px;
    margin: 0 auto;
    position: relative;
    text-align: center;
    -webkit-transform: translateZ(0); /* webkit flicker fix */
    -webkit-font-smoothing: antialiased; /* webkit text rendering fix */
  }

  .wrapper .tooltip {
    background: #fff;
    bottom: 100%;
    color: #000;
    display: block;
    left: 0;
    margin-bottom: 15px;
    opacity: 0;
    padding: 10px;
    text-align: center;
    pointer-events: none;
    position: absolute;
    width: 100px;
    border-radius: 5px;
    border: solid #000 1px;
    -webkit-transform: translateY(10px);
    -moz-transform: translateY(10px);
    -ms-transform: translateY(10px);
    -o-transform: translateY(10px);
    transform: translateY(10px);
    -webkit-transition: all 0.25s ease-out;
    -moz-transition: all 0.25s ease-out;
    -ms-transition: all 0.25s ease-out;
    -o-transition: all 0.25s ease-out;
    transition: all 0.25s ease-out;
    -webkit-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    -moz-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    -ms-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    -o-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
  }

  /* This bridges the gap so you can mouse into the tooltip without it disappearing */
  .wrapper .tooltip:before {
    bottom: -20px;
    content: ' ';
    display: block;
    height: 20px;
    left: 0;
    position: absolute;
    width: 100%;
  }

  .wrapper:hover .tooltip {
    opacity: 1;
    pointer-events: auto;
    -webkit-transform: translateY(0px);
    -moz-transform: translateY(0px);
    -ms-transform: translateY(0px);
    -o-transform: translateY(0px);
    transform: translateY(0px);
  }

  /* IE can just show/hide with no transition */
  .lte8 .wrapper .tooltip {
    display: none;
  }
  .lte8 .wrapper:hover .tooltip {
    display: block;
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginChartBulletV2(
  props: SupersetPluginChartBulletV2Props,
) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  let colors:string[];
  // let newColors;
  let domains;
  const { data, height, width, colorScheme } = props;
  console.log("props", props);

  /* function getIndicator(selectedMatric: any) {
     for (let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
       for (
         let indicatorIndex = 0;
         indicatorIndex < indicatorData.length;
         indicatorIndex += 1
       ) {
         if (
           data[dataIndex][selectedMatric] ===
           indicatorData[indicatorIndex][selectedMatric]
         ) {
           return indicatorData[indicatorIndex][selectedMatric];
         }
       }
     }
     return '';
   } */

  const colorsValues = categorialSchemeRegistry.values();
  const filterColors: any = colorsValues.filter(
    (c: any) => c.id === colorScheme,
  );
  if(filterColors[0]) {
    colors = [...filterColors[0].colors];
    colors.length = data.length;
  }
  // const colorsArray = filterColors.length === 1 ? filterColors[0].colors : filterColors[1].colors;

  const totalCount = data.reduce(
    (initialValue, b: any) => initialValue + (b.count ? b.count : b.sum__num),
    0,
  );
  const devidedWidth = totalCount <= 100 ? (100 - totalCount) / data.length : 0;

  // colors = colorsArray
  /* if (colors.length < data.length) {
    newColors =
      colors.length < 5
        ? d3Scale
            .scaleLinear<string>()
            .domain([1, 10])
            .range([colors[0], colors[colors.length - 2]])
        : d3Scale.scaleLinear<string>().domain([1, 10]).range(colors);
    const new_colors_array: string[] = [];
    const const_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < data.length; i += 1) {
      const col: string = newColors(const_data[i]);
      new_colors_array.push(col);
    }

    if (colors.length > 5) {
      for (let i = 0; i < data.length - colors.length; i += 1) {
        colors.unshift(new_colors_array[new_colors_array.length - 1 - i]);
      }
    } else {
      colors = new_colors_array.reverse();
    }
    colors = new_colors_array;
  } */
  function getIndicator(type: string) {
    return Math.max(...data.map(b => (b.count ? b.count : b.sum__num)));
  }
  let indicatorPosition = 0;
  domains = [];
  if (data[0].count) {
    domains = d3.extent(data, (d: any) => d.count);
    indicatorPosition = getIndicator('count');
  } else {
    domains = d3.extent(data, (d: any) => d.sum__num);
    indicatorPosition = getIndicator('sum__num');
  }
  const colorScaleEQ = d3Scale
    .scaleQuantize()
    .domain([d3.min(domains), d3.max(domains)])
    .range(data);

  const bins = colorScaleEQ.range().map(d => colorScaleEQ.invertExtent(d));
  const rootElem = createRef<HTMLDivElement>();

  data.reduce((acc: any, d: any) => {
    const color: any = colorScaleEQ(d.count ? d.count : d.sum__num);
    if (acc[color]) {
      acc[color] += 1;
    } else {
      acc[color] = {};
      acc[color] = 1;
    }
    return acc;
  }, {});

  bins.reduce(
    (acc: string[], d: any, i: number, arr: any) =>
      i === arr.length - 1 ? [...acc, d[0], d[1]] : [...acc, d[0]],
    [],
  );

  const formatNum = (num: any) => {
    if (num) {
      const round: any = Number.parseFloat(
        num.count ? num.count : num.sum__num,
      ).toFixed(0);
      return round;
    }
    return 0;
  };
  useEffect(() => {
    // const root = rootElem.current as HTMLElement;
  });

  const legend = data.map((d: any, i: any) => (
    <div
      key={'legend-pt-' + i.toString()}
      className="colorBox wrapper"
      style={{
        backgroundColor: colors[i],
        flexBasis: (formatNum(data[i]) + devidedWidth).toString() + '%',
      }}
    >
      <div className="tooltip">
        {data[i].count ? data[i].count : data[i].sum__num}
      </div>
      <div
        className="tickNums ticksTop tickPointer"
        style={{ width: '100%', textAlign: 'center' }}
      >
        {data[i][data[i].count ? 'count' : 'sum__num'] === indicatorPosition ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Black_triangle.svg"
            style={{ width: '15px', height: '15px', margin: '-10px 50%' }}
            alt="pointer"
          />
        ) : (
          ''
        )}
      </div>
      <div
        className="tickNums tickBottom"
        style={{
          width: '100%',
          textAlign: 'center',
          bottom: data[i].metricvalue.length > 20 ? '-100px' : '-20px',
          fontSize: data[i].metricvalue.length > 20 ? '9px' : '9px',
        }}
      >
        <div>{data[i].metricvalue}</div>
      </div>
    </div>
  ));

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      <div className="legend-cont">{legend}</div>
    </Styles>
  );
}
