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
				// // Calculate the necessary margin-top adjustment
				const requiredMarginTop = -(dropdownRect.height + (toggleRect?.height || 0) + 7);
				console.log(dropdownRect);
				console.log(toggleRect);
				adjustments.marginTop = `${requiredMarginTop}px`;
			}

			// Check if dropdown exceeds the right side of the viewport
			if (dropdownRect.right > window.innerWidth) {
				adjustments.right = '0px'; // Align right edge with the toggle element or adjust as necessary
				adjustments.left = 'auto'; // Reset left positioning if right adjustment is made
			}

			// Apply styles directly to adjust the dropdown's positioning
			Object.assign(dropdownRef.current.style, adjustments);
		}
	}, [isVisible]); // Depend on isVisible to re-calculate on show

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
