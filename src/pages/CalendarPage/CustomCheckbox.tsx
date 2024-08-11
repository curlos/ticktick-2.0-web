const CustomCheckbox = ({ value, values, setValues }) => {
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

	return (
		<div className="flex items-center justify-between gap-2" onClick={handleClick}>
			<span>{name}</span>
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
