import classNames from 'classnames';
import Icon from '../../components/Icon';

const CustomCheckbox = ({
	value,
	values,
	setValues,
	selectedCollapsibleValues,
	setSelectedCollapsibleValues,
	showValues,
	setShowValues,
	collapsible,
	iconName,
}) => {
	const { isChecked, name } = value;

	const allHasBeenChecked = values.all.isChecked;

	const handleClick = () => {
		const willBeChecked = !isChecked;
		setValues({ ...values, [value]: willBeChecked });

		// If not checked, then this means, it's going to be checked and be true in the next state value
		if (allHasBeenChecked && willBeChecked) {
			setValues({ ...values, all: false });
		} else if (!allHasBeenChecked && willBeChecked) {
			// TODO: Refactor
			// const everyOtherPriorityTrue = Object.entries(values).every(([key, value]) => {
			// 	if (key === name.toLowerCase()) {
			// 		return true;
			// 	}
			// 	return value;
			// });
			// TODO: Refactor
			// if (everyOtherPriorityTrue) {
			// 	const valuesClone = { ...values };
			// 	Object.keys(values).forEach((key) => {
			// 		valuesClone[key] = false;
			// 	});
			// 	setValues({ ...valuesClone, all: true });
			// }
		} else if (!willBeChecked) {
			// TODO: Refactor
			// const everyOtherPriorityFalse = Object.entries(values).every(([key, value]) => {
			// 	if (key === name.toLowerCase()) {
			// 		return true;
			// 	}
			// 	return !value;
			// });
			// if (everyOtherPriorityFalse) {
			// 	setValues({ ...values, all: true });
			// }
		}
	};

	const categoryIconClass = 'text-color-gray-100 !text-[16px] hover:text-white';

	return (
		<div
			className={classNames('flex items-center justify-between gap-2', collapsible ? 'mb-2' : '')}
			onClick={handleClick}
		>
			<div className="flex items-center gap-[2px] cursor-pointer" onClick={() => setShowValues(!showValues)}>
				{showValues ? (
					<Icon
						name="expand_more"
						customClass={classNames(categoryIconClass, collapsible ? '' : 'invisible')}
					/>
				) : (
					<Icon
						name="chevron_right"
						customClass={classNames(categoryIconClass, collapsible ? '' : 'invisible')}
					/>
				)}
				<div className="flex items-center gap-1">
					<Icon name={iconName} customClass={'text-white !text-[18px]'} fill={0} />
					<span className={classNames('truncate max-w-[150px]', collapsible ? 'font-bold' : '')}>{name}</span>
				</div>
			</div>
			<input
				type="checkbox"
				name={name}
				// TODO: Add option to make the checkbox rounded for certain items if passed in the props.
				className="accent-blue-500"
				checked={isChecked}
				onChange={() => null}
			/>
		</div>
	);
};

export default CustomCheckbox;
