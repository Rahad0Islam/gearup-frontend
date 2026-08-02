    import React from "react"

    import { SiteFooter } from "@/components/site-footer"

    const publicLayout = async ({ children }: { children: React.ReactNode }) => {
      return (
        <div className="flex min-h-screen flex-col pt-24 lg:pt-28">
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      )
    }

    export default publicLayout