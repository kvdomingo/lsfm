import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function GAUtil() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize("G-8TM31QVBJC");
  }, []);

  useEffect(() => {
    ReactGA.send("pageview");
  }, [location.pathname, location.search]);

  return null;
}

export default GAUtil;
