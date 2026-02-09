import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';


export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/:db/:docname/',
    component: lazy(() => import('./pages/reestrs')),
  },
  {
    path: '/contract/:id',
    component: lazy(() => import('./pages/contract')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
