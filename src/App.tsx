/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { CRM } from './pages/CRM';
import { Inbox } from './pages/Inbox';
import { Campaigns } from './pages/Campaigns';

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="crm" element={<CRM />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="campaigns" element={<Campaigns />} />
            {/* Catch missing routes for now */}
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
