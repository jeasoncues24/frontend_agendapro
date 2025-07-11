'use client'

import { AppSidebar } from "@/components/app-sidebar"
import HeaderComponent from "@/components/header/Header"
import { CustomToaster } from "@/components/ui/custom-toast"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { usePathname, useParams } from 'next/navigation'
import SubscriptionBanner from "@/components/SubscriptionBanner"
import { useEffect, useState } from "react"
import { getSubscriptionStatus, SubscriptionStatusResponse } from "@/services/subscription.service"

export default function AppAgendaPro({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const companyId = params.id as string;
  const isBranchManagementRoute = pathname.includes('/branch-management');

  const [subscription, setSubscription] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    getSubscriptionStatus(companyId)
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, [companyId]);

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        {!isBranchManagementRoute && <AppSidebar className="fixed" />}
        <SidebarInset>
          <CustomToaster />
          {/* Banner de suscripción */}
          {!loading && subscription && (
            <SubscriptionBanner 
              active={subscription.active} 
              daysLeft={subscription.daysLeft} 
              onRenew={() => window.location.href = `/admin/${companyId}/settings/finance`} 
            />
          )}
          { !isBranchManagementRoute && <HeaderComponent /> }
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
