import * as React from 'react'
import { MakeRouteMatchUnion, Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
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
import { RouteContext } from '@/main'

export const Route = createRootRouteWithContext<RouteContext>()({
    component: RootRouteComponent,
})

const name = (context: MakeRouteMatchUnion): string => {
    if ("crumb" in context.staticData && typeof context.staticData.crumb == 'string') {
        return context.staticData.crumb
    }

    if (context.routeId == "/") {
        return "Index"
    }

    return context.pathname
        .substring(1)
        .toLowerCase()
        .replace(/(?:^|\b)[a-z]/g, (m: string) => m.toUpperCase())
        .replace(/\/|\-/g, ' ')
}

const buildBreadcrumbs = (matches: MakeRouteMatchUnion[]) => {
    const breadcrumbs = matches.map((context) => {
        return {
            title: name(context),
            path: context.pathname,
        }
    })

    // Remove 'Root' layout
    breadcrumbs.shift();

    return breadcrumbs;
}

function RootRouteComponent() {
    const matches = useRouterState({ select: (s) => s.matches })
    const breadcrumbs = buildBreadcrumbs(matches);
    const activePath = matches[matches.length - 1].pathname;

    return (
        <React.Fragment>
            <SidebarProvider>
                <AppSidebar path={activePath} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {breadcrumbs.length <= 0 ? null :
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        {breadcrumbs.map((crumb, index) => (
                                            <span key={`div-${index}`}>
                                                <BreadcrumbItem key={`item-${index}`}>
                                                    <BreadcrumbLink key={`link-${index}`} href={crumb.path}>
                                                        <BreadcrumbPage key={`page-${index}`}>{crumb.title}</BreadcrumbPage>
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                { (breadcrumbs.length - 2 >= index) ? <BreadcrumbSeparator key={`separator-${index}`}/> : <span />}
                                            </span>
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
