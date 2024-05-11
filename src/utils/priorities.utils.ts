export interface IPriorityItem {
    name: string;
    backendValue: string;
    flagColor: string;
    textFlagColor: string;
}

export interface IPriorities {
    [key: string]: IPriorityItem;
}

export const PRIORITIES: IPriorities = {
    'high': {
        name: 'High',
        backendValue: '3',
        flagColor: '#E1312F',
        textFlagColor: 'text-[#E1312F]'
    },
    'medium': {
        name: 'Medium',
        backendValue: '2',
        flagColor: '#FEB003',
        textFlagColor: 'text-[#FEB003]'
    },
    'low': {
        name: 'Low',
        backendValue: '1',
        flagColor: '#4773F9',
        textFlagColor: 'text-[#4773F9]'
    },
    'none': {
        name: 'None',
        backendValue: '0',
        flagColor: '#7B7B7B',
        textFlagColor: 'text-[#7B7B7B]'
    }
};