import { useEffect, useState } from "react";
import Icon from "./Icon";
import ModalAddList from "./Modal/ModalAddList";
import { IProject } from "../interfaces/interfaces";
import { arrayToObjectByKey, containsEmoji, fetchData } from "../utils/helpers.utils";
import { useDispatch, useSelector } from "react-redux";
import { useGetProjectsQuery } from "../services/api";
import { setProjectsToState } from "../slices/projectsSlice";
import DraggableProjects from "./DraggableProjects";


const TaskListSidebar = () => {
    const [selected, setSelected] = useState("Hello Mobile");

    const topLists = [
        {
            name: "All",
            iconName: "mail",
            numberOfTasks: 623
        },
        {
            name: "Today",
            iconName: "mail",
            numberOfTasks: 2
        },
        {
            name: "Tomorrow",
            iconName: "mail",
            numberOfTasks: 1
        },
        {
            name: "Next 7 Days",
            iconName: "mail",
            numberOfTasks: 3
        },
        {
            name: "Inbox",
            iconName: "mail",
            numberOfTasks: 26
        }
    ];

    const generalLists = [
        {
            name: "Best Practices (roadmap.sh)",
            iconName: "menu",
            numberOfTasks: 623,
            listColor: "rgb(210,119,98)"
        },
        {
            name: "Frontend Developer Roadmap 2024",
            iconName: "menu",
            numberOfTasks: 2,
            listColor: "rgb(173,148,199)"
        },
        {
            name: "GreatFrontEnd",
            iconName: "folder",
            iconFill: 0,
            numberOfTasks: 1,
            folder: true
        },
        {
            name: "Hello Mobile",
            iconName: "menu",
            numberOfTasks: 3,
            listColor: "rgb(31,103,226)"
        },
        {
            name: "My 2024 Goals",
            iconName: "",
            emoji: "🎯",
            numberOfTasks: 26
        },
        {
            name: "Hobbies & Interests",
            iconName: "folder",
            iconFill: 0,
            numberOfTasks: 137,
            folder: true
        },
        {
            name: "Tech Interview Prep",
            iconName: "folder",
            iconFill: 0,
            numberOfTasks: 27,
            folder: true
        },
        {
            name: "Side Projects",
            iconName: "menu",
            numberOfTasks: 144,
            listColor: "rgb(210,119,98)"
        },
        {
            name: "Q Link Wireless",
            iconName: "menu",
            numberOfTasks: 2,
            listColor: "rgb(210,119,98)"
        },
        {
            name: "Archived Lists",
            iconName: "folder_limited",
            iconFill: 0,
            numberOfTasks: 0,
            folder: true
        }
    ];

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
    const { data: fetchedProjects, isLoading, error } = useGetProjectsQuery(); // Fetch tasks from the API
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
            {/* <div>
                {topLists.map((listPropsAndValues, index) => (
                    <ListItem key={index} {...listPropsAndValues} />
                ))}
            </div>

            <hr className="my-3 border-color-gray-200 opacity-50" /> */}

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
                    <DraggableProjects projects={projects} />
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