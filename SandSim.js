function make2DArray(cols, rows)
{
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++)
    {
        arr[i] = new Array(rows);
        // Fill the array with 0s
        for (let j = 0; j < rows; j++)
        {
            arr[i][j] = 0;
        }
    }
    return arr;
}

let grid;
let velocityGrid;
let sandWidth = 5;
let cols, rows;
let hueValue = 200;
let gravity = 0.1;
let inputSandWidth = 5;

// Check if a row is within the bounds
function withinCols(i)
{
    return i >= 0 && i <= cols - 1;
}

// Check if a column is within the bounds
function withinRows(j)
{
    return j >= 0 && j <= rows - 1;
}

function setup()
{
    createCanvas(600, 500);
    colorMode(HSB, 360, 255, 255);
    cols = width / sandWidth;
    rows = height / sandWidth;
    grid = make2DArray(cols, rows);
    velocityGrid = make2DArray(cols, rows);
}

function draw()
{
    background(0);

    if (mouseIsPressed)
    {
        let mouseCol = floor(mouseX / sandWidth);
        let mouseRow = floor(mouseY / sandWidth);

        let bound = floor(inputSandWidth / 2);
        // Randomly add an area of sand particles
        for (let i = -bound; i <= bound; i++)
        {
            for (let j = -bound; j < bound; j++)
            {
                if (random(1) < 0.75)
                {
                    let col = mouseCol + i;
                    let row = mouseRow + j;
                    if (withinCols(col) && withinRows(row))
                    {
                        grid[col][row] = hueValue;
                        velocityGrid[col][row] = 1;
                    }
                }
            }
        }
        // Change the color of the sand over time
        hueValue += 0.5;
        if (hueValue > 360)
        {
            hueValue = 1;
        }
    }

    // Draw the sand
    for (let i = 0; i < cols; i++)
    {
        for (let j = 0; j < rows; j++)
        {
            noStroke();
            if (grid[i][j] > 0)
            {
                fill(grid[i][j], 255, 255);
                let x = i * sandWidth;
                let y = j * sandWidth;
                square(x, y, sandWidth);
            }
        }
    }

    // Create a 2D array for the next frame of animation
    let nextGrid = make2DArray(cols, rows);
    let nextVelocityGrid = make2DArray(cols, rows);

    // Check every cell
    for (let i = 0; i < cols; i++)
    {
        for (let j = 0; j < rows; j++)
        {
            let currentPixel = grid[i][j];
            let velocity = velocityGrid[i][j];
            let moved = false;
            if (currentPixel > 0)
            {
                let newPos = int(j + velocity);
                for (let y = newPos; y > j; y--)
                {
                    let below = grid[i][y];
                    let dir = 1;
                    if (random(1) < 0.5)
                    {
                        dir *= -1;
                    }
                    let belowRight = -1;
                    let belowLeft = -1;
                    if (withinCols(i + dir)) belowRight = grid[i + dir][y];
                    if (withinCols(i - dir)) belowLeft = grid[i - dir][y];
                    if (below === 0)
                    {
                        nextGrid[i][y] = currentPixel;
                        nextVelocityGrid[i][y] = velocity + gravity;
                        moved = true;
                        break;
                    }
                    else if (belowRight === 0)
                    {
                        nextGrid[i + dir][y] = currentPixel;
                        nextVelocityGrid[i + dir][y] = velocity + gravity;
                        moved = true;
                        break;
                    }
                    else if (belowLeft === 0)
                    {
                        nextGrid[i - dir][y] = currentPixel;
                        nextVelocityGrid[i - dir][y] = velocity + gravity;
                        moved = true;
                        break;
                    }
                }
            }
            if (currentPixel > 0 && !moved)
            {
                nextGrid[i][j] = grid[i][j];
                nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
            }
        }
    }
    grid = nextGrid;
    velocityGrid = nextVelocityGrid;
}

