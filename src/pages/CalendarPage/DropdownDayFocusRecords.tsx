import classNames from 'classnames';
import Dropdown from '../../components/Dropdown/Dropdown';
import MiniFocusRecord from './MiniFocusRecord';
import { formatCheckedInDayDate } from '../../utils/date.utils';

const DropdownDayFocusRecords = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	focusRecordsForTheDay,
	shownFocusRecords,
}) => {
	console.log(focusRecordsForTheDay);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg mt-[-150px]', customClasses)}
		>
			<div className="w-[300px] p-2">
				<div className="mb-2 font-bold">{formatCheckedInDayDate(new Date(shownFocusRecords[0].startTime))}</div>
				<div className="space-y-1">
					{shownFocusRecords?.map((focusRecord, index) => (
						<MiniFocusRecord
							focusRecord={focusRecord}
							index={index}
							maxFocusRecords={null}
							focusRecordsForTheDay={focusRecordsForTheDay}
							shownFocusRecords={shownFocusRecords}
							customStartTimeClasses="min-w-[65px]"
						/>
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownDayFocusRecords;
