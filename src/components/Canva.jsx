import React, { useState } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";

const Canva = () => {
  const [tool, setTool] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [resizing, setResizing] = useState(false);

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();

    if (tool === "select") {
      const shape = e.target;
      if (
        shape.getClassName() === "Rect" ||
        shape.getClassName() === "Circle"
      ) {
        setSelectedShape(shape);
        setResizing(true);
      } else {
        setSelectedShape(null);
        setResizing(false);
      }
    } else {
      switch (tool) {
        case "line":
          setShapes([
            ...shapes,
            {
              type: "line",
              points: [position.x, position.y, position.x, position.y],
            },
          ]);
          break;
        case "rectangle":
          setShapes([
            ...shapes,
            {
              type: "rectangle",
              x: position.x,
              y: position.y,
              width: 0,
              height: 0,
            },
          ]);
          break;
        case "circle":
          setShapes([
            ...shapes,
            { type: "circle", x: position.x, y: position.y, radius: 0 },
          ]);
          break;
        default:
          break;
      }
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();

    if (resizing && selectedShape) {
      const shape = selectedShape;

      if (shape.getClassName() === "Rect") {
        const newWidth = position.x - shape.x();
        const newHeight = position.y - shape.y();
        shape.width(newWidth);
        shape.height(newHeight);
      } else if (shape.getClassName() === "Circle") {
        const radiusX = Math.abs(position.x - shape.x());
        const radiusY = Math.abs(position.y - shape.y());
        const newRadius = Math.max(radiusX, radiusY);
        shape.radius(newRadius);
      }

      stage.batchDraw();
    } else {
      const index = shapes.length - 1;
      const newShapes = shapes.slice();

      switch (tool) {
        case "line":
          if (index >= 0 && newShapes[index].type === "line") {
            newShapes[index].points[2] = position.x;
            newShapes[index].points[3] = position.y;
          }
          break;
        case "rectangle":
          if (index >= 0 && newShapes[index].type === "rectangle") {
            newShapes[index].width = position.x - newShapes[index].x;
            newShapes[index].height = position.y - newShapes[index].y;
          }
          break;
        case "circle":
          if (index >= 0 && newShapes[index].type === "circle") {
            const radiusX = Math.abs(position.x - newShapes[index].x);
            const radiusY = Math.abs(position.y - newShapes[index].y);
            newShapes[index].radius = Math.max(radiusX, radiusY);
          }
          break;
        default:
          break;
      }

      setShapes(newShapes);
    }
  };

  const handleMouseUp = () => {
    if (tool === "select") {
      setResizing(false);
    } else {
      setTool(null);
    }
  };

  const handleDeleteShape = () => {
    if (selectedShape) {
      const index = shapes.findIndex((shape) => shape.id === selectedShape.id);
      const newShapes = shapes.slice();
      newShapes.splice(index, 1);
      setShapes(newShapes);
      setSelectedShape(null);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <button className="button" onClick={() => setTool("line")}>
          Draw Line
        </button>
        <button className="button" onClick={() => setTool("rectangle")}>
          Draw Rectangle
        </button>
        <button className="button" onClick={() => setTool("circle")}>
          Draw Circle
        </button>
        <button className="button" onClick={() => setTool("select")}>
          Select
        </button>
        <button className="button" onClick={handleDeleteShape}>
          Delete
        </button>
      </div>
      <div className="canvas-container">
        <Stage
          width={2000}
          height={1500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {shapes.map((shape, index) => (
              <React.Fragment key={index}>
                {shape.type === "line" && (
                  <Line
                    points={shape.points}
                    stroke="black"
                    strokeWidth={2}
                    draggable={tool === "select"}
                    onMouseDown={(e) => handleMouseDown(e)}
                  />
                )}
                {shape.type === "rectangle" && (
                  <Rect
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    stroke="black"
                    strokeWidth={2}
                    draggable={tool === "select"}
                    onMouseDown={(e) => handleMouseDown(e)}
                  />
                )}
                {shape.type === "circle" && (
                  <Circle
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke="black"
                    strokeWidth={2}
                    draggable={tool === "select"}
                    onMouseDown={(e) => handleMouseDown(e)}
                  />
                )}
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canva;
