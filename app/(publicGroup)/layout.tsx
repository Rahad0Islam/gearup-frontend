    import React from "react"

    const publicLayout = async ({ children }: { children: React.ReactNode }) => {
      return <div className="min-h-screen pt-24 lg:pt-28">{children}</div>
    }

    export default publicLayout