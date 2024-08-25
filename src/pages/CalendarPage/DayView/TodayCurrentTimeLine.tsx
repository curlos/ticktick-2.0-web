import { getTimeString } from '../../../utils/date.utils';

const TodayCurrentTimeLine = ({ dueDateIsToday, todayDayTopValue, todayDateObj, formattedDayWidth }) => {
	if (!dueDateIsToday) {
		return null;
	}

	return (
		<div>
			<TodayCurrentTimeBox {...{ todayDayTopValue, todayDateObj }} />
			<TodayCurrentLine {...{ todayDayTopValue, formattedDayWidth }} />
		</div>
	);
};

export const TodayCurrentTimeBox = ({ todayDayTopValue, todayDateObj }) => {
	return (
		<div
			className="bg-red-500/20 text-red-500 rounded text-[12px] w-[60px] flex items-center justify-center"
			style={{
				position: 'absolute',
				top: todayDayTopValue - 10,
				left: '20px',
				zIndex: 1,
			}}
		>
			{getTimeString(todayDateObj)}
		</div>
	);
};

const TodayCurrentLine = ({ todayDayTopValue, formattedDayWidth }) => {
	return (
		<>
			<div
				className="bg-red-500 h-[10px] w-[10px] rounded-full"
				style={{
					position: 'absolute',
					top: todayDayTopValue - 5,
					left: '90px',
					zIndex: 1,
				}}
			></div>

			<div
				className="bg-red-500 h-[1px]"
				style={{
					position: 'absolute',
					top: todayDayTopValue,
					left: '90px',
					width: formattedDayWidth - 2,
					zIndex: 1,
				}}
			></div>
		</>
	);
};

export default TodayCurrentTimeLine;
