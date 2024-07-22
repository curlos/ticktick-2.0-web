import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const TimelineChart = () => {
	const [series, setSeries] = useState(
		Array.from({ length: 24 }, (_, i) => ({
			name: `${i}:00`,
			data: generateHourData(),
		}))
	);

	const [options, setOptions] = useState({
		chart: {
			height: 250,
			type: 'heatmap',
			toolbar: {
				show: false,
			},
			background: 'transparent', // Dark background for the chart area
		},
		plotOptions: {
			heatmap: {
				shadeIntensity: 0.5,
				radius: 0,
				useFillColorAsStroke: true,
				colorScale: {
					ranges: [
						{ from: 0, to: 0.1, color: '#d1d5db', name: '0m' }, // Adjusted for dark mode visibility
						{ from: 0.1, to: 3, color: '#93c5fd', name: '0-1h' },
						{ from: 3, to: 7, color: '#3b82f6', name: '1h-3h' },
						{ from: 7, to: 12, color: '#2563eb', name: '3h-5h' },
						{ from: 12, to: 24, color: '#1e40af', name: '>5h' },
					],
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			type: 'category',
			categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			labels: {
				style: {
					colors: '#FFFFFF', // White labels for dark mode
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: '#FFFFFF', // White labels for dark mode
				},
			},
		},
		tooltip: {
			theme: 'dark', // Dark theme for tooltips
		},
		legend: {
			position: 'bottom',
			horizontalAlign: 'center', // Can be 'left', 'center', or 'right'
			markers: {
				width: 12,
				height: 12,
			},
			offsetY: -5,
		},
	});

	return <ReactApexChart options={options} series={series} type="heatmap" height={310} />;
};

// Helper function to generate random data for each hour across the 7 days of the week
// Random data are scaled appropriately for demo purposes
function generateHourData() {
	return Array.from({ length: 7 }, () => Math.random() * 24);
}

export default TimelineChart;
