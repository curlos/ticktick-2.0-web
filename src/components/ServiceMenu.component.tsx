import Icon from "./Icon.component";


const ServiceMenu = () => {
    return (
        <div className="bg-black h-full flex flex-col justify-between gap-10 h-screen pt-2 pb-3">
            <div>
                <div className="rounded-full bg-black p-2 mb-3">
                    <img src="/prestige-9-bo2.png" alt="user-icon" className="w-[35px] h-[35px]" />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <Icon name="check_box" customClass={"text-white !text-[28px]"} />
                    <Icon name="calendar_month" customClass={"text-white !text-[28px]"} />
                    <Icon name="grid_view" customClass={"text-white !text-[28px]"} />
                    <Icon name="timer" customClass={"text-white !text-[28px]"} />
                    <Icon name="location_on" customClass={"text-white !text-[28px]"} />
                    <Icon name="search" customClass={"text-white !text-[28px]"} grad={200} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <Icon name="sync" customClass={"text-white !text-[28px]"} grad={200} />
                <Icon name="notifications" customClass={"text-white !text-[28px]"} />
                <Icon name="help" customClass={"text-white !text-[28px]"} />
            </div>
        </div>
    );
};

export default ServiceMenu;