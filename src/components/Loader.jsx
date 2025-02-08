const Loader = ({ message }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    );
  };
  
  export default Loader;
  