import classNames from 'classnames';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { DropdownProps } from '../../../interfaces/interfaces';
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
				'shadow-2xl border border-color-gray-200 rounded-lg max-h-[276px] overflow-auto gray-scrollbar',
				customClasses
			)}
		>
			<div className="w-[355px] p-3">
				<div className="text-[15px] font-bold mb-4">Focus Ranking</div>

				<div className="space-y-4">
					{progressData.map((item) => (
						<ProgressBar key={item.name} item={item} fromDropdown={true} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownFocusRankingList;
