import Icon from '../../Icon';

interface ITaskAction {
	toggleRef?: React.MutableRefObject<null>;
	iconName: string;
	title: string;
	onClick: () => void;
}

const TaskAction: React.FC<ITaskAction> = ({ toggleRef, iconName, title, onClick, hasSideDropdown }) => {
	return (
		<div
			ref={toggleRef ? toggleRef : null}
			className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer rounded text-[13px]"
			onClick={onClick}
		>
			<Icon
				name={iconName}
				customClass={'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'}
				fill={0}
			/>
			<div>{title}</div>

			{hasSideDropdown && (
				<div className="flex-1 flex justify-end items-center">
					<Icon
						name="chevron_right"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
				</div>
			)}
		</div>
	);
};

export default TaskAction;
