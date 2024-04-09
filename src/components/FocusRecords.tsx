import { useState } from "react";
import { formatTimeToHoursAndMinutes } from "../utils/helpers.utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Icon from "./Icon";

interface StatsOverviewProps {
    overviewData: object;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ overviewData }) => {
    const { todaysPomo, todaysFocus, totalPomo, totalFocusDuration } = overviewData;

    interface OverviewStatProps {
        title: string;
        value: number;
        convertToHoursAndMinutes?: boolean;
    }

    const OverviewStat: React.FC<OverviewStatProps> = ({ title, value, convertToHoursAndMinutes }) => {
        let shownValue: number | string = Number(value);

        if (convertToHoursAndMinutes) {
            const { hours, minutes } = formatTimeToHoursAndMinutes(value);

            shownValue = `${hours.toLocaleString()}h${minutes}m`;
        } else {
            shownValue = shownValue.toLocaleString();
        }
        return (
            <div className="bg-color-gray-600 rounded p-2">
                <h6 className="text-[12px] text-color-gray-100">{title}</h6>
                <div className="text-[22px]">{shownValue}</div>
            </div>
        );
    };

    return (
        <div className="p-5">
            <h3 className="text-[18px] font-bold mb-5">Overview</h3>

            <div className="grid grid-cols-2 gap-2">
                <OverviewStat title="Today's Pomo" value={todaysPomo} />
                <OverviewStat title="Today's Focus" value={todaysFocus} convertToHoursAndMinutes={true} />
                <OverviewStat title="Total Pomo" value={totalPomo} />
                <OverviewStat title="Total Focus Duration" value={totalFocusDuration} convertToHoursAndMinutes={true} />
            </div>
        </div>
    );
};

const FocusRecords = () => {
    const [overviewData, setOverviewData] = useState({
        todaysPomo: 3,
        todaysFocus: 7200000,
        totalPomo: 1143,
        totalFocusDuration: 50000000000
    });
    const [focusRecordList, setFocusRecordList] = useState([
        {
            _id: 1,
            name: "TickTick 2.0 (Web)",
            description: `# Honestly didn’t get too much done here. I did finish the rest of the UI for the focus settings modal but the CSS sliding animation for the checkboxes had me fussing over how the state is controlled for these checkboxes. They need to remain uncontrolled to have the animation.\n\nWill leave for this later after I finish more UI components. Want to finish as much Frontend as I can and then dive deep into backend.`,
            timeFocused: 2700000
        },
        {
            _id: 1,
            name: "TickTick 2.0 (Web)",
            description: `# Honestly didn’t get too much done here. I did finish the rest of the UI for the focus settings modal but the CSS sliding animation for the checkboxes had me fussing over how the state is controlled for these checkboxes. They need to remain uncontrolled to have the animation.`,
            timeFocused: 2700000
        },
        {
            _id: 1,
            name: "TickTick 2.0 (Web)",
            description: `# Honestly didn’t get too much done here. I did finish the rest of the UI for the focus settings modal but the CSS sliding animation for the checkboxes had me fussing over how the state is controlled for these checkboxes. They need to remain uncontrolled to have the animation.`,
            timeFocused: 2700000
        }
    ]);

    return (
        <div className="flex flex-col w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
            <StatsOverview overviewData={overviewData} />

            <div className="flex justify-between items-center px-5 mb-4">
                <h4 className="text-[18px]">Focus Record</h4>
                <Icon name="add" customClass={"!text-[20px] text-color-gray-100 cursor-pointer rounded hover:bg-color-gray-300"} />
            </div>

            <div className="text-[13px] px-5">
                <div className="text-color-gray-100 text-[13px] mb-3">April 7</div>

                {focusRecordList.map((focusRecord) => {
                    const { _id, name, description, timeFocused } = focusRecord;

                    return (
                        <li key={_id} className="relative m-0 list-none last:mb-[4px] mt-[24px]" style={{ minHeight: '54px' }}>
                            <div className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-blue-900" style={{ height: "calc(100% - 16px)" }}>
                            </div>

                            <div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
                                <div className="absolute left-[-40px] w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
                                    <Icon name="nutrition" customClass={"!text-[20px] text-blue-500 cursor-pointer"} fill={1} />
                                </div>

                                <div className="absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600 border-blue-500" style={{ top: '34px' }}>
                                </div>

                                <div>
                                    <div className="flex justify-between text-color-gray-100 text-[12px] mb-[6px]">
                                        <div>20:30 - 21:30</div>
                                        <div>45m</div>
                                    </div>
                                    <div className="font-medium">{name}</div>
                                    <div className="text-color-gray-100 mt-1">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {description}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </div>
        </div>
    );
};

export default FocusRecords;