import React, { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown/Dropdown';
import { DropdownProps } from '../interfaces/interfaces';
import classNames from 'classnames';
import CustomInput from './CustomInput';
import { debounce } from '../utils/helpers.utils';

interface PaginationProps {
	total: number; // Total number of pages
	currentPage: number; // Current page number
	setCurrentPage: (page: number) => void; // Function to call when a new page is selected
	totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ total, currentPage, setCurrentPage, totalPages }) => {
	const numPagesToShow = 9; // Maximum number of pages to display in the paginator

	// Generate the list of page numbers to display
	const getPages = (): number[] => {
		const pages: number[] = [];
		const halfWay = Math.floor(numPagesToShow / 2);

		let lowerBound = currentPage - halfWay;
		let upperBound = currentPage + halfWay;

		// Adjust bounds if the current page is close to either end
		if (lowerBound < 1) {
			upperBound = Math.min(numPagesToShow, total);
			lowerBound = 1;
		}
		if (upperBound > total) {
			upperBound = total;
			lowerBound = Math.max(total - numPagesToShow + 1, 1);
		}

		for (let i = lowerBound; i <= upperBound; i++) {
			pages.push(i);
		}
		return pages;
	};

	const pages = getPages();

	return (
		<div className="flex items-center space-x-2">
			<button
				className={`p-2 rounded ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-500/50'}`}
				disabled={currentPage === 1}
				onClick={() => setCurrentPage(currentPage - 1)}
			>
				{'<'}
			</button>
			{currentPage > numPagesToShow / 2 + 1 && (
				<>
					<button className="px-2 py-1" onClick={() => setCurrentPage(1)}>
						1
					</button>
					{currentPage > numPagesToShow / 2 + 2 && (
						<InBetweenPages {...{ currentPage, setCurrentPage, totalPages }} />
					)}
				</>
			)}
			{pages.map((page) =>
				page === currentPage ? (
					<button
						key={page}
						className="px-2 py-1 rounded bg-blue-500 text-white"
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>
				) : (
					<button
						key={page}
						className="px-2 py-1 hover:bg-blue-500/50 rounded"
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>
				)
			)}
			{currentPage < total - numPagesToShow / 2 && (
				<>
					{currentPage < total - numPagesToShow / 2 - 1 && (
						<InBetweenPages {...{ currentPage, setCurrentPage, totalPages }} />
					)}
					<button className="px-2 py-1" onClick={() => setCurrentPage(total)}>
						{total}
					</button>
				</>
			)}
			<button
				className={`p-2 rounded ${currentPage === total ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-500/50'}`}
				disabled={currentPage === total}
				onClick={() => setCurrentPage(currentPage + 1)}
			>
				{'>'}
			</button>
		</div>
	);
};

const InBetweenPages = ({ currentPage, setCurrentPage, totalPages }) => {
	const drodpownCustomPageNumberRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	return (
		<div className="relative">
			<span
				ref={drodpownCustomPageNumberRef}
				onClick={() => setIsDropdownVisible(!isDropdownVisible)}
				className="px-2 py-1 cursor-pointer"
			>
				...
			</span>

			<DropdownCustomPageNumber
				toggleRef={drodpownCustomPageNumberRef}
				isVisible={isDropdownVisible}
				setIsVisible={setIsDropdownVisible}
				{...{ currentPage, setCurrentPage, totalPages }}
				// customClasses="ml-[10px] mt-[-5px]"
			/>
		</div>
	);
};

interface DropdownAccountDetailsProps extends DropdownProps {}

const DropdownCustomPageNumber: React.FC<DropdownAccountDetailsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	currentPage,
	setCurrentPage,
	totalPages,
}) => {
	const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

	const minPages = 1;
	const maxPages = totalPages;

	useEffect(() => {
		setLocalCurrentPage(currentPage);
	}, [currentPage]);

	const handlePageChange = (newCurrentPage) => {
		if (newCurrentPage >= minPages && newCurrentPage <= maxPages) {
			setLocalCurrentPage(Number(newCurrentPage));
		}
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setCurrentPage(localCurrentPage);
					setIsVisible(false);
				}}
				className="p-2 w-[80px]"
			>
				<CustomInput
					value={localCurrentPage}
					setValue={handlePageChange}
					type="number"
					min={1}
					max={totalPages}
				/>
				<button
					type="submit"
					className="mt-2 w-full bg-blue-500 rounded-md py-1 cursor-pointer hover:bg-color-blue-600 p-3"
				>
					Ok
				</button>
			</form>
		</Dropdown>
	);
};

export default Pagination;
