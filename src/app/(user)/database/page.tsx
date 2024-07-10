"use client";

import { handleSubmit } from "@/app/Actions/CreateImageAction";
import Bounded from "@/components/elements/Bounded";
import { Button } from "@/components/ui/button";
import { url } from "inspector";
import { ChangeEvent, useState } from "react";

const Add = () => {
  const [data, setData] = useState({
    url: "",
    alt: "",
    packageId: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setData((c) => ({
      ...c,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <Bounded>
      <h1 className="font-bold text-4xl my-5">Upload Image</h1>
      <form onSubmit={async () => await handleSubmit(data)}>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="url"
            value={data.url}
            className="outline-none shadow"
            placeholder="Enter URL"
            onChange={handleChange}
          />
          <input
            type="text"
            name="alt"
            value={data.alt}
            className="outline-none shadow"
            placeholder="Enter ALT"
            onChange={handleChange}
          />
          <input
            type="text"
            value={data.packageId}
            name="packageId"
            className="outline-none shadow"
            placeholder="Enter PACKAGE Id"
            onChange={handleChange}
          />
          <Button type="submit">add data</Button>
        </div>
      </form>
    </Bounded>
  );
};

export default Add;
