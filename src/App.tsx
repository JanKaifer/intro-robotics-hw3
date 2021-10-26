/**
 * This app is live at https://hw3.uvod-do-robotiky.school.kaifer.cz/
 */

import React, { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
// import nj from "numjs";

import "./App.css";
import { Slider, Stack } from "@mui/material";

type Point = [number, number, number];
// type Vector = nj.NdArray<number>;

const range = (n: number) => new Array(n).fill(0).map((_, i) => i);
// const v2a = (p: nj.NdArray) => [p.get(0), p.get(1), p.get(2)] as const;
// const a2v = (arr: [number, number, number]) => nj.array(arr);

const Canvas = ({
  ts,
  x,
  y,
  z,
}: {
  ts: number[];
  x: number;
  y: number;
  z: number;
}) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(300, 500, p5.WEBGL).parent(canvasParentRef);
    p5.colorMode(p5.RGB);
  };

  const t = ts[0];

  const draw = (p5: p5Types) => {
    const unit = 100;
    const l0 = 0.2 * unit;
    const q1 = 0.5 * t;
    const q2 = 0.5 + 0.3 * t * unit;
    const q3 = 2 - 0.25 * t * unit;

    const localChanges = (callback: () => void) => {
      p5.push();
      callback();
      p5.pop();
    };

    const drawPoint = () => {
      p5.sphere(2);
    };

    const drawLine = (target: Point) => {
      p5.line(0, 0, 0, ...target);
    };

    const doStep = (
      angleZ: number,
      moveZ: number,
      moveX: number,
      angleX: number
    ) => {
      p5.rotateZ(angleZ);
      drawLine([0, 0, moveZ]);
      p5.translate(0, 0, moveZ);
      drawPoint();
      p5.translate(moveX, 0, 0);
      p5.rotateX(angleX);
    };

    const drawArrow = (p: Point) => {
      drawLine(p);
    };

    const drawAxis = () => {
      drawArrow([0, 0, 100]);
      localChanges(() => {
        p5.stroke(255, 0, 0);
        drawArrow([100, 0, 0]);
      });
    };

    p5.background(255);
    p5.rotateX(p5.TWO_PI * 0.2);
    p5.rotateZ(p5.TWO_PI * 0.2);

    p5.rotateZ(p5.TWO_PI * z);
    p5.rotateX(p5.TWO_PI * x);
    p5.rotateY(p5.TWO_PI * y);
    p5.plane(200);

    drawPoint();
    doStep(0, l0, 0, 0);
    doStep(q1, 1, 0, 0);
    doStep(p5.PI, q2, 0, p5.HALF_PI * 3);
    doStep(0, q3, 0, 0);
  };

  return <Sketch setup={setup} draw={draw} />;
};

const MySlide = ({ val, setVal, min, max, step, name }: any) => {
  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <div
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <div style={{ paddingRight: 20, width: 100 }}>
          {name} = {val}
        </div>
        <Slider
          style={{ width: 100 }}
          value={val}
          onChange={(_: any, newVal: any) => setVal(newVal)}
          step={step}
          min={min}
          max={max}
        />
      </div>
    </Stack>
  );
};

const App = () => {
  const N = 6;
  const [ts, setTs] = useState(range(N));
  const getT = (n: number) => ts[n];
  const setT = (n: number) => (val: number) =>
    setTs((oldTs) => oldTs.map((oldVal, idx) => (idx === n ? val : oldVal)));

  const [z, setZ] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <div className="App">
      <div className="controls">
        <div className="control-box">
          <h3>Ovládání plošiny</h3>
          {range(N).map((idx) => (
            <MySlide
              key={idx}
              val={getT(idx)}
              setVal={setT(idx)}
              min={0}
              max={3}
              step={0.01}
              name={`joint-${idx + 1}`}
            />
          ))}
        </div>
        <div className="control-box">
          <h3>Ovládání kamery</h3>
          <MySlide val={z} setVal={setZ} min={0} max={1} step={0.01} name="z" />
          <MySlide val={x} setVal={setX} min={0} max={1} step={0.01} name="x" />
          <MySlide val={y} setVal={setY} min={0} max={1} step={0.01} name="y" />
        </div>
      </div>
      <Canvas ts={ts} z={z} x={x} y={y} />
    </div>
  );
};

export default App;
