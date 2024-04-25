import React, { useEffect, useState } from 'react';
import {
    DndContext, closestCenter,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProjectItem } from './TaskListSidebar';

const DraggableList = ({ items, setItems, children }) => {

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 6,
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                    <SortableItem key={item} item={item}>
                        <ProjectItem project={item} />
                    </SortableItem>
                ))}
            </SortableContext>
        </DndContext>
    );
};

export function SortableItem({ item, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export default DraggableList;
