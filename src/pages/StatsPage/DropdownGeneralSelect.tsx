import classNames from 'classnames';
import Dropdown from '../../components/Dropdown/Dropdown';
import Icon from '../../components/Icon';

const DropdownGeneralSelect = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selected,
	setSelected,
	selectedOptions,
	onClick,
}) => {
	const SelectOption = ({ name }) => {
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
			<div className="w-[175px] p-1">
				{selectedOptions.map((name) => (
					<SelectOption key={name} name={name} />
				))}
			</div>
		</Dropdown>
	);
};

export default DropdownGeneralSelect;
