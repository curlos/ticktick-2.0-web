import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setModalState } from '../slices/modalSlice';

const useHandleError = () => {
	const dispatch = useDispatch();

	const handleError = useCallback(
		async (fn) => {
			try {
				await fn();
			} catch (error) {
				// Dispatch an action to show an error modal
				dispatch(
					setModalState({
						modalId: 'ModalErrorMessenger',
						isOpen: true,
						props: { error },
					})
				);
			}
		},
		[dispatch]
	);

	return handleError;
};

export default useHandleError;
