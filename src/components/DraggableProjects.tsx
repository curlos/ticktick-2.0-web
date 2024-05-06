import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayToObjectByKey, containsEmoji } from '../utils/helpers.utils';
import { IProject } from '../interfaces/interfaces';
import Icon from './Icon';

const DraggableProjects = ({ projects }) => {
    // console.log(projects);
    const [items, setItems] = useState([...projects]);

    useEffect(() => {
        setItems(projects);
    }, [projects]);


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
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                    <SortableItem key={item._id} item={item}>
                        <ProjectItem project={item} />
                    </SortableItem>
                ))}
            </SortableContext>
        </DndContext>
    );
};

function SortableItem({ item, children }) {
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

export interface ProjectItemProps {
    project: IProject;
    projectsWithGroup?: Array<IProject>;
    insideFolder?: boolean;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, projectsWithGroup, insideFolder }) => {
    const { name, color, isFolder, projects } = project;
    const iconFill = isFolder ? 0 : 1;
    const iconName = isFolder ? 'folder' : 'menu';
    const emoji = containsEmoji(name) ? name.split(' ')[0] : null;
    const displayName = emoji ? name.split(' ')[1] : name;
    const numberOfTasks = 20;

    const formattedProjectsWithGroup = projectsWithGroup && arrayToObjectByKey(projectsWithGroup, '_id');
    const [showChildProjects, setShowChildProjects] = useState(true);

    return (
        <div>
            <div className={"p-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-color-gray-600 cursor-pointer" + (displayName === 'Hello Mobile' ? ' bg-color-gray-200' : '') + (insideFolder ? ' ml-3' : '')}>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0">
                        {isFolder && <Icon name={"chevron_right"} customClass={"text-white !text-[12px] ml-[-12px]"} fill={iconFill != undefined ? iconFill : 1} />}
                        {emoji ? emoji : (
                            <Icon name={iconName} customClass={"text-white !text-[22px]"} fill={iconFill != undefined ? iconFill : 1} />
                        )}
                    </div>
                    <div className="overflow-hidden text-nowrap text-ellipsis w-[130px]">{displayName}</div>
                </div>

                <div className="flex items-center ml-1 gap-3">
                    <div className="flex justify-end">
                        <div className={(!color ? 'hidden ' : '') + ' ' + `rounded-full w-[8px] h-[8px]`} style={{ backgroundColor: (color && !isFolder) ? color : 'transparent' }}></div>
                    </div>

                    {numberOfTasks ? (
                        <div className="text-color-gray-100">{numberOfTasks}</div>
                    ) : ''}
                </div>
            </div>

            {/* {isFolder && showChildProjects && projects && projects.map((projectId: string) => {
                const project = formattedProjectsWithGroup[projectId];

                return (
                    project ? (
                        <ProjectItem project={project} insideFolder={true} />
                    ) : null
                );
            })} */}
        </div>
    );
};

export default DraggableProjects;
