

import getCurrentUser from "@/app/(authGroup)/_actions/getCurrentUser";
import NavbarClient from "./navbarClient";


   export default async function Navbar() {
    const user = await getCurrentUser();

     return <NavbarClient user={user?.data} />;
}