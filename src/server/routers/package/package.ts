import { getPackageSearchItems } from "@/db/data/dto/package";
import { router, publicProcedure } from "@/server/trpc";

export const packageRouter = router({
    getPackages : publicProcedure.query(async()=>{
        try{ 
            const packages = await getPackageSearchItems();
            return packages;
        } catch (e) {
            return null
        }
    })
})


