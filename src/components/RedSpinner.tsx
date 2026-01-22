
const RedSpinner = () => (
    <div className="flex justify-center items-center w-full ">
        <div
            className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"
            style={{ borderTopColor: '#DB2727' }}
            role="status"
            aria-label="loading"
        />
    </div>
);

export default RedSpinner;
