import * as React from 'react'
import { MakeRouteMatchUnion, Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export const Route = createRootRoute({
    component: RootComponent,
})

const name = (context: MakeRouteMatchUnion): string => {
    if ("crumb" in context.staticData && typeof context.staticData.crumb == 'string') {
        return context.staticData.crumb
    }

    if (context.routeId == "/") {
        return "Index"
    }

    return context.pathname
        .toLowerCase()
        .replace(/(?:^|\b)[a-z]/g, (m) => m.toUpperCase())
        .replace('/', '')
        .replace('-', ' ')
}

function RootComponent() {
    const matches = useRouterState({ select: (s) => s.matches })

    const breadcrumbs = matches.map((context) => {
        return {
          title: name(context),
          path: context.pathname,
        }
      })

    // Remove 'Root' layout
    breadcrumbs.shift();

    const lastIndex = breadcrumbs.length - 1;
    const noBreadcrumbs = breadcrumbs.length <= 0;

    return (
        <React.Fragment>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            { noBreadcrumbs ? null :
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        {breadcrumbs.map((crumb, index) => (
                                            <div key={index}>
                                                <BreadcrumbItem>
                                                    <BreadcrumbLink href={crumb.path}>
                                                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                { index < lastIndex ? <BreadcrumbSeparator className="hidden md:block" /> : null }
                                            </div>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            }

                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </React.Fragment>
    )
}
