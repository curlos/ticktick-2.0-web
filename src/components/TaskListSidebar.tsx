import { useEffect, useState } from "react";
import Icon from "./Icon";
import ModalAddList from "./Modal/ModalAddList";
import { IProject } from "../interfaces/interfaces";
import { arrayToObjectByKey, containsEmoji, fetchData } from "../utils/helpers.utils";
import { useDispatch, useSelector } from "react-redux";
import { useGetProjectsQuery } from "../services/api";
import { setProjectsToState } from "../slices/projectsSlice";
import DraggableProjects, { ProjectItem } from "./DraggableProjects";
import { SortableTree } from "./SortableTest/SortableTree";
import { SMART_LISTS } from "../utils/smartLists.utils";

const getNumberOfTasks = () => {

};


const TaskListSidebar = () => {


    const statusLists = [
        {
            name: "Completed",
            iconName: "check_box",
            iconFill: 0,
            numberOfTasks: 0
        },
        {
            name: "Won't Do",
            iconName: "close",
            iconFill: 0,
            numberOfTasks: 0
        },
        {
            name: "Trash",
            iconName: "delete",
            iconFill: 0,
            numberOfTasks: 0
        }
    ];

    const [isModalAddListOpen, setIsModalAddListOpen] = useState(false);
    const dispatch = useDispatch();
    const { data: fetchedProjects, isLoading, error } = useGetProjectsQuery();
    const projects = useSelector((state) => state.projects.projects);

    // Update Redux state with fetched tasks
    useEffect(() => {
        if (fetchedProjects) {
            const projectsWithId: Array<IProject> = fetchedProjects.map((project: IProject) => ({ ...project, id: project._id }));
            dispatch(setProjectsToState(projectsWithId));
        }
    }, [fetchedProjects, dispatch]); // Dependencies for useEffect

    const projectsWithNoGroup = projects && projects.filter((project) => !project.groupId);
    const projectsWithGroup = projects && projects.filter((project) => project.groupId);


    return (
        <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray p-4">
            <div>
                {Object.values(SMART_LISTS).map((project) => (
                    <ProjectItem key={project.name} project={project} isSmartList={true} />
                ))}
            </div>

            <hr className="my-3 border-color-gray-200 opacity-50" />

            <div className="">
                <div>
                    <div className="flex items-center justify-between py-1 pr-1 hover:bg-color-gray-600 rounded cursor-pointer">
                        <div className="flex items-center">
                            <Icon name={"chevron_right"} customClass={"text-color-gray-100 !text-[16px]"} />
                            <div className="text-color-gray-100">Lists</div>
                        </div>

                        <Icon name={"add"} customClass={"text-color-gray-100 !text-[16px] hover:text-white"} onClick={() => setIsModalAddListOpen(!isModalAddListOpen)} />
                    </div>

                    {/* <div>
                        {generalLists.map((listPropsAndValues, index) => (
                            <ListItem key={index} {...listPropsAndValues} />
                        ))}
                    </div> */}
                    {/* <div>
                        {projectsWithNoGroup.map((project, index) => (
                            <ProjectItem key={index} project={project} projectsWithGroup={projectsWithGroup} />
                        ))}
                    </div> */}

                    {/* TODO: Might have to bring this back later. */}
                    {/* <DraggableProjects projects={projects} /> */}

                    {projects.map((project) => (
                        <ProjectItem key={project._id} project={project} />
                    ))}

                    {/* <SortableTree collapsible indicator removable /> */}
                </div>

                <div className="pt-3">
                    <div className="p-2 text-color-gray-100">Filters</div>
                    <div className="p-2 rounded-lg text-color-gray-100 bg-color-gray-600 text-[12px]">Display tasks filtered by list, date, priority, tag, and more</div>
                </div>

                <div className="pt-3">
                    <div className="p-2 text-color-gray-100">Tags</div>
                    <div className="p-2 rounded-lg text-color-gray-100 bg-color-gray-600 text-[12px]">Categorize your tasks with tags. Quickly select a tag by typing "#" when adding a task</div>
                </div>
            </div>

            {/* <hr className="my-4 border-color-gray-100 opacity-50" />

            {statusLists.map((listPropsAndValues, index) => (
                <ListItem key={index} {...listPropsAndValues} />
            ))} */}

            <ModalAddList isModalOpen={isModalAddListOpen} setIsModalOpen={setIsModalAddListOpen} />
        </div>
    );
};

export default TaskListSidebar;