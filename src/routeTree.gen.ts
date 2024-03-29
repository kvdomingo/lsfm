/* eslint-disable */

/* prettier-ignore */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const DigitalsouvenirMemberLazyImport = createFileRoute(
  '/digitalsouvenir/$member',
)()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const DigitalsouvenirMemberLazyRoute = DigitalsouvenirMemberLazyImport.update({
  path: '/digitalsouvenir/$member',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/digitalsouvenir/$member.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/digitalsouvenir/$member': {
      preLoaderRoute: typeof DigitalsouvenirMemberLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  DigitalsouvenirMemberLazyRoute,
])
