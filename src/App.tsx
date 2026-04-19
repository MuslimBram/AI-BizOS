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
import { CallCenter } from './pages/CallCenter';
import { AIStrategist } from './pages/AIStrategist';
import { Automations } from './pages/Automations';
import { Helpdesk } from './pages/Helpdesk';
import { Billing } from './pages/Billing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Auth2FA } from './pages/Auth2FA';
import { PendingApproval } from './pages/PendingApproval';
import { WorkspaceSettings } from './pages/WorkspaceSettings';
import { AutonomousOS } from './pages/AutonomousOS';
import { IntegrationHub } from './pages/IntegrationHub';
import { AdminPanel } from './pages/AdminPanel';
// (Keep remaining imports...)
import { ActivationStatus } from './pages/admin/ActivationStatus';
import { PlatformAnalytics } from './pages/admin/PlatformAnalytics';
import { SaaSHealth } from './pages/admin/SaaSHealth';
import { SourcesScanner } from './pages/admin/SourcesScanner';

// Optimization Core
import { PricingOffers } from './pages/optimization/PricingOffers';
import { Personalization } from './pages/optimization/Personalization';
import { DemandForecast } from './pages/optimization/DemandForecast';
import { WorkforceAI } from './pages/optimization/WorkforceAI';
import { ProcessAI } from './pages/optimization/ProcessAI';
import { FunnelAI } from './pages/optimization/FunnelAI';
import { CustomerValue } from './pages/optimization/CustomerValue';

// Intelligence
import { CompetitorIntel } from './pages/intelligence/CompetitorIntel';
import { SEOAudit } from './pages/intelligence/SEOAudit';
import { BrandReputation } from './pages/intelligence/BrandReputation';
import { CustomerExperience } from './pages/intelligence/CustomerExperience';
import { RetentionIntel } from './pages/intelligence/RetentionIntel';
import { KeywordEngine } from './pages/intelligence/KeywordEngine';
import { KnowledgeBase } from './pages/intelligence/KnowledgeBase';

// Engagement
import { Partnerships } from './pages/engagement/Partnerships';
import { ReEngagement } from './pages/engagement/ReEngagement';
import { GrowthLoop } from './pages/engagement/GrowthLoop';
import { Community } from './pages/engagement/Community';
import { LeadMagnets } from './pages/engagement/LeadMagnets';
import { Gamification } from './pages/engagement/Gamification';
import { MediaStudio } from './pages/engagement/MediaStudio';
import { Broadcast } from './pages/engagement/Broadcast';

// Integrations Subpages
import { IntegrationChannels } from './pages/integrations/Channels';
import { IntegrationAccounts } from './pages/integrations/Accounts';
import { PublicAPI } from './pages/integrations/PublicAPI';
import { AppsMarketplace } from './pages/integrations/Marketplace';
import { DeveloperSettings } from './pages/integrations/DeveloperSettings';

// Business & Billing Subpages
import { BrandingProfile } from './pages/business/BrandingProfile';
import { CoreFinancials } from './pages/business/CoreFinancials';
import { BusinessWallet } from './pages/business/BusinessWallet';
import { CreditsManagement } from './pages/business/CreditsManagement';
import { BusinessPartners } from './pages/business/BusinessPartners';
import { ResellerPortal } from './pages/business/ResellerPortal';
import { OpsHealth } from './pages/business/OpsHealth';
import { SecurityCompliance } from './pages/business/SecurityCompliance';
import { ManagedBusinesses } from './pages/business/ManagedBusinesses';

// Main Subpages
import { LeadsManager } from './pages/main/LeadsManager';
import { SalesEngine } from './pages/main/SalesEngine';
import { RevenueEngine } from './pages/main/RevenueEngine';
import { BusinessAnalytics } from './pages/main/BusinessAnalytics';

// Growth & AI Core Subpages
import { MarketingAuto } from './pages/growth/MarketingAuto';
import { MarketExpansion } from './pages/growth/MarketExpansion';
import { AIDecisions } from './pages/growth/AIDecisions';
import { BizBenchmarks } from './pages/growth/BizBenchmarks';

