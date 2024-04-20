import Dropdown from "./Dropdown";
import Icon from "../Icon";
import { DropdownProps } from "../../interfaces/interfaces";

interface DropdownListsProps extends DropdownProps {
    selectedList: string;
    setSelectedList: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownLists: React.FC<DropdownListsProps> = ({
    toggleRef, isVisible, setIsVisible, selectedList, setSelectedList
}) => {

    interface ListOptionProps {
        list: Object;
    }

    const ListOption: React.FC<ListOptionProps> = ({ list }) => {
        const { name } = list;

        return (
            <div
                className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 p-2 rounded-lg"
                onClick={() => {
                    setSelectedList(name);
                    setIsVisible(false);
                }}
            >
                <div className="flex items-center gap-1">
                    <Icon name="menu" customClass={`!text-[22px] hover:text-white cursor-p`} />
                    {name}
                </div>
                {selectedList === name && (
                    <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />
                )}
            </div>
        );
    };

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

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' ml-[-13px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[200px]">
                <div>
                    {generalLists.map((list) => (
                        <ListOption key={list.name} list={list} />
                    ))}
                </div>
            </div>
        </Dropdown>
    );
};

export default DropdownLists;