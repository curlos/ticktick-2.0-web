import Dropdown from './Dropdown';
import { DropdownProps } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { logoutUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router';
import { setModalState } from '../../slices/modalSlice';
import { useDispatch } from 'react-redux';

interface DropdownAccountDetailsProps extends DropdownProps {}

const DropdownAccountDetails: React.FC<DropdownAccountDetailsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const AccountAction = ({ name, onClick }) => (
		<div onClick={onClick} className="p-2 hover:bg-color-gray-300 cursor-pointer">
			{name}
		</div>
	);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="w-[200px] p-1">
				<AccountAction
					name="Settings"
					onClick={() => {
						setIsVisible(false);
						dispatch(setModalState({ modalId: 'ModalAccountSettings', isOpen: true }));
					}}
				/>
				<AccountAction
					name="Sign Out"
					onClick={async () => {
						setIsVisible(false);
						try {
							await logoutUser();
							navigate('/login');
						} catch (error) {
							console.log(error);
						}
					}}
				/>
			</div>
		</Dropdown>
	);
};

export default DropdownAccountDetails;
