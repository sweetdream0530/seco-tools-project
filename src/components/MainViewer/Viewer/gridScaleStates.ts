import consts from "./consts";

export const gridScaleStates = [
    {
        maxDistance: 10,
        cellSize: consts.DEFAULT_GRID_CELL_SIZE,
        divisionsPerCell: consts.DEFAULT_GRID_DIVISIONS_PER_CELL,
        cellSizeSI: consts.DEFAULT_GRID_CELL_SIZE_SI,
        divisionsPerCellSI: consts.DEFAULT_GRID_DIVISIONS_PER_CELL_SI,
    },
    {
        maxDistance: 20,
        cellSize: consts.DEFAULT_GRID_CELL_SIZE,
        divisionsPerCell: consts.DEFAULT_GRID_DIVISIONS_PER_CELL / 2,
        cellSizeSI: consts.DEFAULT_GRID_CELL_SIZE_SI,
        divisionsPerCellSI: consts.DEFAULT_GRID_DIVISIONS_PER_CELL_SI / 2,
    },
    {
        maxDistance: 35,
        cellSize: consts.DEFAULT_GRID_CELL_SIZE,
        divisionsPerCell: consts.DEFAULT_GRID_DIVISIONS_PER_CELL / 4,
        cellSizeSI: consts.DEFAULT_GRID_CELL_SIZE_SI,
        divisionsPerCellSI: consts.DEFAULT_GRID_DIVISIONS_PER_CELL_SI / 4,
    },
    {
        maxDistance: 55,
        cellSize: consts.DEFAULT_GRID_CELL_SIZE * 2,
        divisionsPerCell: consts.DEFAULT_GRID_DIVISIONS_PER_CELL / 4,
        cellSizeSI: consts.DEFAULT_GRID_CELL_SIZE_SI * 2,
        divisionsPerCellSI: consts.DEFAULT_GRID_DIVISIONS_PER_CELL_SI / 4,
    },
    {
        maxDistance: 100,
        cellSize: consts.DEFAULT_GRID_CELL_SIZE * 4,
        divisionsPerCell: consts.DEFAULT_GRID_DIVISIONS_PER_CELL / 2,
        cellSizeSI: consts.DEFAULT_GRID_CELL_SIZE_SI * 4,
        divisionsPerCellSI: consts.DEFAULT_GRID_DIVISIONS_PER_CELL_SI / 2,
    },
    {
        maxDistance: Infinity,
        cellSize: consts.DEFAULT_GRID_CELL_SIZE * 8,
        divisionsPerCell: consts.DEFAULT_GRID_DIVISIONS_PER_CELL,
        cellSizeSI: consts.DEFAULT_GRID_CELL_SIZE_SI * 8,
        divisionsPerCellSI: consts.DEFAULT_GRID_DIVISIONS_PER_CELL_SI,
    },
];
