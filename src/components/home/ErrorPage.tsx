import Image from "next/image";
import Bounded from "../elements/Bounded";
import { Button } from "../ui/button";

const ErrorPage = () => {
  return (
    <main className="bg-black text-white py-10">
      <div className="flex justify-center items-center flex-col ">
        <h1 className="text-9xl font-bold ">Oops!</h1>
        <p className="text-2xl font-semibold text-center mt-10">
          Your came in right place
          <br />
          but Wrong Time
        </p>
        <Image
          src={"/assets/404.png"}
          width={1280}
          height={1080}
          className="max-w-6xl -mt-28"
          alt="404"
        />
        <Button className="px-10 text-xl">Go Home</Button>
      </div>
    </main>
  );
};

export default ErrorPage;
