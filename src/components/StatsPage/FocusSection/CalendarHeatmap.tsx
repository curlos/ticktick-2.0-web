import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const sample = [
	{ Date: '2017-08-30', AnswerCount: '9510' },
	{ Date: '2010-05-23', AnswerCount: '2096' },
	{ Date: '2014-01-10', AnswerCount: '11451' },
	{ Date: '2019-03-23', AnswerCount: '4393' },
	{ Date: '2013-03-07', AnswerCount: '11811' },
	{ Date: '2016-10-25', AnswerCount: '9897' },
	{ Date: '2012-04-09', AnswerCount: '7342' },
	{ Date: '2019-02-28', AnswerCount: '8749' },
	{ Date: '2010-09-17', AnswerCount: '4535' },
	{ Date: '2014-05-07', AnswerCount: '11354' },
	{ Date: '2015-01-23', AnswerCount: '9172' },
	{ Date: '2012-05-02', AnswerCount: '9222' },
];

const CalendarHeatmap = () => {
	const ref = useRef();

	useEffect(() => {
		if (sample.length) {
			drawHeatmap();
		}
	}, [sample]); // Depending on your needs, this might need to be refined

	sample.sort((a, b) => new Date(a.Date) - new Date(b.Date));

	const dateValues = sample.map((dv) => ({
		date: d3.timeDay(new Date(dv.Date)),
		value: Number(dv.AnswerCount),
	}));

	const drawHeatmap = () => {
		const svg = d3.select(ref.current);

		const years = Array.from(
			d3.group(dateValues, (d) => d.date.getUTCFullYear()),
			([key, values]) => ({ key, values })
		).reverse();

		const values = dateValues.map((c) => c.value);
		const maxValue = d3.max(values);
		const minValue = d3.min(values);

		const cellSize = 15;
		const yearHeight = cellSize * 7;

		const group = svg.append('g');

		const year = group
			.selectAll('g')
			.data(years)
			.join('g')
			.attr('transform', (d, i) => `translate(50, ${yearHeight * i + cellSize * 1.5})`);

		year.append('text')
			.attr('x', -5)
			.attr('y', -30)
			.attr('text-anchor', 'end')
			.attr('font-size', 16)
			.attr('font-weight', 550)
			.attr('transform', 'rotate(270)')
			.text((d) => d.key);

		const formatDay = (d) => ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][d.getUTCDay()];
		const countDay = (d) => d.getUTCDay();
		const timeWeek = d3.utcSunday;
		const formatDate = d3.utcFormat('%x');
		const colorFn = d3.scaleSequential(d3.interpolateBuGn).domain([Math.floor(minValue), Math.ceil(maxValue)]);
		const format = d3.format('+.2%');

		year.append('g')
			.attr('text-anchor', 'end')
			.selectAll('text')
			.data(d3.range(7).map((i) => new Date(1995, 0, i)))
			.join('text')
			.attr('x', -5)
			.attr('y', (d) => (countDay(d) + 0.5) * cellSize)
			.attr('dy', '0.31em')
			.attr('font-size', 12)
			.text(formatDay);

		year.append('g')
			.selectAll('rect')
			.data((d) => d.values)
			.join('rect')
			.attr('width', cellSize - 1.5)
			.attr('height', cellSize - 1.5)
			.attr('x', (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10)
			.attr('y', (d) => countDay(d.date) * cellSize + 0.5)
			.attr('fill', (d) => colorFn(d.value))
			.append('title')
			.text((d) => `${formatDate(d.date)}: ${d.value.toFixed(2)}`);

		const legend = group
			.append('g')
			.attr('transform', `translate(10, ${years.length * yearHeight + cellSize * 4})`);

		const categoriesCount = 10;
		const categories = [...Array(categoriesCount)].map((_, i) => {
			const upperBound = (maxValue / categoriesCount) * (i + 1);
			const lowerBound = (maxValue / categoriesCount) * i;

			return {
				upperBound,
				lowerBound,
				color: d3.interpolateBuGn(upperBound / maxValue),
				selected: true,
			};
		});

		const legendWidth = 60;

		function toggle(legend) {
			const { lowerBound, upperBound, selected } = legend;

			legend.selected = !selected;

			const highlightedDates = years.map((y) => ({
				key: y.key,
				values: y.values.filter((v) => v.value > lowerBound && v.value <= upperBound),
			}));

			year.data(highlightedDates)
				.selectAll('rect')
				.data(
					(d) => d.values,
					(d) => d.date
				)
				.transition()
				.duration(500)
				.attr('fill', (d) => (legend.selected ? colorFn(d.value) : 'white'));
		}

		legend
			.selectAll('rect')
			.data(categories)
			.enter()
			.append('rect')
			.attr('fill', (d) => d.color)
			.attr('x', (d, i) => legendWidth * i)
			.attr('width', legendWidth)
			.attr('height', 15)
			.on('click', toggle);

		legend
			.selectAll('text')
			.data(categories)
			.join('text')
			.attr('transform', 'rotate(90)')
			.attr('y', (d, i) => -legendWidth * i)
			.attr('dy', -30)
			.attr('x', 18)
			.attr('text-anchor', 'start')
			.attr('font-size', 11)
			.text((d) => `${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`);

		legend
			.append('text')
			.attr('dy', -5)
			.attr('font-size', 14)
			.attr('text-decoration', 'underline')
			.text('Click on category to select/deselect days');
	};

	return (
		<div className="heatmap-container">
			<svg ref={ref}></svg>
		</div>
	);
};

export default CalendarHeatmap;
