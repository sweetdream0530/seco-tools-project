import React, { useRef } from "react";
import {
    useDrag,
    useDrop,
    DragSourceMonitor,
} from "react-dnd";
import { XYCoord } from "dnd-core";

const ItemTypes = {
    CARD: "card",
} as const;

interface CardProps {
    children: React.ReactNode;
    index: number;
    columnIndex: number;
    moveCard: (
        dragColumnIndex: number,
        dragIndex: number,
        hoverColumnIndex: number,
        hoverIndex: number
    ) => void;
}

const style = {
    display: "flex",
    cursor: "move",
};

const FeatureItem: React.FC<CardProps> = ({
    index,
    columnIndex,
    children,
    moveCard,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: { index, columnIndex },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(
            item: { index: number; columnIndex: number },
            monitor
        ) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const dragColumnIndex = item.columnIndex;
            const hoverIndex = index;
            const hoverColumnIndex = columnIndex;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset() as XYCoord;

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            
            // Time to actually perform the action
            moveCard(dragColumnIndex, dragIndex, hoverColumnIndex, hoverIndex);

            // Note: mutating the monitor item here!
            item.index = hoverIndex;
            item.columnIndex = hoverColumnIndex;
        },
    });

    drag(drop(ref));

    const opacity = isDragging ? 0 : 1;

    return (
        <div ref={ref} style={{ ...style, opacity }}> {children}
        </div>
    );
};

export default FeatureItem;
