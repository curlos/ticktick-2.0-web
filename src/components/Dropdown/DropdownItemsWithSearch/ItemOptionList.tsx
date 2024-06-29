import React from 'react';
import ItemOption from './ItemOption';

const ItemOptionList = ({
	type,
	showSmartLists,
	smartListProjects,
	inboxProject,
	multiSelect,
	allProject,
	nonSmartListProjects,
	filteredItems,
	selectedItem,
	setSelectedItem,
	selectedItemList,
	setSelectedItemList,
	setIsVisible,
	task,
	onCloseContextMenu,
}) => {
	const ItemOptionWithProps = ({ item, iconFill = 1 }) => {
		return (
			<ItemOption
				item={item}
				iconFill={iconFill} // Sets a default of 1 if iconFill isn't otherwise specified
				type={type}
				multiSelect={multiSelect}
				selectedItem={selectedItem}
				setSelectedItem={setSelectedItem}
				selectedItemList={selectedItemList}
				setSelectedItemList={setSelectedItemList}
				setIsVisible={setIsVisible}
				task={task}
				filteredItems={filteredItems}
				inboxProject={inboxProject}
				nonSmartListProjects={nonSmartListProjects}
				allProject={allProject}
				onCloseContextMenu={onCloseContextMenu}
			/>
		);
	};

	switch (type) {
		case 'project':
			return (
				<React.Fragment>
					{showSmartLists ? (
						<div>
							{smartListProjects
								.filter((project) => !project.isInbox)
								.map((project) => (
									<ItemOptionWithProps key={project.name} item={project} />
								))}
							{inboxProject && <ItemOptionWithProps key={inboxProject.name} item={inboxProject} />}
						</div>
					) : (
						<div>
							{multiSelect && allProject && (
								<ItemOptionWithProps key={allProject.name} item={allProject} />
							)}
							{inboxProject && <ItemOptionWithProps key={inboxProject.name} item={inboxProject} />}
						</div>
					)}

					{showSmartLists && nonSmartListProjects.length > 0 && (
						<div className="px-2 mt-2 text-color-gray-100 text-left">Lists</div>
					)}

					{nonSmartListProjects.map((project) => (
						<ItemOptionWithProps key={project.name} item={project} />
					))}
				</React.Fragment>
			);
		case 'tags':
			return (
				<React.Fragment>
					{filteredItems.map((item) => {
						return <ItemOptionWithProps key={item._id} item={item} iconFill={0} />;
					})}
				</React.Fragment>
			);
		default:
			return null;
	}
};

export default ItemOptionList;
