import { Package } from "@prisma/client"

export type TPackageNavigation =  Pick<Package, 'slug' | 'id' | 'title'>    