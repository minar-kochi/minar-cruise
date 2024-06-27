import { db } from "@/db";
import { TPackageNavigation } from "@/db/types/TPackage";

export async function getPackageNavigation(): Promise<TPackageNavigation[]> {
    const data =  await db.package.findMany({
        select: {
            slug: true,
            title:true,
            id:true,
        }
      });
      if(!data.length) {
        return [{
            id: 'fasfasfasf',
            slug: "/",
            title: "Home"
        }]
      }  
      return data
} 