import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { HomePage } from "./pages/HomePage";
import { Stage1DetailPage } from "./pages/Stage1DetailPage";
import { Stage2DetailPage } from "./pages/Stage2DetailPage";
import { Stage3DetailPage } from "./pages/Stage3DetailPage";
import { Stage4DetailPage } from "./pages/Stage4DetailPage";
import { Stage5DetailPage } from "./pages/Stage5DetailPage";
import { Stage6DetailPage } from "./pages/Stage6DetailPage";
import { Stage7DetailPage } from "./pages/Stage7DetailPage";
import { Stage8DetailPage } from "./pages/Stage8DetailPage";
import { Stage9DetailPage } from "./pages/Stage9DetailPage";
import { Stage10DetailPage } from "./pages/Stage10DetailPage";
import { Stage11DetailPage } from "./pages/Stage11DetailPage";
import { Stage12DetailPage } from "./pages/Stage12DetailPage";

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const stage1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/1",
  component: Stage1DetailPage,
});

const stage2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/2",
  component: Stage2DetailPage,
});

const stage3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/3",
  component: Stage3DetailPage,
});

const stage4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/4",
  component: Stage4DetailPage,
});

const stage5Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/5",
  component: Stage5DetailPage,
});

const stage6Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/6",
  component: Stage6DetailPage,
});

const stage7Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/7",
  component: Stage7DetailPage,
});

const stage8Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/8",
  component: Stage8DetailPage,
});

const stage9Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/9",
  component: Stage9DetailPage,
});

const stage10Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/10",
  component: Stage10DetailPage,
});

const stage11Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/11",
  component: Stage11DetailPage,
});

const stage12Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/etappe/12",
  component: Stage12DetailPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  stage1Route,
  stage2Route,
  stage3Route,
  stage4Route,
  stage5Route,
  stage6Route,
  stage7Route,
  stage8Route,
  stage9Route,
  stage10Route,
  stage11Route,
  stage12Route,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
