export interface ISidebarRoute {
    label: string,
    codesCanAccess: string[],
    rolesCanAccess: string[],
    hidden: boolean,
    status: boolean,
    routes: ISidebarChildrenRoute[]
}

interface ISidebarChildrenRoute {
    label: string,
    route: string,
    routeQuery: string[],
    class: string,
    codesCanAccess: string[],
    rolesCanAccess: string[],
    status: boolean,
    routes: ISidebarGrandChildrenRoute[]
}

interface ISidebarGrandChildrenRoute {
    label: string,
    route: string,
    routeQuery: string[],
    class: string,
    codesCanAccess: string[],
    rolesCanAccess: string[],
    status: boolean
}
