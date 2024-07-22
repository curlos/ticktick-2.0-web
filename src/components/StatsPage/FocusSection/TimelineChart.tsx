import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const TimeHeatMap = () => {
	const [series, setSeries] = useState(
		Array.from({ length: 24 }, (_, i) => ({
			name: `${i}:00`,
			data: generateHourData(),
		}))
	);

	const [options, setOptions] = useState({
		chart: {
			height: 350,
			type: 'heatmap',
			toolbar: {
				show: true,
			},
		},
		plotOptions: {
			heatmap: {
				shadeIntensity: 0.5,
				radius: 0,
				useFillColorAsStroke: true,
				colorScale: {
					ranges: [
						{ from: 0, to: 0.1, color: '#FFFFFF', name: '0m' }, // 'bg-transparent' - Assuming no color as transparent
						{ from: 0.1, to: 1, color: '#D1D5DB', name: '0-1h' }, // 'bg-gray-300'
						{ from: 1, to: 3, color: '#BFDBFE', name: '1h-3h' }, // 'bg-blue-300'
						{ from: 3, to: 5, color: '#3B82F6', name: '3h-5h' }, // 'bg-blue-500'
						{ from: 5, to: 24, color: '#1E3A8A', name: '>5h' }, // 'bg-blue-800'
					],
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			type: 'category',
			categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			labels: {
				style: {
					colors: '#FFFFFF', // Set x-axis labels to white
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: '#FFFFFF', // Set y-axis labels to white
				},
			},
		},
		title: {
			text: 'Week Activity Heatmap',
			style: {
				color: '#FFFFFF', // Set title to white
			},
		},
	});

	return <ReactApexChart options={options} series={series} type="heatmap" height={350} />;
};

// Helper function to generate random data for each hour across the 7 days of the week
// Random data are scaled appropriately for demo purposes
function generateHourData() {
	return Array.from({ length: 7 }, () => Math.random() * 24);
}

export default TimeHeatMap;
