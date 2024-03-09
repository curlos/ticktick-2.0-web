// src/hooks/useFetchTasks.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTasks } from '../store/store';
import { arrayToObjectByKey } from '../utils/helpers.utils';

const useFetchTasks = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedTasksObj = arrayToObjectByKey(data, '_id');
                localStorage.setItem('allTasks', JSON.stringify(formattedTasksObj));
                dispatch(setTasks(formattedTasksObj));
            } catch (error) {
                console.error('There was a problem fetching tasks: ', error);
            }
        };

        fetchTasks();
    }, [dispatch]);
};

export default useFetchTasks;