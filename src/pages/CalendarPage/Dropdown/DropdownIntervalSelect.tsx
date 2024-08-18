import classNames from 'classnames';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Icon from '../../../components/Icon';

const DropdownIntervalSelect = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selected,
	setSelected,
	onClick,
}) => {
	const intervalOptionsTop = ['Day', 'Week', 'Month', 'Agenda'];
	const intervalOptionsBottom = ['Multi-Day', 'Multi-Week'];

	const SelectOption = ({ name }: { name: string }) => {
		return (
			<div
				className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-md cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();
					setSelected(name);
					setIsVisible(false);

					if (onClick) {
						onClick(name);
					}
				}}
			>
				<div className={selected === name ? 'text-blue-500' : ''}>{name}</div>
				{selected === name && (
					<Icon
						name="check"
						fill={0}
						customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="w-[175px]">
				<div className="p-1">
					{intervalOptionsTop.map((name) => (
						<SelectOption key={name} name={name} />
					))}
				</div>

				<hr className="border-color-gray-200" />

				<div className="p-1">
					{intervalOptionsBottom.map((name) => (
						<SelectOption key={name} name={name} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownIntervalSelect;