import { AuthProvider, useAuth } from './lib/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, is2FAVerified } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If we haven't passed 2FA, restrict dashboard
  if (!is2FAVerified) {
    return <Navigate to="/2fa" replace />;
  }

  // If user is neither owner nor admin, verify payment status
  if (user.role !== 'owner' && user.role !== 'admin') {
    if (user.status === 'pending') {
      return <Navigate to="/pending-approval" replace />;
    }
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, is2FAVerified } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const isSuperAdmin = user?.role === 'owner' || user?.role === 'admin';
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!is2FAVerified) {
    return <Navigate to="/2fa" replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/2fa" element={<Auth2FA />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="crm" element={<CRM />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="main/leads" element={<LeadsManager />} />
            <Route path="main/sales" element={<SalesEngine />} />
            <Route path="main/revenue" element={<RevenueEngine />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="main/analytics" element={<BusinessAnalytics />} />
            <Route path="calls" element={<CallCenter />} />
            <Route path="ai/strategist" element={<AIStrategist />} />
            <Route path="automations" element={<Automations />} />
            <Route path="autonomous-os" element={<AutonomousOS />} />
            
            {/* Growth & AI Core subpages */}
            <Route path="growth/marketing" element={<MarketingAuto />} />
            <Route path="growth/expansion" element={<MarketExpansion />} />
            <Route path="growth/decisions" element={<AIDecisions />} />
            <Route path="growth/benchmarks" element={<BizBenchmarks />} />

            <Route path="integrations" element={<IntegrationHub />} />
            <Route path="integrations/channels" element={<IntegrationChannels />} />
            <Route path="integrations/accounts" element={<IntegrationAccounts />} />
            <Route path="integrations/api" element={<PublicAPI />} />
            <Route path="integrations/marketplace" element={<AppsMarketplace />} />
            <Route path="integrations/developer" element={<DeveloperSettings />} />

            <Route path="helpdesk" element={<Helpdesk />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<WorkspaceSettings />} />

            {/* Business & Billing Area */}
            <Route path="business/branding" element={<BrandingProfile />} />
            <Route path="business/financials" element={<CoreFinancials />} />
            <Route path="business/wallet" element={<BusinessWallet />} />
            <Route path="business/credits" element={<CreditsManagement />} />
            <Route path="business/partners" element={<BusinessPartners />} />
            <Route path="business/reseller" element={<ResellerPortal />} />
            <Route path="business/ops-health" element={<OpsHealth />} />
            <Route path="business/security" element={<SecurityCompliance />} />
            <Route path="business/managed" element={<ManagedBusinesses />} />

            {/* Optimization AI Area */}
            <Route path="optimization/pricing" element={<PricingOffers />} />
            <Route path="optimization/personalization" element={<Personalization />} />
            <Route path="optimization/forecast" element={<DemandForecast />} />
            <Route path="optimization/workforce" element={<WorkforceAI />} />
            <Route path="optimization/process" element={<ProcessAI />} />
            <Route path="optimization/funnel" element={<FunnelAI />} />
            <Route path="optimization/customer-value" element={<CustomerValue />} />

            {/* Intelligence Area */}
            <Route path="intelligence/competitor" element={<CompetitorIntel />} />
            <Route path="intelligence/seo" element={<SEOAudit />} />
            <Route path="intelligence/brand" element={<BrandReputation />} />
            <Route path="intelligence/experience" element={<CustomerExperience />} />
            <Route path="intelligence/retention" element={<RetentionIntel />} />
            <Route path="intelligence/keywords" element={<KeywordEngine />} />
            <Route path="intelligence/kb" element={<KnowledgeBase />} />

            {/* Engagement Area */}
            <Route path="engagement/partnerships" element={<Partnerships />} />
            <Route path="engagement/re-engagement" element={<ReEngagement />} />
            <Route path="engagement/growth-loop" element={<GrowthLoop />} />
            <Route path="engagement/community" element={<Community />} />
            <Route path="engagement/lead-magnets" element={<LeadMagnets />} />
            <Route path="engagement/gamification" element={<Gamification />} />
            <Route path="engagement/media-studio" element={<MediaStudio />} />
            <Route path="engagement/broadcast" element={<Broadcast />} />
            
            {/* Super Admin Area */}
            <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="admin/activation" element={<AdminRoute><ActivationStatus /></AdminRoute>} />
            <Route path="admin/analytics" element={<AdminRoute><PlatformAnalytics /></AdminRoute>} />
            <Route path="admin/health" element={<AdminRoute><SaaSHealth /></AdminRoute>} />
            <Route path="admin/scanner" element={<AdminRoute><SourcesScanner /></AdminRoute>} />

            {/* Catch missing routes for now */}
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  );
}
