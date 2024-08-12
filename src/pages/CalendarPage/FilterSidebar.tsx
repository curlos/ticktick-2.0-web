import { useEffect, useState } from 'react';
import SelectCalendar from '../../components/SelectCalendar';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import Icon from '../../components/Icon';
import { useGetFiltersQuery } from '../../services/resources/filtersApi';
import { useGetTagsQuery } from '../../services/resources/tagsApi';
import CustomCheckbox from './CustomCheckbox';

const FilterSidebar = () => {
	const { data: fetchedProjects, isLoading: isLoadingGetProjects, error } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags } = useGetTagsQuery();
	const { tags, tagsById } = fetchedTags || {};

	// RTK Query - Filters
	const { data: fetchedFilters, isLoading: isLoadingGetFilters } = useGetFiltersQuery();
	const { filters, filtersById } = fetchedFilters || {};

	const [currDueDate, setCurrDueDate] = useState(null);
	const [allValue, setAllValue] = useState({
		name: 'All',
		isChecked: true,
	});
	const [selectedValuesById, setSelectedValuesById] = useState({
		projectsById: {},
		filtersById: {},
		tagsById: {},
	});

	const [selectedCollapsibleValues, setSelectedCollapsibleValues] = useState({
		projects: {
			name: 'Lists',
			isChecked: false,
			valuesByIdType: 'projectsById',
			key: 'projects',
		},
		filters: {
			name: 'Filters',
			isChecked: false,
			valuesByIdType: 'filtersById',
			key: 'filters',
		},
		tags: {
			name: 'Tags',
			isChecked: false,
			valuesByIdType: 'tagsById',
			key: 'tags',
		},
	});
	const [showProjects, setShowProjects] = useState(true);
	const [showFilters, setShowFilters] = useState(true);
	const [showTags, setShowTags] = useState(true);

	const isLoadingFinished = !isLoadingGetProjects && !isLoadingGetTags && !isLoadingGetFilters;
	const inboxProject = Object.values(selectedValuesById.projectsById).find((project) => project.isInbox);

	useEffect(() => {
		if (isLoadingFinished) {
			// const newSelectedValues = {
			// 	projects: projects.map((project) => ({
			// 		...project,
			// 		isChecked: false,
			// 	})),
			// 	filters: filters.map((filter) => ({
			// 		...filter,
			// 		isChecked: false,
			// 	})),
			// 	tags: tags.map((tag) => ({
			// 		...tag,
			// 		isChecked: false,
			// 	})),
			// };

			const newSelectedValuesById = {
				projectsById: getObjWtihIsCheckedInEveryValue(projectsById),
				filtersById: getObjWtihIsCheckedInEveryValue(filtersById),
				tagsById: getObjWtihIsCheckedInEveryValue(tagsById),
			};

			setSelectedValuesById(newSelectedValuesById);
		}
	}, [isLoadingFinished, filters, projects, tags]);

	const getObjWtihIsCheckedInEveryValue = (obj) => {
		const newObj = {};

		Object.keys(obj).forEach((key) => {
			const value = obj[key];

			newObj[key] = { ...value, isChecked: false };
		});

		return newObj;
	};

	const customCheckboxSharedProps = {
		valuesById: selectedValuesById,
		setValuesById: setSelectedValuesById,
		allValue: allValue,
		setAllValue: setAllValue,
		selectedCollapsibleValues: selectedCollapsibleValues,
		setSelectedCollapsibleValues: setSelectedCollapsibleValues,
	};

	return (
		<div className="pt-5 h-screen flex flex-col">
			{/* Calendar */}
			<SelectCalendar dueDate={currDueDate} setDueDate={setCurrDueDate} />

			<div className="px-4">
				<CustomCheckbox
					value={allValue}
					isAllValue={true}
					circularCheckbox={true}
					{...customCheckboxSharedProps}
				/>
			</div>

			{isLoadingFinished && (
				<div className="flex-1 space-y-3 mt-2 px-4 overflow-scroll no-scrollbar pb-4">
					{/* PROJECTS */}
					<div>
						{/* Collapsible "Projects" Title */}
						<CustomCheckbox
							value={selectedCollapsibleValues.projects}
							showValues={showProjects}
							setShowValues={setShowProjects}
							collapsible={true}
							{...customCheckboxSharedProps}
						/>

						{/* Inbox Project */}
						{showProjects && inboxProject && (
							<CustomCheckbox
								value={inboxProject}
								valuesByIdType="projectsById"
								collapsibleKey="projects"
								iconName="inbox"
								{...customCheckboxSharedProps}
							/>
						)}

						{/* Rest of the projects */}
						{showProjects &&
							projects
								?.filter((project) => !project.isInbox)
								.map((project) => (
									<CustomCheckbox
										key={project._id}
										value={selectedValuesById.projectsById[project._id]}
										valuesByIdType="projectsById"
										collapsibleKey="projects"
										iconName="menu"
										{...customCheckboxSharedProps}
									/>
								))}
					</div>

					{/* FILTERS */}
					<div>
						{/* Collapsible "Filters" Title */}
						<CustomCheckbox
							value={selectedCollapsibleValues.filters}
							showValues={showFilters}
							setShowValues={setShowFilters}
							collapsible={true}
							{...customCheckboxSharedProps}
						/>

						{showFilters &&
							filters.map((filter) => (
								<CustomCheckbox
									key={filter._id}
									value={selectedValuesById.filtersById[filter._id]}
									valuesByIdType="filtersById"
									collapsibleKey="filters"
									iconName="filter_list"
									circularCheckbox={true}
									{...customCheckboxSharedProps}
								/>
							))}
					</div>

					{/* TAGS */}
					<div>
						{/* Collapsible "Tags" Title */}
						<CustomCheckbox
							value={selectedCollapsibleValues.tags}
							showValues={showTags}
							setShowValues={setShowTags}
							collapsible={true}
							{...customCheckboxSharedProps}
						/>

						{showTags &&
							tags.map((tag) => (
								<CustomCheckbox
									key={tag._id}
									value={selectedValuesById.tagsById[tag._id]}
									valuesByIdType="tagsById"
									collapsibleKey="tags"
									iconName="sell"
									{...customCheckboxSharedProps}
								/>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default FilterSidebar;
