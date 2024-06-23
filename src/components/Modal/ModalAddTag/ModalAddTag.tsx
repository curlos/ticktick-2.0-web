import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useAddProjectMutation, useEditProjectMutation } from '../../../services/api';
import { setModalState } from '../../../slices/modalSlice';
import ColorList from '../../ColorList';
import Icon from '../../Icon';
import Modal from '../Modal';
import DropdownParentTag from './DropdownParentTag';

const ModalAddTag: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddTag']);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	console.log('hi');

	const [addProject, { isLoading: isLoadingAddProject, error: errorAddProject }] = useAddProjectMutation(); // Mutation hook
	const [editProject, { isLoading: isLoadingEditProject, error: errorEditProject }] = useEditProjectMutation();

	const [name, setName] = useState(modal?.props?.tag?.name || '');
	const [color, setColor] = useState(modal?.props?.tag?.color || '');
	const [selectedParentTag, setSelectedParentTag] = useState(null);
	const [isDropdownParentTagVisible, setIsDropdownParentTagVisible] = useState(false);

	const DEFAULT_COLORS = ['#ff6161', '#FFAC37', '#FFD323', '#E6EA48', '#33D870', '#4BA1FF', '#6D75F4'];
	const DEFAULT_COLORS_LOWERCASE = DEFAULT_COLORS.map((color) => color.toLowerCase());

	const isEditingTag = modal?.props?.tag ? true : false;

	useEffect(() => {
		if (modal?.props?.project) {
			const { project } = modal.props;
			setName(project.name);
			setColor(project.color);
		} else {
			setName('');
			setColor('');
		}
	}, [modal?.props?.project]);

	const handleAddTag = async () => {
		if (name.trim() === '') {
			return;
		}

		const newTag = {
			name: name,
			parentTagId: null,
			color,
		};

		try {
			let tagId = null;

			if (isEditingTag) {
				// TODO: Bring this back in a moment.
				// const {
				// 	data: { _id },
				// } = await editProject({ projectId: modal.props.project._id, payload: newTag });
				// tagId = _id;
			} else {
				const {
					data: { _id },
				} = await addTag(newTag);
				tagId = _id;
			}
			closeModal();
			navigate(`/tags/${tagId}/tasks`);
		} catch (error) {
			console.error(error);
		}
	};

	const [isNameInputFocused, setIsNameInputFocused] = useState(false);

	const dropdownParentTagRef = useRef(null);

	if (!modal) {
		return null;
	}

	const { isOpen } = modal;

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddTag', isOpen: false }));
	};

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center" customClasses="!w-[400px]">
			<div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[16px]">{isEditingTag ? 'Edit Tag' : 'Add Tag'}</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={closeModal}
					/>
				</div>

				{/* Name */}
				<div
					className={`border border-[#4c4c4c] rounded-md flex items-center ${isNameInputFocused ? 'border-blue-500' : ''}`}
				>
					<Icon name="menu" customClass="!text-[16px] text-color-gray-100 hover:text-white p-[6px]" />
					<div className="border-l border-[#4c4c4c] p-[6px] flex-1">
						<input
							value={name}
							placeholder="Name"
							className="placeholder-color-gray-100 outline-none bg-transparent w-full"
							onChange={(e) => setName(e.target.value)}
							onFocus={() => setIsNameInputFocused(true)}
							onBlur={() => setIsNameInputFocused(false)}
						/>
					</div>
				</div>

				<div className="space-y-4 mt-3">
					{/* Color */}
					<ColorList colorList={DEFAULT_COLORS_LOWERCASE} color={color} setColor={setColor} />

					{/* Parent Tag */}
					<div className="flex items-center">
						<div className="text-color-gray-100 w-[96px]">Parent Tag</div>
						<div className="flex-1 relative">
							<div
								ref={dropdownParentTagRef}
								className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
								onClick={() => {
									setIsDropdownParentTagVisible(!isDropdownParentTagVisible);
								}}
							>
								<div>{selectedParentTag?.name}</div>
								<Icon
									name="expand_more"
									fill={0}
									customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
								/>
							</div>

							<DropdownParentTag
								toggleRef={dropdownParentTagRef}
								isVisible={isDropdownParentTagVisible}
								setIsVisible={setIsDropdownParentTagVisible}
								selectedParentTag={selectedParentTag}
								setSelectedParentTag={setSelectedParentTag}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 mt-5">
					<button
						className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
						onClick={closeModal}
					>
						Close
					</button>
					<button
						className={
							'bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600 min-w-[114px]' +
							(!name ? ' opacity-50' : '')
						}
						onClick={handleAddTag}
					>
						{isEditingTag ? 'Edit' : 'Save'}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddTag;
