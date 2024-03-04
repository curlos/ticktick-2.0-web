import Icon from "./Icon.component";

interface ListItemProps {
    name: string;
    iconName: string;
    iconFill?: number;
    numberOfTasks: number;
    listColor?: string;
    folder?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ name, iconName, iconFill, numberOfTasks, listColor, folder }) => (
    <div className="p-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-color-medium-gray">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0">
                {folder && <Icon name={"chevron_right"} customClass={"text-white !text-[12px] ml-[-12px]"} fill={iconFill != undefined ? iconFill : 1} />}
                <Icon name={iconName} customClass={"text-white !text-[22px]"} fill={iconFill != undefined ? iconFill : 1} />
            </div>
            <div className="overflow-hidden text-nowrap text-ellipsis w-[130px]">{name}</div>
            <div className={(!listColor ? 'hidden ' : '') + ' ' + `rounded-full w-[8px] h-[8px] ${listColor ? `bg-[${listColor}]` : ''} ml-1 mr-3`}></div>
        </div>

        <div className="text-color-light-gray">{numberOfTasks}</div>
    </div>
);


const TaskListSidebar = () => {
    return (
        <div className="w-full h-full bg-color-gray p-4">
            <div>
                <ListItem name="All" iconName="mail" numberOfTasks={623} />
                <ListItem name="Today" iconName="mail" numberOfTasks={2} />
                <ListItem name="Tomorrow" iconName="mail" numberOfTasks={1} />
                <ListItem name="Next 7 Days" iconName="mail" numberOfTasks={3} />
                <ListItem name="Inbox" iconName="mail" numberOfTasks={26} />
            </div>

            <hr className="my-3 border-color-light-gray opacity-50" />

            <div className="">
                <div className="p-2 text-color-light-gray">Lists</div>

                <div>
                    <ListItem name="Best Practices (roadmap.sh)" iconName="menu" numberOfTasks={623} listColor="rgb(210,119,98)" />
                    <ListItem name="Frontend Developer Roadmap 2024" iconName="menu" numberOfTasks={2} listColor="rgb(173,148,199)" />
                    <ListItem name="GreatFrontEnd" iconName="folder" iconFill={0} numberOfTasks={1} folder={true} />
                    <ListItem name="Hello Mobile" iconName="menu" numberOfTasks={3} listColor="rgb(31,103,226)" />
                    <ListItem name="My 2024 Goals" iconName="mail" numberOfTasks={26} />
                </div>
            </div>
        </div>
    );
};

export default TaskListSidebar;