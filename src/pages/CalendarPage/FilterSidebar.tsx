import { useEffect, useState } from 'react';
import SelectCalendar from '../../components/SelectCalendar';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import Icon from '../../components/Icon';
import { useGetFiltersQuery } from '../../services/resources/filtersApi';
import { useGetTagsQuery } from '../../services/resources/tagsApi';
import CustomCheckbox from './CustomCheckbox';

const FilterSidebar = () => {
	const { data: fetchedProjects, isLoading: isLoadingGetProjects, error } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags } = useGetTagsQuery();
	const { tags, tagsWithNoParent } = fetchedTags || {};

	// RTK Query - Filters
	const { data: fetchedFilters, isLoading: isLoadingGetFilters } = useGetFiltersQuery();
	const { filters } = fetchedFilters || {};

	const [currDueDate, setCurrDueDate] = useState(null);
	const [selectedValues, setSelectedValues] = useState({
		all: {
			name: 'All',
			isChecked: true,
		},
		projects: [],
		filters: [],
		tags: [],
	});
	const [selectedCollapsibleValues, setSelectedCollapsibleValues] = useState({
		projects: {
			name: 'Lists',
			isChecked: false,
		},
		filters: {
			name: 'Filters',
			isChecked: false,
		},
		tags: {
			name: 'Tags',
			isChecked: false,
		},
	});

	const isLoadingFinished = !isLoadingGetProjects && !isLoadingGetTags && !isLoadingGetFilters;

	useEffect(() => {
		if (isLoadingFinished) {
			const newSelectedValues = {
				all: {
					name: 'All',
					isChecked: true,
				},
				projects: projects.map((project) => ({
					...project,
					isChecked: false,
				})),
				filters: filters.map((filter) => ({
					...filter,
					isChecked: false,
				})),
				tags: tags.map((tag) => ({
					...tag,
					isChecked: false,
				})),
			};

			setSelectedValues(newSelectedValues);
		}
	}, [isLoadingFinished, filters, projects, tags]);

	console.log(selectedValues);

	return (
		<div className="pt-5">
			{/* Calendar */}
			<SelectCalendar dueDate={currDueDate} setDueDate={setCurrDueDate} />

			<div className="px-4">
				<CustomCheckbox value={selectedValues.all} values={selectedValues} setValues={setSelectedValues} />
			</div>

			<GroupedFilters
				selectedValues={selectedValues}
				setSelectedValues={setSelectedValues}
				selectedCollapsibleValues={selectedCollapsibleValues}
				setSelectedCollapsibleValues={setSelectedCollapsibleValues}
			/>
		</div>
	);
};

const GroupedFilters = ({
	selectedValues,
	setSelectedValues,
	selectedCollapsibleValues,
	setSelectedCollapsibleValues,
}) => {
	const [showProjects, setShowProjects] = useState(true);
	const [showFilters, setShowFilters] = useState(true);
	const [showTags, setShowTags] = useState(true);

	const inboxProject = selectedValues.projects?.find((project) => project.isInbox);

	return (
		<div className="space-y-3 mt-2 px-4">
			{/* Projects */}
			<div>
				<CustomCheckbox
					value={selectedCollapsibleValues.projects}
					values={selectedValues}
					setValues={setSelectedValues}
					showValues={showProjects}
					setShowValues={setShowProjects}
					selectedCollapsibleValues={selectedCollapsibleValues}
					setSelectedCollapsibleValues={setSelectedCollapsibleValues}
					collapsible={true}
				/>

				{showProjects && inboxProject && (
					<CustomCheckbox
						value={inboxProject}
						values={selectedValues}
						setValues={setSelectedValues}
						iconName="inbox"
					/>
				)}

				{showProjects &&
					selectedValues.projects
						?.filter((project) => !project.isInbox)
						.map((project) => (
							<CustomCheckbox
								value={project}
								values={selectedValues}
								setValues={setSelectedValues}
								iconName="menu"
							/>
						))}
			</div>

			{/* Filters */}
			<div>
				<CustomCheckbox
					value={selectedCollapsibleValues.filters}
					values={selectedValues}
					setValues={setSelectedValues}
					showValues={showFilters}
					setShowValues={setShowFilters}
					selectedCollapsibleValues={selectedCollapsibleValues}
					setSelectedCollapsibleValues={setSelectedCollapsibleValues}
					collapsible={true}
				/>

				{showFilters &&
					selectedValues.filters.map((filter) => (
						<CustomCheckbox
							value={filter}
							values={selectedValues}
							setValues={setSelectedValues}
							iconName="filter_list"
						/>
					))}
			</div>

			{/* Tags */}
			<div>
				<CustomCheckbox
					value={selectedCollapsibleValues.tags}
					values={selectedValues}
					showValues={showTags}
					setShowValues={setShowTags}
					selectedCollapsibleValues={selectedCollapsibleValues}
					setSelectedCollapsibleValues={setSelectedCollapsibleValues}
					collapsible={true}
				/>

				{showTags &&
					selectedValues.tags.map((tag) => (
						<CustomCheckbox
							value={tag}
							values={selectedValues}
							setValues={setSelectedValues}
							iconName="sell"
						/>
					))}
			</div>
		</div>
	);
};

// const CollpasibleTitle = ({ name, showValues, setShowValues }) => {
// 	return (
// 		<div className="flex items-center text-[12px] cursor-pointer mb-2" onClick={() => setShowValues(!showValues)}>
// 			<CustomCheckbox value={tag} values={selectedValues} setValues={setSelectedValues} />
// 		</div>
// 	);
// };

export default FilterSidebar;
