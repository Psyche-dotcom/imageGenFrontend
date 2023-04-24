import { Inter } from "next/font/google";
import Field from "../components/Field";
import { useState } from "react";
import TextInputField from "../components/TextInputFied";
import FieldSelect from "../components/FieldSelect";
import Field2 from "../components/Field2";
import Field3 from "../components/Field3";
import Field4 from "../components/Field4";
import imglogo from "../public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import FieldSelect2 from "../components/FieldSelect2";
import Field5 from "../components/Field5";
import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Generate() {
  const [selectedOption, setSelectedOption] = useState("safe");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("1");
  const [selectedOption4, setSelectedOption4] = useState("");
  const [selectedOption5, setSelectedOption5] = useState("1");
  const [selectedOption6, setSelectedOption6] = useState("1");
  const [selectedOption7, setSelectedOption7] = useState("0");
  const [selectedOption8, setSelectedOption8] = useState("default");
  const [selectedOption9, setSelectedOption9] = useState("png");
  const [selectedOption10, setSelectedOption10] = useState("1");
  const [fetchImgUrl, setfetchImgUrl] = useState("");
  const [content, setcontent] = useState(true);
  const [errorState, seterrorState] = useState(false);
  useEffect(() => {
    Aos.init({ duration: 800 });
  }, []);
  const postData = async () => {
    try {
      const url = "http://localhost:3001/imageCreater";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_item_number: selectedOption2,
          clearance: selectedOption6,
          containment: selectedOption.toLowerCase(),
          secondary: selectedOption4.toLowerCase(),
          disruption: selectedOption3,
          risk: selectedOption5,
          theme: selectedOption7,
          type: selectedOption9,
          iconpack: selectedOption8,
          image_size: selectedOption10,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const imgData = data.image;
      if (selectedOption9 == "svg") {
        let svgData = atob(data.image);
        const imgUrl = "data:image/svg+xml;base64," + btoa(svgData);
        setcontent(false);
        setfetchImgUrl(imgUrl);
      } else {
        const imgUrl = `data:image/png;base64,${imgData}`;
        setcontent(false);
        setfetchImgUrl(imgUrl);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8 md:p-16 overflow-hidden">
      <div className="relative mb-12 flex flex-col place-items-center ">
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

      {content ? (
        <div className="z-1000" data-aos="fade-zoom-in">
          <p className="flex text-center justify-center bg-black text-white mb-8 pb-6 pt-8 rounded-xl lg:p-4">
            Fill the field appropriately to generate your ACS bar Image
          </p>
          <div
            className="p-9 rounded-3xl border-2 border-gray-400"
            data-aos="fade-left"
          >
            <form className="w-full">
              <div className="flex flex-col gap-8" id="stepUser1">
                <TextInputField
                  id="1"
                  type="text"
                  placeholder="Enter a number between 100-9999"
                  setstate={(e) => setSelectedOption2(e)}
                  errorState={errorState}
                  errorMessage={"Please enter a number between 100-9999"}
                  name="Image Title"
                />
                <Field
                  name={"Containment Class"}
                  op1={"Safe"}
                  op2={"Euclid"}
                  op3={"Keter"}
                  op4={"Neutralized"}
                  op5={"Pending"}
                  op6={"Explained"}
                  op7="Esoteric"
                  selectedOption={selectedOption}
                  setSelectedOption={(e) => setSelectedOption(e)}
                />
                <Field3
                  name={"Theme"}
                  op1={"0"}
                  opN1="0-Default"
                  op2={"1"}
                  opN2="1-Hybrid"
                  op3={"2"}
                  opN3="2-Textual"
                  op4={"3"}
                  opN4="3-Splitter"
                  selectedOption={selectedOption7}
                  setSelectedOption={(e) => setSelectedOption7(e)}
                />
                <Field4
                  name={"Icon Pack"}
                  op1={"default"}
                  op2={"extended_secondary"}
                  selectedOption={selectedOption8}
                  setSelectedOption={(e) => setSelectedOption8(e)}
                />

                <div
                  onClick={() => {
                    const stepUser1 = document.querySelector("#stepUser1");
                    const stepUser2 = document.querySelector("#stepUser2");
                    if (selectedOption2.length < 1) {
                      seterrorState(true);
                      stepUser1.style.display = "flex";
                    } else {
                      seterrorState(false);
                      stepUser1.style.display = "none";
                      stepUser2.style.display = "flex";
                    }
                  }}
                >
                  <span
                    className="text-1xl text-white bg-black px-10 py-2 lg:px-6 lg:py-2 rounded-3xl xl:px-8 xl:py-4 cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                    aria-label="Next"
                  >
                    Next
                  </span>
                </div>

                <p className="text-greyLight mt-4 text-center">1/3</p>
              </div>
              <div className="hidden flex-col gap-8" id="stepUser2">
                {selectedOption8 == "extended_secondary" ? (
                  <Field5
                    name={"Secondary Class"}
                    op1={"Apollyon"}
                    op2={"Archon"}
                    op3={"Cernunnos"}
                    op4={"Decommissioned"}
                    op5={"Hiemal"}
                    op6={"Tiamat"}
                    op7="Ticonderoga"
                    op8="Thaumiel"
                    op9="Uncontained"
                    op10="Yesod"
                    op11="Roll"
                    op12="N/A"
                    op13="Necropsar"
                    op14="Marksur"
                    op15="Declassifed"
                    op16="Gevurah"
                    op17="Eparch"
                    op18="Embla"
                    op19="Dryigioni"
                    op20="Continua"
                    op21="chhokmah"
                    selectedOption={selectedOption4}
                    setSelectedOption={(e) => setSelectedOption4(e)}
                  />
                ) : (
                  <Field2
                    name={"Secondary Class"}
                    op1={"Apollyon"}
                    op2={"Archon"}
                    op3={"Cernunnos"}
                    op4={"Decommissioned"}
                    op5={"Hiemal"}
                    op6={"Tiamat"}
                    op7="Ticonderoga"
                    op8="Thaumiel"
                    op9="Uncontained"
                    selectedOption={selectedOption4}
                    setSelectedOption={(e) => setSelectedOption4(e)}
                  />
                )}

                <FieldSelect2
                  name={"Risk Level"}
                  op1={"1"}
                  opN1="1-Notice"
                  op2={"2"}
                  opN2="2-Caution"
                  op3={"3"}
                  opN3="3-Warning"
                  op4={"4"}
                  opN4="4-Danger"
                  op5={"5"}
                  opN5="5-Critical"
                  selectedOption={selectedOption5}
                  setSelectedOption={(e) => setSelectedOption5(e)}
                />
                <FieldSelect
                  name={"Clearance Level"}
                  op1={"1"}
                  opN1="Clearance Level 1"
                  op2={"2"}
                  opN2="Clearance Level 2"
                  op3={"3"}
                  opN3="Clearance Level 3"
                  op4={"4"}
                  opN4="Clearance Level 4"
                  op5={"5"}
                  opN5="Clearance Level 5"
                  op6={"6"}
                  opN6="Clearance Level 6"
                  selectedOption={selectedOption6}
                  setSelectedOption={(e) => setSelectedOption6(e)}
                />
                <div className="flex gap-10 items-center">
                  <div
                    onClick={() => {
                      const stepUser1 = document.querySelector("#stepUser1");
                      const stepUser2 = document.querySelector("#stepUser2");
                      const stepUser3 = document.querySelector("#stepUser3");
                      stepUser1.style.display = "flex";
                      stepUser2.style.display = "none";
                      stepUser3.style.display = "none";
                    }}
                  >
                    <span
                      className="text-1xl text-white rounded-3xl bg-black px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 customBtNewe cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                      aria-label="Next"
                    >
                      Back
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      const stepUser1 = document.querySelector("#stepUser1");
                      const stepUser2 = document.querySelector("#stepUser2");
                      const stepUser3 = document.querySelector("#stepUser3");
                      stepUser1.style.display = "none";
                      stepUser2.style.display = "none";
                      stepUser3.style.display = "flex";
                    }}
                  >
                    <span
                      className="text-1xl text-white rounded-3xl bg-black px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 customBtNewe cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                      aria-label="Next"
                    >
                      Next
                    </span>
                  </div>
                </div>

                <p className="text-greyLight mt-4 text-center">2/3</p>
              </div>
              <div className=" hidden flex-col gap-8" id="stepUser3">
                <FieldSelect2
                  name={"Disruption Class"}
                  op1={"1"}
                  opN1="1-Dark"
                  op2={"2"}
                  opN2="2-Vlam"
                  op3={"3"}
                  opN3="3-Keneq"
                  op4={"4"}
                  opN4="4-Ehki"
                  op5={"5"}
                  opN5="5-Amida"
                  selectedOption={selectedOption3}
                  setSelectedOption={(e) => setSelectedOption3(e)}
                />
                <FieldSelect2
                  name={"Image Size"}
                  op1={"1"}
                  opN1="1-Default"
                  op2={"2"}
                  opN2="2x"
                  op3={"3"}
                  opN3="3x"
                  op4={"4"}
                  opN4="4x"
                  op5={"5"}
                  opN5="5x"
                  selectedOption={selectedOption10}
                  setSelectedOption={(e) => setSelectedOption10(e)}
                />
                <Field4
                  name={"Image Type"}
                  op1={"png"}
                  op2={"svg"}
                  selectedOption={selectedOption9}
                  setSelectedOption={(e) => setSelectedOption9(e)}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex gap-10 items-center">
                    <div
                      onClick={() => {
                        const stepUser1 = document.querySelector("#stepUser1");
                        const stepUser2 = document.querySelector("#stepUser2");
                        const stepUser3 = document.querySelector("#stepUser3");
                        stepUser1.style.display = "none";
                        stepUser2.style.display = "flex";
                        stepUser3.style.display = "none";
                      }}
                    >
                      <span
                        className="text-1xl rounded-3xl text-white bg-black px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 customBtNewe cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                        aria-label="Next"
                      >
                        Back
                      </span>
                    </div>
                    <div onClick={postData}>
                      <span
                        className="text-1xl text-white rounded-3xl bg-black px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 customBtNewe cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                        aria-label="Sign_up"
                      >
                        Generate Image
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-greyLight mt-4 text-center">3/3</p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div id="z-10000">
          <img src={fetchImgUrl} alt="generated-img" />

          <div className="flex gap-6 items-center xl:gap-12 mt-10 flex-col">
            <div>
              <a href={fetchImgUrl} download>
                <span
                  className="text-1xl text-white bg-black px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                  aria-label="Next"
                >
                  Download image
                </span>
              </a>
            </div>
            <div>
              <Link href={"/generate_image"}>
                <span
                  className="text-1xl text-white bg-black px-10 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-4 cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                  aria-label="Next"
                  onClick={() => setcontent(true)}
                >
                  Generate Another image
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
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
}
