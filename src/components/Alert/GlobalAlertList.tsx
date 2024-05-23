import React from 'react';
import AlertCopied from './AlertCopied';

/**
 * @description Modals in this list can be opened from anywhere on the site. In most cases, this'll be reserved for Modals that can be opened from multiple parts in the site such as the "Add Task Form Modal".
 */
const GlobalAlertList = () => {
	return (
		<React.Fragment>
			<AlertCopied />
		</React.Fragment>
	);
};

export default GlobalAlertList;
