import { useState, useCallback, useRef } from "react";
import { produce } from "immer";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  const simulate = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        // traversing each cell of the grid
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;

            // Determining the neighbors for each cell
            operations.forEach(([x, y]) => {
              let newI = i + x;
              let newJ = j + y;

              // Making sure the neighbor is in boundaries
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                // if neighbor is alive i.e 1 it will add up
                neighbors += g[newI][newJ];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (gridCopy[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(simulate, 1000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setIsRunning(!isRunning);
          if (!isRunning) {
            runningRef.current = true;
            simulate();
          }
        }}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols},20px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i} - ${j}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "pink" : undefined,
                border: "1px solid black",
                cursor: "pointer",
              }}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
