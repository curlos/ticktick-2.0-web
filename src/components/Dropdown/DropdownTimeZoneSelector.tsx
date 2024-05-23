import Fuse from 'fuse.js';
import Dropdown from './Dropdown';
import { useEffect, useRef, useState } from 'react';
import { debounce } from '../../utils/helpers.utils';
import Icon from '../Icon';
import { DropdownProps } from '../../interfaces/interfaces';

interface DropdownTimeZoneSelectorProps extends DropdownProps {
	tempSelectedTimeZone: string;
	setTempSelectedTimeZone: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownTimeZoneSelector: React.FC<DropdownTimeZoneSelectorProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	tempSelectedTimeZone,
	setTempSelectedTimeZone,
}) => {
	const [allCities, setAllCities] = useState([]);
	const [cities, setCities] = useState([]);
	const [searchText, setSearchText] = useState('');
	const fuse = new Fuse(allCities, {
		includeScore: true,
	});

	useEffect(() => {
		const timeZonesWithOffset = getTimeZonesWithOffset();
		const citiesWithOffset = timeZonesWithOffset.map((timeZoneWithOffset) => {
			const { timeZone, offset } = timeZoneWithOffset;
			const city = timeZone.split('/')[timeZone.split('/').length - 1].replaceAll('_', ' ');
			const cityWithOffset = `${city}, ${offset}`;
			return cityWithOffset;
		});
		citiesWithOffset.sort();
		setAllCities(citiesWithOffset);
		setCities(citiesWithOffset);
	}, []);

	function getTimeZonesWithOffset() {
		// Get a list of all supported time zones
		const timeZones = Intl.supportedValuesOf('timeZone');

		// Map each time zone to an object with the time zone and its current offset
		const timeZonesWithOffset = timeZones.map((timeZone) => {
			const now = new Date();
			const formatOptions = { timeZone, hour12: false, timeZoneName: 'short' };
			const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
			const parts = formatter.formatToParts(now);
			const offset = parts?.find((part) => part.type === 'timeZoneName')?.value;

			return { timeZone, offset };
		});

		return timeZonesWithOffset;
	}

	const recentlySelectedCityWithOffset = ['New York, EDT', 'Barbados, AST', 'Sao Tome, GMT', 'Bangkok, GMT+7'];

	useEffect(() => {
		handleDebouncedSearch();
		// You may need a cleanup function depending on your setup
		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText]); // Executes when searchText changes

	const handleDebouncedSearch = debounce(() => {
		let searchedCities;

		if (searchText.trim() === '') {
			// If searchText is empty, consider all cities as the searched result.
			searchedCities = cities.map((city) => ({ item: city }));
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedCities = fuse.search(searchText);
		}

		setCities(searchedCities.map((result) => result.item));
	}, 1000);

	interface CityWithOffsetProps {
		cityWithOffset: string;
	}

	const CityWithOffset: React.FC<CityWithOffsetProps> = ({ cityWithOffset }) => (
		<div
			key={cityWithOffset}
			className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg"
			onClick={() => {
				setTempSelectedTimeZone(cityWithOffset);
				setIsVisible(false);
			}}
		>
			<div>{cityWithOffset}</div>
			{tempSelectedTimeZone === cityWithOffset && (
				<Icon
					name="check"
					fill={0}
					customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
				/>
			)}
		</div>
	);

	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [cities]); // Triggered when 'cities' changes

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={' shadow-2xl border border-color-gray-200 rounded-[4px]'}
		>
			<div className="w-[260px]">
				<div className="flex items-center gap-1 p-1 px-2">
					<Icon
						name="search"
						fill={0}
						customClass={'text-color-gray-50 !text-[24px] hover:text-white cursor-pointer'}
					/>
					<input
						placeholder="Search"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="text-[13px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none"
					/>
				</div>

				{recentlySelectedCityWithOffset && recentlySelectedCityWithOffset.length > 0 && (
					<div>
						{/* Only grab at most the 4 most recently selected cities */}
						{recentlySelectedCityWithOffset.slice(0, 4).map((cityWithOffset: string) => (
							<CityWithOffset cityWithOffset={cityWithOffset} />
						))}
					</div>
				)}

				<div
					ref={scrollRef}
					className="p-1 h-[150px] overflow-auto gray-scrollbar border-t border-color-gray-200"
				>
					{cities.map((cityWithOffset: string) => (
						<CityWithOffset key={cityWithOffset} cityWithOffset={cityWithOffset} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownTimeZoneSelector;
