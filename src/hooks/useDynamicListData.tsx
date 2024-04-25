import { useEffect, useState } from 'react';
import { Key } from '@react-types/shared';
import { useListData } from '@react-stately/data';

// Define the type for the dynamic state
export interface DynamicItem {
  id: Key; // Unique key for the item
  name: string; // Name of the item
  [key: string]: any; // Additional properties
}

// Define the custom hook
export function useDynamicListData(
  dynamicItems: DynamicItem[], // Dynamic state passed in
  listOptions?: {
    initialSelectedKeys?: 'all' | Iterable<Key>;
    getKey?: (item: DynamicItem) => Key;
  },
) {
  const { initialSelectedKeys = [], getKey = (item: DynamicItem) => item.id } = listOptions || {};

  const [state, setState] = useState({
    items: dynamicItems, // Initialize with dynamic state
    selectedKeys: initialSelectedKeys === 'all' ? 'all' : new Set(initialSelectedKeys),
    filterText: '',
  });

  // Update the list state when dynamicItems changes
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      items: dynamicItems, // Update items when dynamic state changes
    }));
  }, [dynamicItems]); // Trigger on change of dynamicItems

  // Define list actions to interact with the list
  const listActions = {
    append(...values: DynamicItem[]) {
      setState((state) => ({
        ...state,
        items: [...state.items, ...values], // Append items to the list
      }));
    },
    insert(index: number, ...values: DynamicItem[]) {
      setState((state) => ({
        ...state,
        items: [
          ...state.items.slice(0, index),
          ...values,
          ...state.items.slice(index),
        ], // Insert items at a specific index
      }));
    },
    remove(...keys: Key[]) {
      setState((state) => {
        const keySet = new Set(keys);
        return {
          ...state,
          items: state.items.filter((item) => !keySet.has(getKey(item))), // Remove specific items by keys
        };
      });
    },
    setSelectedKeys(selectedKeys: Selection) {
      setState((state) => ({
        ...state,
        selectedKeys,
      }));
    },
    setFilterText(filterText: string) {
      setState((state) => ({
        ...state,
        filterText,
      }));
    },
  };

  return {
    ...state,
    ...listActions,
  };
}

export default useDynamicListData;
