import { useEffect } from "react";
import ReactGA from "react-ga4";

import { useRouterState } from "@tanstack/react-router";

function GAUtil() {
  const { location } = useRouterState();

  useEffect(() => {
    ReactGA.initialize("G-8TM31QVBJC");
  }, []);

  useEffect(() => {
    ReactGA.send("pageview");
  }, [location.pathname, location.search]);

  return null;
}

export default GAUtil;
