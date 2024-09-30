import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="loader">
      <Image
        src="/assets/icons/loader.svg"
        alt="Loading..."
        width={32}
        height={32}
        className="animate-spin"
      ></Image>
    </div>
  );
};

export default Loader;
