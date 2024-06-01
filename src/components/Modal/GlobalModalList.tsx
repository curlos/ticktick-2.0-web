import React from 'react';
import ModalAddTaskForm from './ModalAddTaskForm';
import ModalAddFocusRecord from './ModalAddFocusRecord';
import ModalAddList from './ModalAddList';
import ModalSearchTasks from './ModalSearchTasks';
import ModalErrorMessenger from './ModalErrorMessenger';
import ModalAccountSettings from './ModalAccountSettings';

/**
 * @description Modals in this list can be opened from anywhere on the site. In most cases, this'll be reserved for Modals that can be opened from multiple parts in the site such as the "Add Task Form Modal".
 */
const GlobalModalList = () => {
	// TODO: Currently, any modal in this global list of modals will be unable to recieve props unless they are checking redux. So, if you pass "props" like normal to the Modal without globally calling it, it won't work. Not sure if I want to continue doing this but it does seem like the "correct" choice to maintain a single source of truth. In any case, this should be reviewed.
	return (
		<React.Fragment>
			<ModalErrorMessenger />
			<ModalAddTaskForm />
			<ModalAddFocusRecord />
			<ModalAddList />
			<ModalSearchTasks />
			<ModalAccountSettings />
		</React.Fragment>
	);
};

export default GlobalModalList;
