import React from 'react';

interface PaginationProps {
	total: number; // Total number of pages
	current: number; // Current page number
	onChange: (page: number) => void; // Function to call when a new page is selected
}

const Pagination: React.FC<PaginationProps> = ({ total, current, onChange }) => {
	const numPagesToShow = 9; // Maximum number of pages to display in the paginator

	// Generate the list of page numbers to display
	const getPages = (): number[] => {
		const pages: number[] = [];
		const halfWay = Math.floor(numPagesToShow / 2);

		let lowerBound = current - halfWay;
		let upperBound = current + halfWay;

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
				className={`p-2 rounded ${current === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-500/50'}`}
				disabled={current === 1}
				onClick={() => onChange(current - 1)}
			>
				{'<'}
			</button>
			{current > numPagesToShow / 2 + 1 && (
				<>
					<button className="px-2 py-1" onClick={() => onChange(1)}>
						1
					</button>
					{current > numPagesToShow / 2 + 2 && <span className="px-2 py-1">...</span>}
				</>
			)}
			{pages.map((page) =>
				page === current ? (
					<button
						key={page}
						className="px-2 py-1 rounded bg-blue-500 text-white"
						onClick={() => onChange(page)}
					>
						{page}
					</button>
				) : (
					<button
						key={page}
						className="px-2 py-1 hover:bg-blue-500/50 rounded"
						onClick={() => onChange(page)}
					>
						{page}
					</button>
				)
			)}
			{current < total - numPagesToShow / 2 && (
				<>
					{current < total - numPagesToShow / 2 - 1 && <span className="px-2 py-1">...</span>}
					<button className="px-2 py-1" onClick={() => onChange(total)}>
						{total}
					</button>
				</>
			)}
			<button
				className={`p-2 rounded ${current === total ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-500/50'}`}
				disabled={current === total}
				onClick={() => onChange(current + 1)}
			>
				{'>'}
			</button>
		</div>
	);
};

export default Pagination;
