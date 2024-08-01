import { useDispatch } from 'react-redux';
import FocusRecordList from '../../../components/FocusRecords/FocusRecordList';
import Icon from '../../../components/Icon';
import { setModalState } from '../../../slices/modalSlice';
import DetailsCard from './DetailsCard';
import MostFocusedTimeCard from './MostFocusedTimeCard';
import OverviewCard from './OverviewCard';
import TimelineCard from './TimelineCard';
import TrendsCard from './TrendsCard';
import YearGridsCard from './YearGridsCard';

const FocusSection = () => {
	const dispatch = useDispatch();

	return (
		<div>
			<OverviewCard />

			<div className="mt-5 flex items-center gap-5">
				<div className="flex-[5] w-full">
					<DetailsCard />
				</div>

				<div className="flex-[4] w-full">
					<div className="bg-color-gray-600 p-3 rounded-lg h-[338px]">
						<div className="flex justify-between items-center gap-2 mb-5">
							<div className="text-[15px] font-bold">Focus Record</div>
							<Icon
								name="add"
								customClass={
									'!text-[22px] text-blue-500 bg-blue-500/20 rounded-full cursor-pointer hover:bg-color-gray-300'
								}
								onClick={() =>
									dispatch(setModalState({ modalId: 'ModalAddFocusRecord', isOpen: true }))
								}
							/>
						</div>

						<div className="max-h-[270px] overflow-auto gray-scrollbar">
							<FocusRecordList />
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-5 mt-5">
				<TrendsCard />
				<TimelineCard />
				<MostFocusedTimeCard />
				<YearGridsCard />
			</div>
		</div>
	);
};

export default FocusSection;
