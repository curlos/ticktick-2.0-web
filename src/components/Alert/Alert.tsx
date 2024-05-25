import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IAlert {
	isOpen: boolean;
	position?: string;
	customClasses?: string;
	children: React.ReactNode;
	onClose?: () => void; // Function to call when closing the alert
	duration?: Object;
}

const Alert: React.FC<IAlert> = ({ isOpen, position, customClasses, children, onClose, duration }) => {
	let containerClasses = `z-50 transition-all duration-1000 ease-in-out transform p-3 max-w-full min-w-[80px] bg-color-gray-200 rounded-lg`;

	// Animation classes based on position
	const positionClasses = {
		'top-center': 'mx-auto mt-[60px]',
		'bottom-center': 'mx-auto bottom-0 mb-[50px] translate-y-full', // Start translated down
		center: 'mx-auto my-auto',
	};

	const openDuration = duration && duration.open !== undefined ? duration.open : 0.2;
	const closeDuration = duration && duration.close !== undefined ? duration.close : 1;

	// Define motion variants for the alert animations
	const variants = {
		open: { y: 0, opacity: 1, transition: { duration: openDuration } },
		closed: { y: 100, opacity: 0, transition: { duration: closeDuration } },
	};

	// Combine classes
	containerClasses += ` ${positionClasses[position] || 'mx-auto my-auto'}`;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className={`fixed inset-0 z-50 overflow-auto flex items-end ${position === 'center' ? 'justify-center' : ''}`}
					initial="closed"
					animate="open"
					exit="closed"
					variants={variants}
				>
					<div className={`${containerClasses} ${customClasses || ''}`}>{children}</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Alert;
