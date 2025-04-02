import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    let scrollTimeout: number;

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }

        // Set scrolling state
        setIsScrolling(true);
        clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
            setIsScrolling(false);
        }, 150); // Delay để animation smooth hơn
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            clearTimeout(scrollTimeout);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <motion.div
                        animate={{
                            rotate: isScrolling ? [0, -10, 10, -10, 10, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button
                            onClick={scrollToTop}
                            className="relative group p-2 w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 backdrop-blur-sm"
                            size="icon"
                            aria-label="Scroll to top"
                        >
                            <motion.div
                                animate={{
                                    y: isScrolling ? [0, -2, 2, -2, 2, 0] : 0
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <ArrowUp className="h-5 w-5" />
                            </motion.div>


                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;