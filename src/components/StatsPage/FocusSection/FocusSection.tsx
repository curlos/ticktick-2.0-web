import DetailsCard from './DetailsCard';
import OverviewCard from './OverviewCard';

const FocusSection = () => {
	return (
		<div>
			<OverviewCard />

			<div className="mt-5 flex items-center gap-5">
				<div className="flex-[5] w-full">
					<DetailsCard />
				</div>

				<div className="flex-[4] w-full"></div>
			</div>
		</div>
	);
};

export default FocusSection;
