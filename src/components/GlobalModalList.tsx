import React from 'react';
import ModalAddTaskForm from './Modal/ModalAddTaskForm';
import ModalAddFocusRecord from './Modal/ModalAddFocusRecord';
import ModalAddList from './Modal/ModalAddList';

const GlobalModalList = () => {
	return (
		<React.Fragment>
			{/* TODO: Add the rest of the modals on the site here. Modals should not be in components. I can't think of a situation off the top of my head where we would need more than one modal open at a time. It just seems like bad practice. Even if I do need it, I'll cross that bridge when I get there. */}
			<ModalAddTaskForm />
			<ModalAddFocusRecord />
			<ModalAddList />
		</React.Fragment>
	);
};

export default GlobalModalList;
