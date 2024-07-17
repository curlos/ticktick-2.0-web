import ReactMarkdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import remarkGfm from 'remark-gfm';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { setModalState } from '../../slices/modalSlice';
import { formatDateTime } from '../../utils/date.utils';
import { getFormattedDuration } from '../../utils/helpers.utils';
import Icon from '../Icon';

const FocusRecord = ({ focusRecord, tasksById, habitsById }) => {
	const dispatch = useDispatch();
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { focusRecordsById } = fetchedFocusRecords || {};

	const { _id, taskId, habitId, note, duration, startTime, endTime, children } = focusRecord;

	const task = tasksById[taskId];
	const habit = habitsById[habitId];

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	const childFocusRecordTaskTitles = new Set();

	children?.forEach((childId) => {
		const childFocusRecord = focusRecordsById[childId];
		const isTask = childFocusRecord.taskId;

		const childItem = isTask ? tasksById[childFocusRecord.taskId] : habitsById[childFocusRecord.habitId];
		childFocusRecordTaskTitles.add(isTask ? childItem?.title : childItem?.name);
	});

	return (
		<li
			key={_id}
			className="relative m-0 list-none last:mb-[4px] mt-[24px] cursor-pointer"
			style={{ minHeight: '54px' }}
			onClick={() =>
				dispatch(
					setModalState({ modalId: 'ModalAddFocusRecord', isOpen: true, props: { focusRecord: focusRecord } })
				)
			}
		>
			<div
				className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-blue-900"
				style={{ height: 'calc(100% - 16px)' }}
			></div>

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				<div className="absolute left-[-40px] w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon name="nutrition" customClass={'!text-[20px] text-blue-500 cursor-pointer'} fill={1} />
				</div>

				<div
					className="absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600 border-blue-500"
					style={{ top: '34px' }}
				></div>

				<div>
					<div className="flex justify-between text-color-gray-100 text-[12px] mb-[6px]">
						<div>
							{startTimeObj.time} - {endTimeObj.time}
						</div>
						<div>{getFormattedDuration(duration)}</div>
					</div>

					{/* TODO: Render an array of titles if it has children for better clarity. */}

					{children && children.length > 0 ? (
						<div className="font-medium space-y-1">
							{[...childFocusRecordTaskTitles].map((title, index) => {
								return <div key={`${title}-${index}`}>{title}</div>;
							})}
						</div>
					) : (
						<div>
							<div>{task && <div className="font-medium">{task.title}</div>}</div>
							<div>{habit && <div className="font-medium">{habit.name}</div>}</div>
						</div>
					)}

					<div className="text-color-gray-100 mt-1 max-w-[350px] break-words">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
					</div>
				</div>
			</div>
		</li>
	);
};

export default FocusRecord;
