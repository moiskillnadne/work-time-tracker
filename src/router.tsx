import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/components/layout';
import { HomePage } from '@/pages/home-page';
import { HistoryPage } from '@/pages/history-page';
import { TaskHistoryPage } from '@/pages/task-history-page';
import { SettingsPage } from '@/pages/settings-page';
import { NotFoundPage } from '@/pages/not-found-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'history/:taskId', element: <TaskHistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
