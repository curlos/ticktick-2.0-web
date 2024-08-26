import classNames from 'classnames';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Icon from '../../../components/Icon';
import { useState } from 'react';

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

	const [multiDays, setMultiDays] = useState(7);

	const canDecrementMultiDays = multiDays - 1 >= 2;
	const canIncrementMultiDays = multiDays + 1 <= 14;

	const handleMultiDayDecrement = () => {
		if (canDecrementMultiDays) {
			setMultiDays(multiDays - 1);
		}
	};

	const handleMultiDayIncrement = () => {
		if (canIncrementMultiDays) {
			setMultiDays(multiDays + 1);
		}
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
						<SelectOption key={name} name={name} {...{ selected, setSelected, setIsVisible, onClick }} />
					))}
				</div>

				<hr className="border-color-gray-200" />

				<div className="p-1">
					<SelectOptionMulti
						key="Multi-Day"
						name="Multi-Day"
						multiIntervalAmount={multiDays}
						handleDecrement={handleMultiDayDecrement}
						handleIncrement={handleMultiDayIncrement}
						canDecrement={canDecrementMultiDays}
						canIncrement={canIncrementMultiDays}
						{...{ selected, setSelected, setIsVisible, onClick }}
					/>
				</div>
			</div>
		</Dropdown>
	);
};

const SelectOption = ({ name, selected, setSelected, setIsVisible, onClick }: { name: string }) => {
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
			<div className="flex items-center">
				<div className="w-[25px] flex items-center">
					{selected === name && (
						<Icon
							name="check"
							fill={0}
							customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
						/>
					)}
				</div>
				<div className={selected === name ? 'text-blue-500' : ''}>{name}</div>
			</div>
		</div>
	);
};

const SelectOptionMulti = ({
	name,
	multiIntervalAmount,
	handleDecrement,
	handleIncrement,
	canDecrement,
	canIncrement,
	selected,
	setSelected,
	setIsVisible,
	onClick,
}: {
	name: string;
}) => {
	const [isHovering, setIsHovering] = useState(false);

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
			onMouseEnter={() => {
				setIsHovering(true);
			}}
			onMouseLeave={() => {
				setIsHovering(false);
			}}
		>
			<div className="flex items-center">
				<div className="w-[25px] flex items-center">
					{selected === name && (
						<Icon
							name="check"
							fill={0}
							customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
						/>
					)}
				</div>
				<div className={selected === name ? 'text-blue-500' : ''}>{name}</div>
			</div>

			<div
				onClick={(e) => {
					e.stopPropagation();

					if (selected !== name) {
						setSelected(name);
					}
				}}
				className="text-[12px] text-color-gray-100"
			>
				{isHovering ? (
					<div className="flex items-center gap-2 text-[14px] text-white">
						<div
							className={classNames(!canDecrement && 'cursor-not-allowed text-color-gray-100')}
							onClick={handleDecrement}
						>
							−
						</div>
						<div>{multiIntervalAmount}</div>
						<div
							className={classNames(!canIncrement && 'cursor-not-allowed text-color-gray-100')}
							onClick={handleIncrement}
						>
							+
						</div>
					</div>
				) : (
					`${multiIntervalAmount} Days`
				)}
			</div>
		</div>
	);
};

export default DropdownIntervalSelect;
