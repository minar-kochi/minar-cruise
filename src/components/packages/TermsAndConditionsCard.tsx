import Bounded from "../elements/Bounded";
import { terms } from "@/constants/termsAndConditions/terms";

const TermsAndConditionsCard = () => {
  return (
    <Bounded>
      <div className="mb-16 mt-5">
        <h3 className=" text-2xl font-bold px-2 border-l-2 border-red-400">
          Terms And Conditions
        </h3>
        <h2 className="my-3 text-xl font-bold">For Customers</h2>
        <ul className="leading-8">
          {terms.map((item, i) => (
            <>
              <li
                key={item + i}
                className="list-decimal list-inside text-muted-foreground"
              >
                {item}
              </li>
            </>
          ))}
        </ul>
      </div>
    </Bounded>
  );
};

export default TermsAndConditionsCard;
