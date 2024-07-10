import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

interface IAlert {
	isOpen: boolean;
	position?: string;
	customClasses?: string;
	children: React.ReactNode;
	onClose?: () => void; // Function to call when closing the alert
	duration?: Object;
}

const AlertTooltip: React.FC<IAlert> = ({
	isOpen,
	setIsOpen,
	position,
	customClasses,
	customTopClasses,
	children,
	duration,
}) => {
	useEffect(() => {
		if (isOpen) {
			// Set a timer to hide the alert after 1 second
			const timer = setTimeout(() => {
				setIsOpen(false);
			}, 600);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	let containerClasses = `relative z-50 transition-all duration-1000 ease-in-out transform p-1 max-w-full  bg-blue-500 rounded-lg text-[12px]`;

	// Animation classes based on position
	const positionClasses = {
		'top-center': 'mx-auto mt-[60px]',
		'bottom-center': 'mx-auto bottom-0 mb-[50px] translate-y-full', // Start translated down
		center: 'mx-auto my-auto',
	};

	const openDuration = duration && duration.open !== undefined ? duration.open : 0.2;
	const closeDuration = duration && duration.close !== undefined ? duration.close : 0.2;

	// Define motion variants for the alert animations
	const variants = {
		open: { y: 0, opacity: 1, transition: { duration: openDuration } },
		closed: { y: 0, opacity: 0, transition: { duration: closeDuration } },
	};

	// Combine classes
	containerClasses += ` ${positionClasses[position] || 'mx-auto my-auto'}`;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className={classNames(
						`absolute mt-[-35px] ml-[-10px] z-50 flex items-end`,
						position === 'center' ? 'justify-center' : '',
						customTopClasses ? customTopClasses : ''
					)}
					initial="closed"
					animate="open"
					exit="closed"
					variants={variants}
				>
					<div className={`tooltip-triangle ${containerClasses} ${customClasses || ''}`}>{children}</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AlertTooltip;
