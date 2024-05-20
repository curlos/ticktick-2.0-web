import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Icon from "./Icon";
import DropdownCalendar from "./Dropdown/DropdownCalendar";
import TextareaAutosize from 'react-textarea-autosize';
import DropdownPriorities from "./Dropdown/DropdownPriorities";
import { PRIORITIES } from "../utils/priorities.utils";
import { addTask } from "../slices/tasksSlice";
import DropdownProjects from "./Dropdown/DropdownProjects";
import { useAddTaskMutation, useGetProjectsQuery } from "../services/api";
import { SMART_LISTS } from "../utils/smartLists.utils";
import { useParams } from "react-router";
import classNames from "classnames";
import TaskDueDateText from "./TaskDueDateText";

interface AddTaskFormProps {
    setShowAddTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
    parentId: string;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ setShowAddTaskForm, parentId }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const { projectId } = params;

    const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
    const { projects } = fetchedProjects || {};
    const [addTask, { isLoading, error }] = useAddTaskMutation();

    // useState
    const [title, setTitle] = useState('');
    const [focused, setFocused] = useState(false);
    const [currDueDate, setCurrDueDate] = useState(null);
    const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);
    const [isDropdownPrioritiesVisible, setIsDropdownPrioritiesVisible] = useState(false);
    const [isDropdownListsVisible, setIsDropdownListsVisible] = useState(false);
    const [tempSelectedPriority, setTempSelectedPriority] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const [description, setDescription] = useState('');

    // useRef
    const dropdownCalendarToggleRef = useRef(null);
    const dropdownPrioritiesRef = useRef(null);
    const dropdownListsRef = useRef(null);

    const priority = PRIORITIES[tempSelectedPriority];

    useEffect(() => {
        if (isLoadingProjects) {
            return;
        }

        const inSmartListView = SMART_LISTS[projectId];

        if (projectId) {
            // If in a project that is not a smart list, then the default selected project in the add task form should be the project we're currently in.
            if (!inSmartListView) {
                setSelectedProject(projects.find((project) => project._id === projectId));
            } else {
                setSelectedProject(projects[0]);
                setCurrDueDate(SMART_LISTS[projectId].getDefaultDueDate());
            }
        } else {
            setSelectedProject(projects[0]);
        }

    }, [fetchedProjects, projectId]);

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!title) {
            return null;
        }

        const payload = {
            title,
            description,
            priority: priority && priority.backendValue,
            projectId: selectedProject._id,
            dueDate: currDueDate
        };

        try {
            await addTask({ payload, parentId });

            setTitle('');
            setDescription('');
            setCurrDueDate(null);
            // setPriority({
            //     name: 'No Priority',
            //     backendValue: 'none',
            //     flagColor: '#7B7B7B'
            // });

            setShowAddTaskForm(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form
                className={"mt-3 gap-1 bg-color-gray-600 rounded-lg border" + (focused ? ' border-blue-500' : ' border-transparent')}
                onSubmit={handleAddTask}
            >
                <div className="p-3 pb-1">
                    <TextareaAutosize className="text-[16px] placeholder:text-[#7C7C7C] font-bold mb-0 bg-transparent w-full outline-none resize-none" placeholder="Task name" value={title} onChange={(e) => setTitle(e.target.value)}></TextareaAutosize>
                    <TextareaAutosize className="text-[14px] placeholder:text-[#7C7C7C] bg-transparent w-full outline-none resize-none" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></TextareaAutosize>

                    <div className="flex gap-2 mt-3">
                        <div className="text-[14px] flex items-center gap-1 text-color-gray-100 p-1 border border-color-gray-100 rounded-md relative">

                            <div ref={dropdownCalendarToggleRef} onClick={() => setIsDropdownCalendarVisible(!isDropdownCalendarVisible)}>
                                <TaskDueDateText dueDate={currDueDate} showCalendarIcon={true} />
                            </div>

                            <DropdownCalendar toggleRef={dropdownCalendarToggleRef} isVisible={isDropdownCalendarVisible} setIsVisible={setIsDropdownCalendarVisible} currDueDate={currDueDate} setCurrDueDate={setCurrDueDate} />
                        </div>

                        <div className="text-[14px] text-color-gray-100 p-1 border border-color-gray-100 rounded-md relative">
                            <div ref={dropdownPrioritiesRef} onClick={() => setIsDropdownPrioritiesVisible(!isDropdownPrioritiesVisible)} className="cursor-pointer">
                                {tempSelectedPriority === 0 ? (
                                    <div className="flex items-center gap-1">
                                        <Icon name="calendar_month" customClass={"!text-[16px] hover:text-white"} />
                                        Priority
                                    </div>
                                ) : (
                                    <div className={classNames(
                                        "flex items-center gap-1",
                                        priority.textFlagColor
                                    )}>
                                        <Icon name="flag" customClass={"!text-[22px] cursor-pointer"} />
                                        {priority.name}
                                    </div>
                                )}
                            </div>

                            <DropdownPriorities
                                toggleRef={dropdownPrioritiesRef}
                                isVisible={isDropdownPrioritiesVisible}
                                setIsVisible={setIsDropdownPrioritiesVisible}
                                priority={tempSelectedPriority}
                                setPriority={setTempSelectedPriority}
                            />

                        </div>
                    </div>
                </div>

                <hr className="border-color-gray-200 my-1" />

                <div className="p-2 pt-1 flex justify-between items-center">
                    {!isLoadingProjects && (
                        <div className="relative">
                            <div ref={dropdownListsRef} className="flex items-center gap-1 font-bold text-[12px] cursor-pointer" onClick={() => setIsDropdownListsVisible(!isDropdownListsVisible)}>
                                {selectedProject?.name}
                                <Icon name="expand_more" customClass={"!text-[16px] hover:text-white"} />
                            </div>

                            <DropdownProjects toggleRef={dropdownListsRef} isVisible={isDropdownListsVisible} setIsVisible={setIsDropdownListsVisible} selectedProject={selectedProject} setSelectedProject={setSelectedProject} projects={projects} />
                        </div>
                    )}

                    <div className="space-x-2">
                        <button className="border border-color-gray-200 rounded-md py-1 cursor-pointer hover:bg-color-gray-200 p-3" onClick={() => setShowAddTaskForm(false)}>Cancel</button>
                        <button type="submit" className="bg-blue-500 rounded-md py-1 cursor-pointer hover:bg-blue-600 p-3">Add task</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddTaskForm;