import React, { useEffect, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownProps } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseDropdownProps extends DropdownProps {
	children: React.ReactNode;
	positionAdjustment?: string;
}

const Dropdown: React.FC<BaseDropdownProps> = ({
	children,
	isVisible,
	setIsVisible,
	customClasses,
	positionAdjustment,
	toggleRef,
	customStyling,
	innerClickElemRefs,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useOutsideClick(dropdownRef, toggleRef, innerClickElemRefs, () => {
		setIsVisible(false);
	});

	useEffect(() => {
		if (isVisible && dropdownRef.current) {
			const dropdownRect = dropdownRef.current.getBoundingClientRect();
			const toggleRect = toggleRef?.current?.getBoundingClientRect();
			const adjustments = {};

			// Check if dropdown exceeds the bottom of the viewport
			if (dropdownRect.bottom > window.innerHeight) {
				// If the bottom portion of the dropdown exceeds the screen's height, then set a negative margin top to adjust the dropdown so that it fits within the screen.
				const paddingAboveRelativeButton = 20;
				const requiredMarginTop = -(
					dropdownRect.height +
					(toggleRect?.height || 0) +
					paddingAboveRelativeButton
				);
				adjustments.marginTop = `${requiredMarginTop}px`;

				const spaceAbove = toggleRect?.top;

				// If the dropdown's height is greater than the space above it, then set the negative margin to the total space above it. The dropdowns always start off being completely below the relative button where it's opened from so giving it a negative margin of the total screen height ABOVE it should move it enough so that it's NOT BELOW the screen height anymore BUT also so that it doesn't go ABOVE the screen height either. The only dropdowns that will suffer from a condition like this are very tall ones so most of the dropdowns will not apply here. The main one I know will do this is DropdownCalendar because there is A LOT going on there.
				if (dropdownRect.height > spaceAbove) {
					adjustments.marginTop = `${-spaceAbove}px`;
				}
			}

			// Check if dropdown exceeds the right side of the viewport
			if (dropdownRect.right > window.innerWidth) {
				adjustments.right = '0px'; // Align right edge with the toggle element or adjust as necessary
				adjustments.left = 'auto'; // Reset left positioning if right adjustment is made
			}

			// Apply styles directly to adjust the dropdown's positioning
			Object.assign(dropdownRef.current.style, adjustments);
		}
	}, [isVisible]);

	// Animation variants
	const variants = {
		hidden: {
			opacity: 0,
			scale: 0.95,
			transition: {
				duration: 0.2,
			},
		},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.2,
			},
		},
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					ref={dropdownRef}
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={variants}
					className={classNames(
						'absolute top-full left-0 z-50 text-white bg-color-gray-600 rounded-lg text-sm mt-[4px]',
						positionAdjustment || '',
						customClasses || ''
					)}
					style={customStyling || {}}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Dropdown;
