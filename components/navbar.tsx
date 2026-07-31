

import getCurrentUser from "@/app/(authGroup)/_actions/getCurrentUser";
import { getCategoriesAction } from "@/fearture/provider/actions/gear.action";
import NavbarClient from "./navbarClient";


   export default async function Navbar() {
    const user = await getCurrentUser();
    const categoriesResult = await getCategoriesAction();

   return <NavbarClient user={user?.data} categories={categoriesResult?.data || []} />;
}