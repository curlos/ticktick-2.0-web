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

			<GroupedFilters selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
		</div>
	);
};

const GroupedFilters = ({ selectedValues, setSelectedValues }) => {
	const [showProjects, setShowProjects] = useState(true);
	const [showFilters, setShowFilters] = useState(true);
	const [showTags, setShowTags] = useState(true);

	const inboxProject = selectedValues.projects?.find((project) => project.isInbox);

	return (
		<div className="space-y-3 mt-2">
			{/* Projects */}
			<div>
				<CollpasibleTitle name="Lists" showValues={showProjects} setShowValues={setShowProjects} />

				{showProjects && inboxProject && (
					<div className="px-4">
						<CustomCheckbox value={inboxProject} values={selectedValues} setValues={setSelectedValues} />
					</div>
				)}

				{showProjects &&
					selectedValues.projects
						?.filter((project) => !project.isInbox)
						.map((project) => (
							<div className="px-4">
								<CustomCheckbox value={project} values={selectedValues} setValues={setSelectedValues} />
							</div>
						))}
			</div>

			{/* Filters */}
			<div>
				<CollpasibleTitle name="Filters" showValues={showFilters} setShowValues={setShowFilters} />

				{showFilters &&
					selectedValues.filters.map((filter) => (
						<div className="px-4">
							<CustomCheckbox value={filter} values={selectedValues} setValues={setSelectedValues} />
						</div>
					))}
			</div>

			{/* Tags */}
			<div>
				<CollpasibleTitle name="Tags" showValues={showTags} setShowValues={setShowTags} />

				{showTags &&
					selectedValues.tags.map((tag) => (
						<div className="px-4">
							<CustomCheckbox value={tag} values={selectedValues} setValues={setSelectedValues} />
						</div>
					))}
			</div>
		</div>
	);
};

const CollpasibleTitle = ({ name, showValues, setShowValues }) => {
	const categoryIconClass = 'text-color-gray-100 !text-[16px] hover:text-white';

	return (
		<div className="flex items-center text-[12px] cursor-pointer mb-2" onClick={() => setShowValues(!showValues)}>
			{showValues ? (
				<Icon name="expand_more" customClass={categoryIconClass} />
			) : (
				<Icon name="chevron_right" customClass={categoryIconClass} />
			)}
			<span className="mr-[6px] font-bold">{name}</span>
		</div>
	);
};

export default FilterSidebar;
