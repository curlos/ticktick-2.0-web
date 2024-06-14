import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	positionClasses?: string;
	customClasses?: string;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, positionClasses, customClasses, children }) => {
	const containerVariants = {
		hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 0.5 },
	};

	const containerClasses = `z-50 relative p-3 max-w-full w-[500px]`;

	return (
		<AnimatePresence>
			{isOpen && (
				<div
					className={classNames(
						'fixed inset-0 z-50 overflow-auto bg-smoke-light flex justify-center items-center',
						positionClasses ? positionClasses : ''
					)}
				>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={backdropVariants}
						className="fixed inset-0 bg-black"
						onClick={onClose}
						style={{ zIndex: 49 }}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={containerVariants}
						className={classNames(containerClasses, customClasses)}
					>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
