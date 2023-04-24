import React from "react";
import imglogo from "../public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect } from "react";
const Index = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center py-4 px-8 md:px-16 md:py-4 overflow-hidden ">
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
      <h1
        id="demotext"
        className="text-center text-6xl font-bold mb-2 demotext2"
        data-aos="flip-left"
        data-aos-delay="100"
      >
        Welcome to Ravenhub&apos;s
      </h1>
      <h1
        id="demotext"
        className="text-center text-4xl font-bold mb-5"
        data-aos="flip-right"
        data-aos-delay="200"
      >
        SCP ACS Image Generator
      </h1>
      <p className="text-2xl mb-10 text-center text-black" data-aos="fade">
        Create your own custom ACS Label in just a few seconds
      </p>
      <div
        className="flex flex-col md:flex-row gap-10 items-center mb-12"
        data-aos="fade-left"
      >
        <div>
          <Link href={"/generate_image"}>
            <span
              className="text-1xl text-white bg-black rounded-full px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 customBtNewe cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
              aria-label="Generate Acs"
            >
              Generate an Image
            </span>
          </Link>
        </div>
        <div>
          <Link href={"/documentation"}>
            <span
              className="text-1xl rounded-full text-black border-2 border-black  px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 customBtNewe cursor-pointer hover:bg-black hover:text-white"
              aria-label="Api"
            >
              Check our Api
            </span>
          </Link>
        </div>
      </div>

      <h1
        className=" font-bold text-3xl mt-4 mb-8 text-black"
        data-aos="fade-left"
      >
        What is this Website?
      </h1>
      <div
        className="flex flex-col gap-4
       text-center w-full justify-center md:w-4/5 bg-black p-12 rounded-xl mb-14"
        data-aos="fade"
      >
        <p className="text-white" data-aos="fade-left">
          At Ravenhub, we&apos;re excited to offer our SCP ACS Image Generator,
          a user-friendly tool that allows you to create custom anomaly
          classification system ACS labels quickly and easily.
        </p>
        <p className="text-white" data-aos="fade-right">
          Our generator lets you choose from various options, including icon
          packs and themes, to create unique ACS labels and match the look and
          feel of your content. Whether you&apos;re a writer creating labels for
          your SCP Foundation fan fiction or a gamer looking to add some extra
          detail to your tabletop or online roleplaying game, our ACS Image
          Generator can help you create professional-quality labels in just a
          few clicks.
        </p>
        <p className="text-white" data-aos="fade-left">
          Our generator outputs high-quality PNG and SVG images that you can use
          in various ways, from digital content to print materials. And for
          developers, we offer an API that makes it easy to integrate our
          service into your applications.
        </p>
        <p className="text-white" data-aos="fade-right">
          At Ravenhub, we&apos;re committed to providing a top-notch user
          experience. That&apos;s why our SCP ACS Image Generator is designed to
          be easy to use and highly customizable, so you can create perfect
          labels for your needs.
        </p>
        <p className="text-white" data-aos="fade-left">
          So why wait? Try our Image Generator today and see how easy it is to
          create stunning custom labels in just a few clicks!
        </p>
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

export default Index;
