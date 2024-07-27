import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner.tsx";
import TanStackRouterDevtools from "@/components/utils/RouterDevTools.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="py-4 text-center">
        <Link to="/">
          <img src="/logo_light.svg" alt="LE SSERAFIM" width={150} />
        </Link>
      </header>
      <ScrollRestoration />
      <Outlet />
      <Toaster position="bottom-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
