import { Link } from "react-router-dom";
import IconsBar from "../components/IconsBar";
import { FaChevronLeft, FaArrowUpRightFromSquare, FaArrowUp, FaArrowDown, FaPlus, FaClock, FaChevronRight, FaChevronDown } from "react-icons/fa6";
import TaskList from "../components/TaskList";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Cell, Label, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

const sharedButtonStyle = `py-1 px-4 rounded-3xl cursor-pointer`;
const selectedButtonStyle = `${sharedButtonStyle} bg-[#3A2D20] text-[#F87A00] font-semibold`;
const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666]`;

const TopBar: React.FC = () => {

    return (
        <div className="flex justify-between items-center sticky top-0 py-6 bg-black z-10">
            {/* <Link to="/focus" className="cursor-pointer">
                <FaChevronLeft size={'20px'} color={'#999999'} />
            </Link> */}
            <FaChevronLeft size={'20px'} color={'#FFF'} className="cursor-pointer" onClick={() => history.back()} />

            <div className="flex gap-1 mx-[100px] text-[20px]">
                Focus Statistics
            </div>

            <div className="text-[#FE7C01]">
                <FaArrowUpRightFromSquare size={'20px'} color={'#FFF'} />
            </div>
        </div>
    );
};

const BasicFocusStats = () => (
    <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1A1A1A] rounded-lg p-4">
            <div className="text-[18px] font-semibold">Today's Pomo</div>
            <div className="text-[#555555] text-[14px] flex gap-1 items-center">
                <div>0 from yesterday</div>
                <FaArrowUp size={'12px'} color={'#0FA67E'} />
            </div>
            <div className="font-semibold text-[40px] text-[#FF7D00]">0</div>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-4">
            <div className="text-[18px] font-semibold">Today's Focus (h)</div>
            <div className="text-[#555555] text-[14px] flex gap-1 items-center">
                <div>2h19m from yesterday</div>
                <FaArrowDown size={'12px'} color={'#DE3030'} />
            </div>
            <div className="font-semibold text-[40px] text-[#FF7D00]">
                <span>0</span>
                <span className="text-[20px] ml-[2px] mr-[8px]">h</span>
                <span>0</span>
                <span className="text-[20px] ml-[2px]">m</span>
            </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-4">
            <div className="text-[18px] font-semibold">Total Pomos</div>
            <div className="font-semibold text-[32px] text-[#FF7D00] mt-2">1085</div>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-4">
            <div className="text-[18px] font-semibold">Total Focus Duration</div>
            <div className="font-semibold text-[32px] text-[#FF7D00] mt-2">
                <span>1880</span>
                <span className="text-[20px] ml-[2px] mr-[8px]">h</span>
                <span>55</span>
                <span className="text-[20px] ml-[2px]">m</span>
            </div>
        </div>
    </div>
);

const FocusRecordsPreview = () => (
    <div className="bg-[#1A1A1A] rounded-lg px-5 py-6">
        <div className="flex justify-between">
            <div>Focus Record</div>
            <FaPlus size={'20px'} color={'#FF7D00'} />
        </div>

        <div className="mt-4 flex gap-4">
            <div>
                <div className="bg-[#FF7D01] p-2 rounded-full">
                    <FaClock size={'15px'} color={'white'} />
                </div>
            </div>

            <div className="text-white rounded-lg w-full">
                <div className="flex gap-4 justify-between text-[#7C7C7C]">
                    <div className="flex gap-4">
                        <span className="text-white">Feb 23</span>
                        <span>3:13 PM - 3:58 PM</span>
                    </div>
                    <div>45m</div>
                </div>

                <div className="mt-2">
                    <div className="font-semibold">
                        <span>Project: TickTick 2.0 - Frontend</span>
                        <span className="text-[#7C7C7C] font-normal"> (Project: TickTick 2.0 - Frontend)</span>
                    </div>
                    <div className="text-[#7C7C7C]">Kept trying to sideload this app so I could have i...</div>
                </div>
            </div>
        </div>
    </div>
);

const data = [
    { name: 'Hello Mobile', value: 60 },
    { name: 'Side Projects', value: 19.5 },
    { name: 'Q Link Wireless', value: 1.5 },
    { name: 'Unclassified', value: 0.99 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ProgressBarProps {
    data: Array<any>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ data }) => {
    return (
        <div className="space-y-4">
            {data.map((item, index) => (
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <div>{item.name}</div>
                        <div className="text-[#8C8C8C]">{item.value} • {item.percentage}%</div>
                    </div>
                    <div key={index} className="w-full rounded-full dark:bg-[#232323]">
                        <div
                            className={`${item.color} text-xs font-medium text-blue-100 text-center p-[3px] leading-none rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const Details = () => {
    const [selectedButton, setSelectedButton] = useState('day');

    const PercentageProgess = () => (
        <div>
            <div className="flex justify-between items-center">
                <div>Hello Mobile</div>
                <div className="text-[#666666]">59h59m • 73.14%</div>
                <div></div>
            </div>
        </div>
    );

    const progressBarData = [
        { name: 'Hello Mobile', value: '59h59m', percentage: 73.14, color: 'bg-[#1F67E2]' },
        { name: 'Side Projects', value: '19h25m', percentage: 23.67, color: 'bg-[#3690E4]' },
        { name: 'Q Link Wireless', value: '1h38m', percentage: 1.99, color: 'bg-[#E69138]' },
        { name: 'Unclassified', value: '59m', percentage: 1.2, color: 'bg-[#FF7D00]' },
    ];

    return (
        <div className="bg-[#1A1A1A] rounded-lg px-5 py-6">
            <div className="flex items-center justify-between">
                <div className="text-[18px] font-semibold">Details</div>
                <div className="flex items-center gap-1">
                    <FaChevronLeft size={'16px'} color={'#FF7D00'} />
                    <div>Feb</div>
                    <FaChevronRight size={'16px'} color={'#FF7D00'} />
                </div>
            </div>

            <div className="mt-5 flex justify-center gap-1">
                <div className={selectedButton === 'day' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('day')}>Day</div>
                <div className={selectedButton === 'week' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('week')}>Week</div>
                <div className={selectedButton === 'month' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('month')}>Month</div>
                <div className={selectedButton === 'custom' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('custom')}>Custom</div>
            </div>

            <div className="flex justify-center">
                <PieChart width={600} height={250}>
                    <Pie
                        data={progressBarData}
                        cx={300}
                        cy={125}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="percentage"
                        label={(entry) => `${entry.value} (${entry.name})`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}

                        <Label value="82h1m" position="center" fill="white" className="text-[24px] font-bold" />
                    </Pie>
                </PieChart>
            </div>

            <div className="mt-3">
                <div className="flex justify-between items-center">
                    <div className="font-[500]">Focus Ranking</div>
                    <div className="flex items-center gap-2">
                        <div className="text-[#A3A3A3]">List</div>
                        <FaChevronDown size={'16px'} color={'#666666'} />
                    </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                    <ProgressBar data={progressBarData} />
                </div>
            </div>
        </div>
    );
};

