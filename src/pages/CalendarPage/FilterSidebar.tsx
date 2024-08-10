import { useState } from 'react';
import SelectCalendar from '../../components/SelectCalendar';

const FilterSidebar = () => {
	const [currDueDate, setCurrDueDate] = useState(null);

	return (
		<div className="pt-5">
			<SelectCalendar dueDate={currDueDate} setDueDate={setCurrDueDate} />
		</div>
	);
};

export default FilterSidebar;
