import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";

import GAUtil from "@/components/utils/GAUtil.tsx";
import TanStackRouterDevtools from "@/components/utils/RouterDevTools.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      {import.meta.env.PROD && <GAUtil />}
      <header className="py-4 text-center">
        <Link to="/">
          <img src="/logo_light.svg" alt="LE SSERAFIM" width={150} />
        </Link>
      </header>
      <ScrollRestoration />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