const Trends = () => {
    const [selectedButton, setSelectedButton] = useState('day');

    return (
        <div className="bg-[#1A1A1A] rounded-lg px-5 py-6">
            <div className="flex items-center justify-between">
                <div className="text-[18px] font-semibold">Trends</div>
                <div className="flex items-center gap-1">
                    <FaChevronLeft size={'16px'} color={'#FF7D00'} />
                    <div>This Week</div>
                    <FaChevronRight size={'16px'} color={'#FF7D00'} />
                </div>
            </div>

            <div className="mt-5 flex justify-center gap-1">
                <div className={selectedButton === 'day' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('day')}>Day</div>
                <div className={selectedButton === 'week' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('week')}>Week</div>
                <div className={selectedButton === 'month' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('month')}>Month</div>
                <div className={selectedButton === 'custom' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('custom')}>Custom</div>
            </div>

            {/* Recharts chart */}
            <div>
                {/* <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Hello Mobile" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer> */}
            </div>

            <div className="flex justify-between items-center mt-6">
                <div className="text-[#9F9F9F] text-[18px]">Daily Average</div>
                <div className="text-white text-[28px]">4h3m</div>
            </div>
        </div>
    );
};

const DataGrids = () => {

    const today = new Date();

    function getRange(count) {
        return Array.from({ length: count }, (_, i) => i);
    }

    function shiftDate(date, numDays) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return newDate;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Example data format
    const randomValues = getRange(200).map(index => {
        return {
            date: shiftDate(today, -index),
            count: getRandomInt(1, 3),
        };
    });

    return (
        <div className="bg-[#1A1A1A] rounded-lg px-5 py-6">
            <div className="flex items-center justify-between">
                <div className="text-[18px] font-semibold">Year Grids</div>
                <div className="flex items-center gap-1">
                    <FaChevronLeft size={'16px'} color={'#FF7D00'} />
                    <div>2024</div>
                    <FaChevronRight size={'16px'} color={'#FF7D00'} />
                </div>
            </div>

            <div className="p-3">
                <CalendarHeatmap
                    startDate={shiftDate(today, -365)}
                    endDate={today}
                    values={randomValues}
                    classForValue={value => {
                        if (!value) {
                            return 'color-empty';
                        }
                        return `color-github-${value.count}`;
                    }}
                    tooltipDataAttrs={(value) => {
                        return {
                            'data-tooltip-id': value ? "my-tooltip" : "",
                            'data-tooltip-content': value ? `${value.date} has count: ${value.count}` : "",
                        };
                    }}
                    gutterSize={1}
                    onClick={value => alert(`Clicked on value with count: ${value.count}`)}
                />
                <ReactTooltip id="my-tooltip" />
            </div>
        </div>
    );
};

const FocusStatsPage = () => {

    return (
        <div className="w-h-screen min-h-screen flex flex-col items-center bg-black text-white">
            <div className="flex flex-col flex-1 container">
                <TopBar />

                <div className="flex flex-col gap-3">
                    <BasicFocusStats />
                    <FocusRecordsPreview />
                    <Details />
                    {/* <Trends /> */}
                    {/* <DataGrids /> */}
                </div>

            </div>

            {/* <IconsBar /> */}
        </div>
    );
};

export default FocusStatsPage;