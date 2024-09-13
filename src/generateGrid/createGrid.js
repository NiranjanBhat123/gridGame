import fs from "fs";
import { gridData } from "./gridData.js";

function findMaxGold(i, j, grid, visited) {
  const n = 8,
    m = 8;
  if (
    i < 0 ||
    j < 0 ||
    i >= n ||
    j >= m ||
    visited[i][j] ||
    grid[i][j] === -1
  ) {
    return -1e7;
  }
  if (i === n - 1 && j === m - 1) {
    return grid[i][j];
  }
  visited[i][j] = 1;
  const up = grid[i][j] + findMaxGold(i - 1, j, grid, visited);
  const down = grid[i][j] + findMaxGold(i + 1, j, grid, visited);
  const left = grid[i][j] + findMaxGold(i, j - 1, grid, visited);
  const right = grid[i][j] + findMaxGold(i, j + 1, grid, visited);
  visited[i][j] = 0;
  return Math.max(up, down, left, right);
}

function maxGold(gold, obstacles) {
  const grid = Array(8)
    .fill()
    .map(() => Array(8).fill(0));
  gold.forEach(([x, y]) => (grid[x][y] = 1));
  obstacles.forEach(([x, y]) => (grid[x][y] = -1));
  const visited = Array(8)
    .fill()
    .map(() => Array(8).fill(0));
  return findMaxGold(0, 0, grid, visited);
}

function generateCoordinates(count, occupied) {
  const coordinates = [];
  while (coordinates.length < count) {
    const x = Math.floor(Math.random() * 8);
    const y = Math.floor(Math.random() * 8);
    const point = [x, y];
    if (
      (x !== 0 || y !== 0) &&
      (x !== 7 || y !== 7) &&
      !occupied.has(JSON.stringify(point))
    ) {
      coordinates.push(point);
      occupied.add(JSON.stringify(point));
    }
  }
  return coordinates;
}

function main() {
  const occupied = new Set();
  const gold = generateCoordinates(10, occupied);
  const obstacles = generateCoordinates(10, occupied);

  const result = maxGold(gold, obstacles);

  console.log("Max gold:", result);

  const newData = {
    maxGold: result,
    gold: gold.map(([x, y]) => ({ x, y })),
    obstacles: obstacles.map(([x, y]) => ({ x, y })),
  };

  gridData.push(newData);

  const updatedContent = `let gridData = ${JSON.stringify(
    gridData,
    null,
    2
  )};\n\nexport {gridData}`;
  fs.writeFileSync("gridData.js", updatedContent);

  console.log("Data successfully appended to gridData.js");
}

main();
















