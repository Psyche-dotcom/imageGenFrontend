import Link from "next/link";
import React from "react";
import imglogo from "../public/logo.png";
import Image from "next/image";
import CodeEmbed from "../components/CodeEmbed";
import "aos/dist/aos.css";
import Aos from "aos";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { useEffect } from "react";

const Documentation = () => {
  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-6 p-8 md:p-16 overflow-hidden">
      <div className="relative flex flex-col place-items-center ">
        <Link href={"/"}>
          <Image
            src={imglogo}
            width={100}
            className="imghero2"
            alt="logo"
            data-aos="fade-zoom-in"
            data-aos-easing="ease-in-sine"
          />
        </Link>
      </div>
      <h1
        className=" font-bold text-3xl mt-4 mb-4 text-center text-black"
        data-aos="fade-left"
      >
        Information About the API?
      </h1>
      <div
        className="flex flex-col w-full md:w-4/5 bg-black p-12 md:p-20 rounded-xl mb-14"
        data-aos="fade"
      >
        <ul className="text-white list-disc" data-aos="fade-left">
          <li>
            contaiment_class is the contaiment class of the SCP. This can be any
            value defined in libary//config.json/containment-class (e.g. safe)
          </li>
          <li>
            secondary_class is a optional value. It can be any value defined in
            libary//config.json/secondary-class (e.g. apollyon)
          </li>
          <li>
            disruption_class is the disruption level of the SCP. This can be any
            value defined in libary//config.json/disruption-class (e.g. 1)
          </li>
          <li>
            risk_class is the risk level of the SCP. This can be any value
            defined in libary//config.json/risk-class (e.g. 1)
          </li>
          <li>
            opacityBackground is the opacity of the background. This can either
            be 0 or 1.
          </li>
          <li>
            theme is which theme should be used to generate the image. This can
            be a number between 0 and 3. 0 is the default theme, 1 is the Hybrid
            theme, 2 is the Textual theme and 3 is the Splitter theme.
          </li>
          <li>
            type defines which image should be generated. This either can be png
            or svg.
          </li>
          <li>
            iconpack defines which iconpack should be used. Since I currenty
            only have two iconpacks, this can be either default or
            extended_secondary.
          </li>
        </ul>
      </div>
      <div>
        <p
          className=" font-bold text-3xl  text-black text-center"
          data-aos="fade-right"
        >
          SCP API base Url{" "}
        </p>
        <h2
          className=" font-bold text  text-black text-center mt-4"
          data-aos="fade-left"
        >
          http://localhost:3001/imageCreater
        </h2>
      </div>
      <h1
        className=" font-bold text-3xl  text-black text-center"
        data-aos="fade-right"
      >
        How to use the API?
      </h1>
      <div>
        <CodeEmbed />
      </div>
      <div className="flex flex-col gap-4 items-center customfixed">
        <Link href={"https://github.com/Rabenherz112"} target="blank">
          <AiFillGithub className=" text-4xl text-black" />
        </Link>
        <Link href={"https://discord.gg/ySk5eYrrjG"} target="blank">
          <FaDiscord className="text-4xl text-black" />
        </Link>
      </div>
    </main>
  );
};

export default Documentation;
