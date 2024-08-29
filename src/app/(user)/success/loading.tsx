import React from "react";

export default function loading() {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      <div className="relative flex space-x-2 justify-center items-center bg-white min-h-[calc(100vh-60px)] dark:invert">
        <div className="flex">
          <span className="sr-only">Loading...</span>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
        </div>
        <div className="">
          <h1>Please wait while we confirm your order</h1>
          <p>please dont refresh </p>
        </div>
      </div>
    </div>
  );
}
