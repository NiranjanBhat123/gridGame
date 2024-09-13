import React from 'react';
import { motion } from 'framer-motion';
import { GiGoldBar } from 'react-icons/gi';

const GoldAnimation = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 1, 0],
                }}
                transition={{
                    duration: 1,
                    times: [0, 0.5, 1],
                    ease: "easeInOut",
                }}
            >
                <GiGoldBar className="text-yellow-500 text-8xl" />
            </motion.div>
        </div>
    );
};

export default GoldAnimation;