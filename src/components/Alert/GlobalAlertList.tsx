import React from 'react';
import AlertGeneralMessage from './AlertGeneralMessage';
import AlertFlagged from './AlertFlagged';

/**
 * @description Modals in this list can be opened from anywhere on the site. In most cases, this'll be reserved for Modals that can be opened from multiple parts in the site such as the "Add Task Form Modal".
 */
const GlobalAlertList = () => {
	return (
		<React.Fragment>
			<AlertGeneralMessage />
			<AlertFlagged />
		</React.Fragment>
	);
};

export default GlobalAlertList;
