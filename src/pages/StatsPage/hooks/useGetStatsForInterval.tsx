import { useState, useEffect } from 'react';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getLast7Days } from '../../../utils/date.utils';

export const useGetStatsForInterval = (scoreType = 'completedTasks') => {
	const lastSevenDays = getLast7Days();
	const defaultData = lastSevenDays.map((day) => ({
		name: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
		score: 0,
	}));

	const [data, setData] = useState(defaultData);
	const selectedOptions = ['Day', 'Week', 'Month'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const { statsForLastSevenDays, statsForLastSevenWeeks, statsForLastSevenMonths } = useStatsContext();

	useEffect(() => {
		if (!statsForLastSevenDays || !statsForLastSevenWeeks) {
			return;
		}

		let statsToUse = null;

		switch (selected) {
			case 'Day':
				statsToUse = statsForLastSevenDays;
				break;
			case 'Week':
				statsToUse = statsForLastSevenWeeks;
				break;
			case 'Month':
				statsToUse = statsForLastSevenMonths;
				break;
			default:
				statsToUse = statsForLastSevenDays;
		}

		const newData = statsToUse?.map((dataForTheDay) => {
			let score = 0;

			if (scoreType !== 'focusDuration') {
				score = dataForTheDay[scoreType]?.length || 0;
			} else {
				score = dataForTheDay[scoreType] || 0;
			}

			return {
				name: dataForTheDay.name,
				fullName: dataForTheDay.fullName || dataForTheDay.name,
				score: score,
			};
		});
		setData(newData);
	}, [selected, statsForLastSevenDays, statsForLastSevenWeeks]);

	return {
		selected,
		setSelected,
		selectedOptions,
		data,
	};
};
