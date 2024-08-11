import classNames from 'classnames';
import Icon from '../../components/Icon';

const CustomCheckbox = ({
	value,
	valuesByIdType,
	valuesById,
	setValuesById,
	allValue,
	setAllValue,
	selectedCollapsibleValues,
	setSelectedCollapsibleValues,
	showValues,
	setShowValues,
	collapsible,
	iconName,
	isAllValue = false,
}) => {
	if (!value) {
		return null;
	}

	const { isChecked, name } = value;

	const allHasBeenChecked = allValue.isChecked;

	const handleClick = () => {
		const willBeChecked = !isChecked;

		if (isAllValue) {
			if (willBeChecked) {
				// Set all the collapsible and normal values to false.
				setAllValue({ ...allValue, isChecked: true });
				updateValuesByIdAndCollapsibleFalse(valuesById, selectedCollapsibleValues);
			} else {
				// set it to false like normal and that's it.
				setAllValue({ ...allValue, isChecked: false });
			}
		} else if (collapsible) {
			const { key, valuesByIdType } = value;
			// Set the collapsible value and all the values part of the list to true.
			setSelectedCollapsibleValues({
				...selectedCollapsibleValues,
				[key]: {
					...value,
					isChecked: willBeChecked,
				},
			});

			const newValuesByIdForType = cloneWithIsChecked(valuesById[valuesByIdType], willBeChecked);
			const newValuesById = {
				...valuesById,
				[valuesByIdType]: newValuesByIdForType,
			};

			const everyOtherValueTrue = checkIfEveryOtherValueTrue(newValuesById);

			if (everyOtherValueTrue) {
				updateValuesByIdAndCollapsibleFalse(newValuesById, selectedCollapsibleValues);
				setAllValue({ ...allValue, isChecked: true });
			} else {
				setValuesById(newValuesById);
			}
		} else {
			handleClickNormalValue();
		}
	};

	const handleClickNormalValue = () => {
		const willBeChecked = !isChecked;

		const newValuesById = {
			...valuesById,
			[valuesByIdType]: {
				...valuesById[valuesByIdType],
				[value._id]: {
					...value,
					isChecked: !valuesById[valuesByIdType][value._id].isChecked,
				},
			},
		};

		setValuesById(newValuesById);
		console.log(selectedCollapsibleValues);

		// If not checked, then this means, it's going to be checked and be true in the next state value
		if (allHasBeenChecked && willBeChecked) {
			setAllValue({ ...allValue, isChecked: false });
		} else if (!allHasBeenChecked && willBeChecked) {
			// TODO: Refactor

			const everyOtherValueTrue = checkIfEveryOtherValueTrue(newValuesById);

			// If every other value is true, then set them all to false because there are no "filters" applied since no one specific filter has been chosen so it's set to "All". Meaning do not filter by anything.
			// TODO: Test this to make sure it works.
			if (everyOtherValueTrue) {
				updateValuesByIdAndCollapsibleFalse(newValuesById, selectedCollapsibleValues);
				setAllValue({ ...allValue, isChecked: true });
			} else {
				if (allProjectsTrue) {
					setSelectedCollapsibleValues({
						...selectedCollapsibleValues,
						projects: { ...selectedCollapsibleValues.projects, isChecked: true },
					});
				}

				if (allFiltersTrue) {
					setSelectedCollapsibleValues({
						...selectedCollapsibleValues,
						filters: { ...selectedCollapsibleValues.filters, isChecked: true },
					});
				}

				if (allTagsTrue) {
					setSelectedCollapsibleValues({
						...selectedCollapsibleValues,
						tags: { ...selectedCollapsibleValues.tags, isChecked: true },
					});
				}
			}
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

	const updateValuesByIdAndCollapsibleFalse = (newValuesById, selectedCollapsibleValues) => {
		const { projectsById, filtersById, tagsById } = newValuesById;

		const newProjectsById = cloneWithIsChecked(projectsById, false);
		const newFiltersById = cloneWithIsChecked(filtersById, false);
		const newTagsById = cloneWithIsChecked(tagsById, false);

		setValuesById({
			projectsById: newProjectsById,
			filtersById: newFiltersById,
			tagsById: newTagsById,
		});

		const newSelectedCollapsibleValues = cloneWithIsChecked(selectedCollapsibleValues, false);

		setSelectedCollapsibleValues(newSelectedCollapsibleValues);
	};

	const cloneWithIsChecked = (objById, isCheckedValue) => {
		const newObjById = {};

		Object.keys(objById).forEach((key) => {
			const value = objById[key];

			newObjById[key] = {
				...value,
				isChecked: isCheckedValue,
			};
		});

		return newObjById;
	};

	const checkIfEveryOtherValueTrue = (newValuesById) => {
		const { projectsById, filtersById, tagsById } = newValuesById;
		const allProjectsTrue = Object.values(projectsById).every((project) => project.isChecked);
		const allFiltersTrue = Object.values(filtersById).every((filter) => filter.isChecked);
		const allTagsTrue = Object.values(tagsById).every((tag) => tag.isChecked);

		return allProjectsTrue && allFiltersTrue && allTagsTrue;
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
					<span className={classNames('truncate max-w-[140px]', collapsible ? 'font-bold' : '')}>{name}</span>
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
