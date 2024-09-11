import ReactMarkdown from 'react-markdown';
import { formatDateTime, getFormattedLongDay } from '../../../utils/date.utils';
import { getFocusDuration, getFormattedDuration } from '../../../utils/helpers.utils';
import Icon from '../../../components/Icon';
import classNames from 'classnames';

const FocusRecord = ({ focusRecord, showSubtaskTime = true, isLastItemForTheDay = false, focusDuration }) => {
	const { note, startTime, endTime, tasks } = focusRecord;

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);
	const duration = focusDuration ? focusDuration : getFocusDuration(focusRecord);

	const getStartAndEndTime = () => {};

	const themeColor = 'emerald-500';

	const cssStyles = {
		'blue-500': {
			textColor: 'text-blue-500',
			bgColor: 'bg-blue-500',
			borderColor: 'border-blue-500',
		},
		'emerald-500': {
			textColor: 'text-emerald-500',
			bgColor: 'bg-emerald-500',
			borderColor: 'border-emerald-500',
		},
		'red-500': {
			textColor: 'text-red-500',
			bgColor: 'bg-red-500',
			borderColor: 'border-red-500',
		},
	};

	const { textColor, bgColor, borderColor } = cssStyles[themeColor];

	return (
		<div className="relative m-0 list-none last:mb-[4px] cursor-pointer" style={{ minHeight: '54px' }}>
			<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
				<Icon name="timer" customClass={classNames('!text-[20px] cursor-pointer', textColor)} />
			</div>

			{!isLastItemForTheDay && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				{!isLastItemForTheDay && (
					<div
						className={classNames(
							'absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600',
							borderColor
						)}
						style={{ top: '34px' }}
					></div>
				)}

				<div className="bg-emerald-500/50 p-2 rounded-lg w-full">
					<div className="text-gray-200">
						<span className="font-bold">{getFormattedLongDay(new Date(startTime))}</span> -{' '}
						{startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
					</div>

					{tasks.map((task) => {
						const { startTime, endTime, taskId } = task;

						const startTimeObj = formatDateTime(startTime);
						const endTimeObj = formatDateTime(endTime);

						return (
							<div key={`${taskId} - ${startTime}`} className="flex justify-between items-center">
								<h3 className="text-[20px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px]">
									{task?.title}
								</h3>

								{showSubtaskTime && (
									<div className="ml-3 text-white">
										{startTimeObj.time} - {endTimeObj.time}
									</div>
								)}
							</div>
						);
					})}

					<div className="text-color-gray-100 text-white text-[15px] mt-1 break-words react-markdown">
						<ReactMarkdown>{note}</ReactMarkdown>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FocusRecord;
