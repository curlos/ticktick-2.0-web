import { PieChart, Pie, Cell, Label } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useRef, useState } from 'react';
import ModalPickDateRange from './ModalPickDateRange';
import DropdownFocusRankingList from './DropdownFocusRankingList';
import ProgressBar from './ProgressBar';
import DateRangePicker from './DateRangePicker';

const DetailsCard = () => {
	const progressBarData = [
		{ name: 'Hello Mobile', value: '426h28m', percentage: 53.47, color: '#3b82f6' },
		{ name: 'Side Projects', value: '246h33m', percentage: 30.91, color: '#dc2626' },
		{ name: 'GUNPLA', value: '42h12m', percentage: 5.29, color: '#7e22ce' },
		{ name: 'Q Link Wireless', value: '23h47m', percentage: 5.29, color: '#f97316' },
		{ name: 'GFE - Handbook', value: '16h21m', percentage: 2.05, color: '#2dd4bf' },
	];

	const selectedOptions = ['List', 'Tag', 'Task'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState(selectedIntervalOptions[0]);
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-full">
			<div className="flex justify-between items-center">
				<h3 className="font-bold text-[16px]">Details</h3>

				<div className="flex items-center gap-4">
					<GeneralSelectButtonAndDropdown
						selected={selected}
						setSelected={setSelected}
						selectedOptions={selectedOptions}
					/>

					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={setSelectedInterval}
						selectedOptions={selectedIntervalOptions}
						onClick={(name) => {
							if (name?.toLowerCase() !== 'custom') {
								return;
							}

							setIsModalPickDateRangeOpen(true);
						}}
					/>

					<DateRangePicker
						selectedDates={selectedDates}
						setSelectedDates={setSelectedDates}
						selectedInterval={selectedInterval}
						startDate={startDate}
						endDate={endDate}
					/>
				</div>
			</div>

			<div className="flex-1 mt-2 flex items-center gap-10 px-4">
				<div>
					<PieChart width={220} height={220}>
						<Pie
							data={progressBarData}
							cx={100}
							cy={100}
							innerRadius={85}
							outerRadius={100}
							paddingAngle={5}
							dataKey="percentage"
						>
							{progressBarData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
							))}

							<Label
								position="center"
								fill="white"
								content={({ viewBox }) => {
									const { cx, cy } = viewBox;

									// In Recharts, the Label component inside a Pie (or other chart types) does not support rendering HTML elements such as <div> directly because it operates within an SVG context. This is why "svg" elements like "<text>" are used instead to display the HTML elements.

									return (
										<g>
											<text
												x={cx}
												y={cy - 10}
												fill="white"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[24px] font-bold"
											>
												797h39m
											</text>
											<text
												x={cx}
												y={cy + 15}
												fill="#aaa"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[14px]"
											>
												Focus Duration
											</text>
										</g>
									);
								}}
							/>
							{/* <CustomLabel value="50%" /> */}
						</Pie>
					</PieChart>
				</div>

				<div className="mt-3 flex flex-col gap-2 w-full">
					<ProgressBarList data={progressBarData} />
				</div>
			</div>

			<ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/>
		</div>
	);
};

interface ProgressBarListProps {
	data: Array<any>;
}

const ProgressBarList: React.FC<ProgressBarListProps> = ({ data }) => {
	const dropdownFocusRankingListRef = useRef(null);
	const [isDropdownFocusRankingListVisible, setIsDropdownFocusRankingListVisible] = useState(false);

	return (
		<div className="space-y-4 w-full">
			{data.map((item) => (
				<ProgressBar item={item} />
			))}

			<div className="relative">
				<div
					ref={dropdownFocusRankingListRef}
					onClick={() => setIsDropdownFocusRankingListVisible(!isDropdownFocusRankingListVisible)}
					className="text-color-gray-100 cursor-pointer"
				>
					View more
				</div>

				<DropdownFocusRankingList
					toggleRef={dropdownFocusRankingListRef}
					isVisible={isDropdownFocusRankingListVisible}
					setIsVisible={setIsDropdownFocusRankingListVisible}
					progressData={data}
				/>
			</div>
		</div>
	);
};

export default DetailsCard;
