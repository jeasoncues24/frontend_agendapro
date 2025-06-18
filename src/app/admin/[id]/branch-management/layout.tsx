import { HeaderAdmin } from "@/components/headerAdmin/HeaderAdmin"
import { CustomToaster } from "@/components/ui/custom-toast"

export default async function BranchManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CustomToaster />
      <HeaderAdmin />
      {children}
    </>
  )
} 