import React, { forwardRef, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownProps } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseDropdownProps extends DropdownProps {
	children: React.ReactNode;
	positionAdjustment?: string;
}

const Dropdown = forwardRef<HTMLDivElement, BaseDropdownProps>(
	({ children, isVisible, setIsVisible, customClasses, positionAdjustment, toggleRef, customStyling }, ref) => {
		const dropdownRef = useRef(null);
		useOutsideClick(dropdownRef, toggleRef, () => setIsVisible(false));

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
	}
);

export default Dropdown;
