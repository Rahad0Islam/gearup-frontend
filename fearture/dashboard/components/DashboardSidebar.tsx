import getme from "@/app/(authGroup)/_actions/getCurrentUser";
import { CustomerSidebar } from "@/fearture/customer/components/customer-sidebar";


export default async function DashboardSidebar() {
  const me = await getme();

  return (
    <CustomerSidebar
      role={me?.data?.role ?? "CUSTOMER"}
    />
  );
}