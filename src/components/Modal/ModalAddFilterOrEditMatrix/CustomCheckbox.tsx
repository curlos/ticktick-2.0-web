const CustomCheckbox = ({ name, values, setValues, allPriorities, setAllPriorities }) => {
	const value = name.toLowerCase();
	const isChecked = values[value];

	const handleClick = () => {
		const willBeChecked = !isChecked;
		setValues({ ...values, [value]: willBeChecked });

		// If not checked, then this means, it's going to be checked and be true in the next state value
		if (allPriorities && willBeChecked) {
			setAllPriorities(false);
		} else if (!allPriorities && willBeChecked) {
			const everyOtherPriorityTrue = Object.entries(values).every(([key, value]) => {
				if (key === name.toLowerCase()) {
					return true;
				}

				return value;
			});

			if (everyOtherPriorityTrue) {
				setAllPriorities(true);

				const valuesClone = { ...values };
				Object.keys(values).forEach((key) => {
					valuesClone[key] = false;
				});
				setValues(valuesClone);
			}
		} else if (!willBeChecked) {
			const everyOtherPriorityFalse = Object.entries(values).every(([key, value]) => {
				if (key === name.toLowerCase()) {
					return true;
				}

				return !value;
			});

			if (everyOtherPriorityFalse) {
				setAllPriorities(true);
			}
		}
	};

	return (
		<div className="flex items-center gap-2" onClick={handleClick}>
			<input type="checkbox" name={name} className="accent-blue-500" checked={isChecked} onChange={() => null} />
			{name}
		</div>
	);
};

export default CustomCheckbox;
