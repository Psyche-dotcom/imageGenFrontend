import Image from "next/image";
import React from "react";
import imglogo from "../public/logo.png";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";

const Display_result = () => {
  const imageUrl = require("../../output/image.png").default;
  // const imgUrl = localStorage.getItem("myImage");
  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 md:p-16">
      <Link href={"/"}>
        <Image src={imglogo} width={100} className="imghero2" alt="logo" />
      </Link>

      {/* <h1 id="demotext" className="text-center text-6xl font-bold mb-2">
        Welcome to Ravenhubs
      </h1>

      <h1 id="demotext" className="text-center text-4xl font-bold mb-16">
        SCP ACS Image Generator
      </h1> */}
      {/* <Image src={imgUrl} alt="gener" /> */}
      <Image src={imageUrl} alt="generated image" className="mb-8" />
      <div>
        <Link href={"/generate_image"}>
          <span
            className="text-1xl text-white bg-black px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
            aria-label="Next"
          >
            Generate Another image
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-4 items-center customfixed">
        <Link href={"https://github.com/Rabenherz112"} target="blank">
          <AiFillGithub className=" text-4xl" />
        </Link>
        <Link href={"https://discord.gg/ySk5eYrrjG"} target="blank">
          <FaDiscord className="text-4xl" />
        </Link>
      </div>
    </div>
  );
};

export default Display_result;
