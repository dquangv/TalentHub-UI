
export const LoadingEffect = () => {
    return (
        <div className="w-full flex justify-center items-center py-12">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-white bg-opacity-80 rounded-full shadow-inner">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoadingEffect;