import { useState } from 'react';
import Icon from '../Icon';
import Modal from './Modal';

interface ModalTaskActivitiesProps {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalTaskActivities: React.FC<ModalTaskActivitiesProps> = ({ isModalOpen, setIsModalOpen }) => {
	// TODO: Setup logic on the backend for Task Activities as well how to structure them. There'll be some stuff to be on the lookout for.
	const [activityList, setActivityList] = useState([
		{
			_id: 1,
			username: 'curlos',
			actionDesc: 'completed the task',
			actionType: 'complete',
			date: '10/14/2023 15:48',
		},
		{
			_id: 1,
			username: 'curlos',
			actionDesc: 'changed the progress to 100%',
			actionType: 'edit',
			date: '10/14/2023 14:54',
		},
		{
			_id: 1,
			username: 'curlos',
			actionDesc: 'changed the progress to 96%',
			actionType: 'edit',
			date: '10/14/2023 13:52',
		},
		{
			_id: 1,
			username: 'curlos',
			actionDesc: 'undid the task',
			actionType: 'undone',
			date: '10/14/2023 15:48',
		},
		{
			_id: 1,
			username: 'curlos',
			actionDesc: 'completed the task',
			actionType: 'complete',
			date: '10/14/2023 15:48',
		},
		{
			_id: 1,
			username: 'curlos',
			actionDesc: 'created the task',
			actionType: 'create',
			date: '10/14/2023 15:48',
		},
	]);

	return (
		<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center">
			<div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[16px]">Task Activities</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setIsModalOpen(false)}
					/>
				</div>

				<div>
					{activityList.map((activity) => {
						const { _id, username, actionDesc, actionType, date } = activity;

						return (
							<li
								key={_id}
								className="relative m-0 list-none last:mb-[4px] mt-[24px]"
								style={{ minHeight: '54px' }}
							>
								<div
									className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-color-gray-100"
									style={{ height: 'calc(100% - 16px)' }}
								></div>

								<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
									<div className="absolute left-[-40px] w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
										{actionType === 'edit' ? (
											<Icon
												name="edit"
												customClass={
													'!text-[16px] text-white cursor-pointer bg-yellow-500 rounded-full p-1'
												}
												fill={1}
											/>
										) : actionType === 'complete' ? (
											<Icon
												name="done"
												customClass={
													'!text-[16px] text-white cursor-pointer bg-emerald-400 rounded-full p-1'
												}
												fill={1}
											/>
										) : actionType === 'undone' ? (
											<Icon
												name="redo"
												customClass={
													'!text-[16px] text-white cursor-pointer bg-gray-400 rounded-full p-1 -scale-x-100'
												}
												fill={1}
											/>
										) : (
											<Icon
												name="add"
												customClass={
													'!text-[16px] text-white cursor-pointer bg-blue-500 rounded-full p-1 -scale-x-100'
												}
												fill={1}
											/>
										)}
									</div>

									<div>
										<div className="flex items-center gap-3">
											<div>{username}</div>
											<div className="text-color-gray-100">{actionDesc}</div>
										</div>
										<div className="text-[12px] mt-1 text-color-gray-100">{date}</div>
									</div>
								</div>
							</li>
						);
					})}
				</div>
			</div>
		</Modal>
	);
};

export default ModalTaskActivities;
