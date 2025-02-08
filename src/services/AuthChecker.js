import { useNavigate } from "react-router-dom";

const useRedirect = () => {
  const navigate = useNavigate();

  const redirect = (condition) => {
    if (condition) {
      navigate("/");
    }
  };

  const redirectTo = (route) => {
    if (route) {
      console.log(route)
      navigate(route);
    }
  };

  return { redirect, redirectTo };
};

export default useRedirect;
