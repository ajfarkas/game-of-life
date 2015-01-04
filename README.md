Conway's Game of Life
=====================

A web application to run Conway's Game of Life. 

## Rules

  1. Any living cell with less than 2 neighbors dies as if by underpopulation.
  2. Any living cell with more than 3 neighbors dies as if by overpopulation.
  3. Any empty cell with exactly 3 neighbors becomes alive as if by reproduction.
  4. All other cells remain in their current state.

## Notes

Each cell is clickable to make it "alive" or "dead". 

The `Start` button begins the program, at which point cells are no longer clickable.

The `Stop` button pauses the program, which can be resumed with the `Start` button.

The `Reset` button resets the program and sets the cells to their default states (which includes five "alive" cells, for demonstration). The cells are clickable again.

