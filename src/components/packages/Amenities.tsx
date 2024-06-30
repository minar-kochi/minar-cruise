import { db } from "@/db";
import { Check } from "lucide-react";

interface TAmenities {
  amenitiesId: string;
}

export const Amenities = async ({ amenitiesId }: TAmenities) => {
  const amenitiesDetails = await db.amenities.findUnique({
    where: {
      id: amenitiesId,
    },
  });
  // console.log(e);
	
  return (
    <div className={"mt-4 space-y-3"}>
      <h3 className="font-bold text-2xl border-l-4 border-red-600 px-2 ">
        Included
      </h3>
      <ul>
        {amenitiesDetails?.description.map((item, i) => {
         const key = item.replaceAll(" ", "-") + '-' + i
				 return (
            <>
               <li className="list-inside flex indent-2" key={key} >
								<Check className="stroke-red-500"/>
								{item}
							</li>
              
            </>
          );
        })}
      </ul>
    </div>
  );
};
