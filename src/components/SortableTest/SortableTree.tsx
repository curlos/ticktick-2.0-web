import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Announcements,
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  defaultDropAnimation,
  Modifier
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import {
  buildTree,
  flattenTree,
  getProjection,
  getChildCount,
  removeItem,
  removeChildrenOf,
  setProperty
} from "./utilities";
import type { FlattenedItem, SensorContext, TreeItems } from "./types";
// TODO: Bring this back to use when I want to work on Accessbility
import { sortableTreeKeyboardCoordinates } from "./keyboardCoordinates";
import { SortableTreeItem } from "./components";
import { useBulkEditTasksMutation, useDeleteTaskMutation, useGetTasksQuery } from "../../services/api";
import { getTasksWithFilledInChildren, getTasksWithNoParent, prepareForBulkEdit } from "../../utils/helpers.utils";
import { SMART_LISTS } from "../../utils/smartLists.utils";
import { useParams } from "react-router-dom";
import { TaskObj } from "../../interfaces/interfaces";

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always
  }
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5
};

interface Props {
  collapsible?: boolean;
  defaultItems?: TreeItems;
  tasksToUse: Array<TaskObj>;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
}

export function SortableTree({
  collapsible,
  defaultItems,
  tasksToUse,
  indicator,
  indentationWidth = 20,
  removable
}: Props) {
  const [items, setItems] = useState(defaultItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: string | null;
    overId: string;
  } | null>(null);

  const { projectId } = useParams();
  const { data: { tasks, tasksById }, isLoading: isTasksLoading, error } = useGetTasksQuery();
  const [bulkEditTasks] = useBulkEditTasksMutation();
  const [deleteTask] = useDeleteTaskMutation();
  // const [collapseAllByDefault, setCollapseAllByDefault] = useState(true)

  // TODO: Fix this. When I try to collapse a task, it does not collapse. This bug stops happening when I remove this useEffect so it has to do with this.
  useEffect(() => {
    if (isTasksLoading) {
      return;
    }

    // const tasksWithNoParent = getTasksWithNoParent(tasks, tasksById, projectId, isSmartListView);
    // setItems(tasksWithNoParent);
    const newChildTasks = getTasksWithFilledInChildren(tasksToUse, tasksById, projectId, true);
    setItems(newChildTasks);

    // For now the issue from above has been fixed with this piece of code. This is very unstable though as I haven't fully ran through all of the logic but we'll see.
    // TODO: This causes issues when projects with the same amount of "no parent" tasks will not change in items. However, if I take this code out then for some reason when I add a task and drag it to another task and try to collapse/uncollapse the other task, the collapsing function won't work for some reason. This will take a deeper look at dnd-kit, one of the most frustrating libraries I've ever used.
    // I think this has to do with the collapsed property.

    // if (tasksWithNoParent.length !== items.length) {
    // setItems(tasksWithNoParent);
    // }

  }, [tasks, isTasksLoading, projectId]);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);

  const projected =
    activeId && overId
      ? getProjection(
        flattenedItems,
        activeId,
        overId,
        offsetLeft,
        indentationWidth
      )
      : null;
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft
  });
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [
    flattenedItems
  ]);
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft
    };
  }, [flattenedItems, offsetLeft]);

  const announcements: Announcements = {
    onDragStart(id) {
      return `Picked up ${id}.`;
    },
    onDragMove(id, overId) {
      return getMovementAnnouncement("onDragMove", id, overId);
    },
    onDragOver(id, overId) {
      return getMovementAnnouncement("onDragOver", id, overId);
    },
    onDragEnd(id, overId) {
      return getMovementAnnouncement("onDragEnd", id, overId);
    },
    onDragCancel(id) {
      return `Moving was cancelled. ${id} was dropped in its original position.`;
    }
  };

  return (
    <DndContext
      announcements={announcements}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >

      {/* id, children, collapsed, depth */}
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map((item) => (
          <SortableTreeItem
            key={item.id}
            id={item.id}
            value={item.id}
            depth={item.id === activeId && projected ? projected.depth : item.depth}
            indentationWidth={indentationWidth}
            indicator={indicator}
            collapsed={Boolean(item.collapsed && item.children.length)}
            onCollapse={
              collapsible && item.children.length
                ? () => handleCollapse(item.id)
                : undefined
            }
            onRemove={removable ? () => handleRemove(item.id) : undefined}
            item={item}
          // onClick={() => console.log('hello world')}
          />
        ))}
        {createPortal(
          <DragOverlay
            dropAnimation={dropAnimation}
            modifiers={indicator ? [adjustTranslate] : undefined}
          >
            {activeId && activeItem ? (
              <SortableTreeItem
                id={activeId}
                depth={activeItem.depth}
                clone
                childCount={getChildCount(items, activeId) + 1}
                value={activeId}
                indentationWidth={indentationWidth}
                item={activeItem}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId
      });
    }

    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      // Transform the cloned array
      const transformedTasks = prepareForBulkEdit(newItems);
      bulkEditTasks(transformedTasks);

      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty("cursor", "");
  }

  function handleRemove(id: string) {
    deleteTask(id);
    setItems((items) => removeItem(items, id));
  }

  // TODO: This thing was causing problems before since it was being called twice and negating the initial collapse value change. Something to look into in the future but don't waste time looking at it now since I already spent a good 1h30m on it on May 18, 2024.
  function handleCollapse(id: string) {
    setItems((items) =>
      setProperty(items, id, "collapsed", (value) => {
        return !value;
      })
    );
  }

  function getMovementAnnouncement(
    eventName: string,
    activeId: string,
    overId?: string
  ) {
    if (overId && projected) {
      if (eventName !== "onDragEnd") {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
      const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: string | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25
  };
};
