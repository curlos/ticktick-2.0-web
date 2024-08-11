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
	collapsibleKey,
	isAllValue = false,
	circularCheckbox = false,
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

			const { everyOtherValueTrue } = getAllTrueValues(newValuesById);

			if (everyOtherValueTrue) {
				updateValuesByIdAndCollapsibleFalse(newValuesById, selectedCollapsibleValues);
				setAllValue({ ...allValue, isChecked: true });
			} else {
				setValuesById(newValuesById);
				setAllValue({ ...allValue, isChecked: false });
			}
		} else {
			handleClickNormalValue();
		}
	};

	const handleClickNormalValue = () => {
		// If not checked, then this means, it's going to be checked and be true in the next state value. Otherwise, it'll be false in the next state value.
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

		// If all has been checked and the value being clicked will be true in the next state change, then all needs to be set to false.
		if (allHasBeenChecked && willBeChecked) {
			setAllValue({ ...allValue, isChecked: false });
			// This is basically just the normal scenario. Most of the time all will NOT be checked so this is the scenario that will happen most of the time.
		} else if (!allHasBeenChecked && willBeChecked) {
			const { allProjectsTrue, allFiltersTrue, allTagsTrue, everyOtherValueTrue } =
				getAllTrueValues(newValuesById);

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
		}

		// If we're setting one of the "normal" values to false, then the collapsible value should be set to false as well. That collapsible value (like "Lists", "Filters", or "Tags") is only true when all the child "normal" values under it are ALL true. So, if even one of them is false, then it should be set to false.
		if (!willBeChecked) {
			const newSelectedCollapsibleValues = {
				...selectedCollapsibleValues,
				[collapsibleKey]: { ...selectedCollapsibleValues[collapsibleKey], isChecked: false },
			};
			setSelectedCollapsibleValues(newSelectedCollapsibleValues);

			console.log(newSelectedCollapsibleValues);
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

	const getAllTrueValues = (newValuesById) => {
		const { projectsById, filtersById, tagsById } = newValuesById;
		const allProjectsTrue = Object.values(projectsById).every((project) => project.isChecked);
		const allFiltersTrue = Object.values(filtersById).every((filter) => filter.isChecked);
		const allTagsTrue = Object.values(tagsById).every((tag) => tag.isChecked);

		return {
			allProjectsTrue,
			allFiltersTrue,
			allTagsTrue,
			everyOtherValueTrue: allProjectsTrue && allFiltersTrue && allTagsTrue,
		};
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
			<div className="flex items-center">
				<input
					id="customCheckbox"
					type="checkbox"
					name={name}
					// TODO: Add option to make the checkbox rounded for certain items if passed in the props.
					className="accent-blue-500 hidden"
					checked={isChecked}
					onChange={() => null}
				/>
				<div
					className={classNames(
						'border border-color-gray-200 h-[17px] w-[17px] flex items-center justify-center',
						isChecked ? 'bg-blue-500' : 'bg-transparent',
						circularCheckbox ? 'rounded-full' : 'rounded'
					)}
				>
					{isChecked && <Icon name={'check'} customClass={'text-white !text-[15px]'} fill={1} />}
				</div>
			</div>
		</div>
	);
};

export default CustomCheckbox;
