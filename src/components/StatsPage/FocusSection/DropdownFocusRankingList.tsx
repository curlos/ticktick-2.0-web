import classNames from 'classnames';
import { DropdownProps } from '../../../interfaces/interfaces';
import Dropdown from '../../Dropdown/Dropdown';
import ProgressBar from './ProgressBar';

interface DropdownPrioritiesProps extends DropdownProps {
	customClasses: string;
}

const DropdownFocusRankingList: React.FC<DropdownPrioritiesProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	progressData,
}) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames(
				'shadow-2xl border border-color-gray-200 rounded-lg mt-[-305px] max-h-[276px] overflow-auto gray-scrollbar',
				customClasses
			)}
		>
			<div className="w-[355px] p-3">
				<div className="text-[15px] font-bold mb-4">Focus Ranking</div>

				<div className="space-y-4">
					{progressData.map((item) => (
						<ProgressBar item={item} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownFocusRankingList;
