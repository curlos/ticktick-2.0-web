export interface IPriorityItem {
	name: string;
	backendValue: number;
	flagColor: string;
	textFlagColor: string;
}

export interface IPriorities {
	[key: string]: IPriorityItem;
}

const highPriority = {
	name: 'High',
	backendValue: 3,
	flagColor: '#E1312F',
	textFlagColor: 'text-[#E1312F]',
};

const mediumPriority = {
	name: 'Medium',
	backendValue: 2,
	flagColor: '#FEB003',
	textFlagColor: 'text-[#FEB003]',
};

const lowPriority = {
	name: 'Low',
	backendValue: 1,
	flagColor: '#4773F9',
	textFlagColor: 'text-[#4773F9]',
};

const noPriority = {
	name: 'None',
	backendValue: 0,
	flagColor: '#7B7B7B',
	textFlagColor: 'text-[#7B7B7B]',
};

export const PRIORITIES: IPriorities = {
	3: highPriority,
	2: mediumPriority,
	1: lowPriority,
	0: noPriority,
	high: highPriority,
	medium: mediumPriority,
	low: lowPriority,
	none: noPriority,
};
