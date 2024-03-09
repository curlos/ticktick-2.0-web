import Icon from "./Icon.component";


const ServiceMenu = () => {
    const iconCustomClass = "text-white !text-[24px]";

    return (
        <div className="bg-black h-full flex flex-col justify-between gap-10 h-screen pt-2 pb-3">
            <div>
                <div className="rounded-full bg-black p-2 mb-3">
                    <img src="/prestige-9-bo2.png" alt="user-icon" className="w-[35px] h-[35px]" />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <Icon name="check_box" customClass={iconCustomClass} />
                    {/* <Icon name="calendar_month" customClass={iconCustomClass} /> */}
                    {/* <Icon name="grid_view" customClass={iconCustomClass} /> */}
                    <Icon name="timer" customClass={iconCustomClass} />
                    {/* <Icon name="location_on" customClass={iconCustomClass} /> */}
                    {/* <Icon name="search" customClass={iconCustomClass} grad={200} /> */}
                </div>
            </div>

            {/* <div className="flex flex-col items-center gap-3">
                <Icon name="sync" customClass={iconCustomClass} grad={200} />
                <Icon name="notifications" customClass={iconCustomClass} />
                <Icon name="help" customClass={iconCustomClass} />
            </div> */}
        </div>
    );
};

export default ServiceMenu;