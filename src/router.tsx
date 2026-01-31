import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/components/layout';
import { HomePage } from '@/pages/home-page';
import { TaskHistoryPage } from '@/pages/task-history-page';
import { NotFoundPage } from '@/pages/not-found-page';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'history/:taskId', element: <TaskHistoryPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: '/work-time-tracker',
  }
);
