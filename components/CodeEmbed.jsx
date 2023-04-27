import React, { useRef } from "react";
import { FiCopy } from "react-icons/fi"; // Import copy icon from react-icons

const CodeEmbed = () => {
  const codeRef = useRef(null); // Ref to reference the code element

  const handleCopy = () => {
    const codeElement = codeRef.current;
    const range = document.createRange();
    range.selectNode(codeElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  };

  return (
    <div
      data-aos="fade-down"
      style={{
        background: "#EDEFF3",
        borderRadius: "8px",
        padding: "24px",
        width: "100%",
        margin: "16px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "8px",
        }}
      >
        <FiCopy
          style={{ cursor: "pointer", color: "#2E3542" }}
          onClick={handleCopy}
          title="Copy code"
        />
      </div>
      <pre
        ref={codeRef}
        style={{
          fontFamily: "monospace",
          fontSize: "14px",
          margin: "0",
          whiteSpace: "pre-wrap",
        }}
      >
        <code
          style={{
            color: "#2E3542",
          }}
        >
          {`const postData = async () => {
  try {
    const url = "http://localhost:3001/imageCreater";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text_item_number: 1234, // this is an image title which can range between 100 to 9999
        clearance: 1, // This range from 1-6
        containment: "safe", // check the other field are listed in the config
        secondary: "apollyon", // check the other field are listed in the config
        disruption: 1, // 1-Dark This range from 1-5
        risk: 2, // This range from 1-5
        theme: 0, //0-Default, This range from 0-3
        type: "png", // The image type are "svg" and "png"
        iconpack: "extended_secondary", // the iconpack are default and extended_secondary
        image_size: 1, // 1 is the default preview size of the generated image
        opacityBackground: 0 // 0 is transparent while 1 is not transparent
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const imgData = data.image;
    let svgData = atob(data.image);
    const imgUrl = "data:image/svg+xml;base64," + btoa(svgData); // this is response for svg image path
    const imgUrl = \`data:image/png;base64,\${imgData}\`; // this is the path response for png image
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};`}
        </code>
      </pre>
    </div>
  );
};

export default CodeEmbed;
