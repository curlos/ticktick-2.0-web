export interface IPriorityItem {
	name: string;
	backendValue: number;
	flagColor: string;
	textFlagColor: string;
}

export interface IPriorities {
	[key: string]: IPriorityItem;
}

export const PRIORITIES: IPriorities = {
	3: {
		name: 'High',
		backendValue: 3,
		flagColor: '#E1312F',
		textFlagColor: 'text-[#E1312F]',
	},
	2: {
		name: 'Medium',
		backendValue: 2,
		flagColor: '#FEB003',
		textFlagColor: 'text-[#FEB003]',
	},
	1: {
		name: 'Low',
		backendValue: 1,
		flagColor: '#4773F9',
		textFlagColor: 'text-[#4773F9]',
	},
	0: {
		name: 'None',
		backendValue: 0,
		flagColor: '#7B7B7B',
		textFlagColor: 'text-[#7B7B7B]',
	},
};
