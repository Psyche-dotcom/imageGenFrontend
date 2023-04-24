const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const express = require("./node_modules/express");
const app = express();
const port = 3001;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json()); // This middleware is needed to parse JSON request bodies

app.post("/imageCreater", (req, res) => {
  // // Variables which will be replaced by the user input
  // const c_text_item_number = "1034";
  const c_text_item_number = req.body.text_item_number;
  // // Size Factor 1 should be only used for preview NOT for final image
  const sizeFactor = req.body.image_size;
  // const clearance_level = 2;
  const clearance_level = req.body.clearance;
  // const containment_class = "apollyon";
  const containment_class = req.body.containment;
  // //const secondary_class = 'apollyon';
  const secondary_class = req.body.secondary;
  // const secondary_class = "archon";
  const disruption_class = req.body.disruption;
  // const disruption_class = 3;
  const risk_class = req.body.risk;
  // const risk_class = 1;
  const opacityBackground = 1;
  // const theme = 3;
  const theme = req.body.theme;

  // // 0 = Default, 1 = Hybrid, 2 = Textual, 3 = Splitter

  // const type = "png";
  const type = req.body.type;
  // // png or svg
  // const iconpack = "default";
  const iconpack = req.body.iconpack;
  // default or extended_secondary (see Library Folder)

  // Set Basic Size Dimensions for Canvas
  var c_height_default = sizeFactor * 200;
  var c_width_default = sizeFactor * 700;
  var c_height_hybrid = sizeFactor * 180;
  var c_width_hybrid = sizeFactor * 900;
  var c_height_splitter = sizeFactor * 200;
  var c_width_splitter = sizeFactor * 850;
  var c_background = `rgba(255, 255, 255, ${opacityBackground})`;

  // Get config file
  const config = require(`./library/${iconpack}/config.json`);

  // Helper Functions
  function drawLine(
    ctx,
    x,
    y,
    x2,
    y2,
    strokewidth = 1,
    color = "rgba(0, 0, 0, 1)"
  ) {
    // Save old settings
    let oldStyle = ctx.strokeStyle;
    let oldWidth = ctx.lineWidth;
    // Set new settings
    ctx.strokeStyle = color;
    ctx.lineWidth = strokewidth;
    // Draw line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
    // Restore old settings
    ctx.strokeStyle = oldStyle;
    ctx.lineWidth = oldWidth;
  }

  function drawLineRel(
    ctx,
    x,
    y,
    x2,
    y2,
    strokewidth = 1,
    color = "rgba(0, 0, 0, 1)"
  ) {
    // Save old settings
    let oldStyle = ctx.strokeStyle;
    let oldWidth = ctx.lineWidth;
    // Set new settings
    ctx.strokeStyle = color;
    ctx.lineWidth = strokewidth;
    // Draw line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + x2, y + y2);
    ctx.stroke();
    ctx.restore();
    // Restore old settings
    ctx.strokeStyle = oldStyle;
    ctx.lineWidth = oldWidth;
  }

  function drawCircle(
    ctx,
    x,
    y,
    radius,
    strokewidth = 1,
    color = "rgba(0, 0, 0, 1)"
  ) {
    // Save old settings
    let oldStyle = ctx.strokeStyle;
    let oldWidth = ctx.lineWidth;
    // Set new settings
    ctx.strokeStyle = color;
    ctx.lineWidth = strokewidth;
    // Draw line
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    // Restore old settings
    ctx.strokeStyle = oldStyle;
    ctx.lineWidth = oldWidth;
  }

  function fillCircle(
    ctx,
    x,
    y,
    radius,
    strokewidth = 1,
    color = "rgba(0, 0, 0, 1)"
  ) {
    // Save old settings
    let oldStyle = ctx.strokeStyle;
    let oldFill = ctx.strokeStyle;
    let oldWidth = ctx.lineWidth;
    // Set new settings
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = strokewidth;
    // Draw line
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    // Restore old settings
    ctx.strokeStyle = oldStyle;
    ctx.strokeStyle = oldFill;
    ctx.lineWidth = oldWidth;
  }

  function drawArrow(ctx, fromx, fromy, tox, toy, headlen, arrowWidth, color) {
    //variables to be used when creating the arrow
    var angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.save();
    ctx.strokeStyle = color;
    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();
    //starting a new path from the head of the arrow to one of the sides of
    //the point
    const something = 4;
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / something),
      toy - headlen * Math.sin(angle - Math.PI / something)
    );

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / something),
      toy - headlen * Math.sin(angle + Math.PI / something)
    );

    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / something),
      toy - headlen * Math.sin(angle - Math.PI / something)
    );

    //draws the paths created above
    ctx.stroke();
    ctx.restore();
  }

  function drawPolygon(
    ctx,
    x,
    y,
    radius,
    numberOfSides,
    rotation = Math.PI,
    strokewidth = 1,
    color = "rgba(0, 0, 0, 1)"
  ) {
    // Save old settings
    let oldStyle = ctx.strokeStyle;
    let oldFill = ctx.strokeStyle;
    let oldWidth = ctx.lineWidth;
    // Set new settings
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = strokewidth;
    // Draw polygon
    var angle = (2 * Math.PI) / numberOfSides;
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.moveTo(radius, 0);
    for (var i = 0; i < numberOfSides; i++) {
      ctx.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    // Restore old settings
    ctx.strokeStyle = oldStyle;
    ctx.strokeStyle = oldFill;
    ctx.lineWidth = oldWidth;
  }

  // Generation Functions
  async function layout_base_default(canvas) {
    /* ========== Create Canvas ========== */
    const ctx = canvas.getContext("2d");

    /* ========== Set Background ========== */
    ctx.fillStyle = c_background;
    ctx.fillRect(0, 0, c_width_default, c_height_default);

    /* ========== Add clearance level ========== */
    const clX = 200;
    const clY = 37;
    const clW = 300;
    const clH = 5;
    const cl_lines = clearance_level * 2 - 1; // to calculate the necessary spaces
    const cl_height = clH * cl_lines;
    const cl_start = clY - cl_height / 2;
    const old_gCO = ctx.globalCompositeOperation;

    // If Level 6, add image
    if (clearance_level == 6) {
      const img_galactic = await loadImage(`./library/extras/galactic.jpg`);
      ctx.drawImage(
        img_galactic,
        clX * sizeFactor,
        (cl_start - 2.5) * sizeFactor,
        clW * sizeFactor,
        cl_height * sizeFactor
      );
      ctx.globalCompositeOperation = "destination-out";
    }
    for (let i = 0; i < cl_lines; i++) {
      if (clearance_level == 6) {
        if (i % 2 == 0)
          // This is an empty line
          continue;

        // Lines for Removing parts of the image
        drawLineRel(
          ctx,
          clX * sizeFactor,
          (cl_start + clH * i) * sizeFactor,
          clW * sizeFactor,
          0,
          clH * sizeFactor,
          "rgba(255, 255, 255, 1)"
        );
      } else {
        if (i % 2 == 1)
          // This is an empty line
          continue;

        drawLineRel(
          ctx,
          clX * sizeFactor,
          (cl_start + clH * i) * sizeFactor,
          clW * sizeFactor,
          0,
          clH * sizeFactor,
          config["clearance-level"][clearance_level].color
        );
      }
    }

    // Reset globalCompositeOperation
    ctx.globalCompositeOperation = old_gCO;

    // For Level 6, fill the erased parts with background
    for (let i = 0; i < cl_lines; i++) {
      if (clearance_level != 6) break;

      if (i % 2 == 0)
        // This is an empty line
        continue;

      drawLineRel(
        ctx,
        clX * sizeFactor,
        (cl_start + clH * i) * sizeFactor,
        clW * sizeFactor,
        0,
        clH * sizeFactor,
        c_background
      );
    }

    /* ========== Add Text ========== */
    var fontsize;
    // Header block Item Number
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 20 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("ITEM#:", 5 * sizeFactor, 50 * sizeFactor);
    fontsize = 40 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(c_text_item_number, 73 * sizeFactor, 50 * sizeFactor);
    // Header block Clearance Level
    fontsize = 30 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["clearance-level"][clearance_level].dname,
      535 * sizeFactor,
      35 * sizeFactor
    );
    fontsize = 15 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["clearance-level"][clearance_level].abbr.toUpperCase(),
      535 * sizeFactor,
      55 * sizeFactor
    );
    /* ========== Finish ========== */
    return ctx;
  }

  async function layout_drawOctagon(ctx) {
    /* ========== Add Octagon ========== */
    ogX = 636;
    ogY = 136;
    ogSize = 54;
    ogAHL = 6; // Arrowhead Length
    ogW = 4; // Stroke Width
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX + ogSize) * sizeFactor,
      (ogY + ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX - ogSize) * sizeFactor,
      (ogY - ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX - ogSize) * sizeFactor,
      (ogY + ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX + ogSize) * sizeFactor,
      (ogY - ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    // Please don't ask why I need a correction factor of 1.008 for the radius
    drawPolygon(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogSize + ogW) * 1.008 * sizeFactor,
      8,
      Math.PI / 8,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
  }

  async function ctx_colorinvert(ctx) {
    let tmp = ctx.globalCompositeOperation;
    // Color invert image
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw image
    ctx.globalCompositeOperation = tmp;
  }

  async function layout_default(ctx) {
    /* ========== Add Lines & Boxes ========== */
    ctx.fillStyle =
      config["containment-class"][containment_class].color_transparent;
    ctx.fillRect(
      16 * sizeFactor,
      80 * sizeFactor,
      320 * sizeFactor,
      112 * sizeFactor
    ); // left side box - containment - 5 Pixels bezween the middle
    drawLine(
      ctx,
      0,
      70 * sizeFactor,
      700 * sizeFactor,
      70 * sizeFactor,
      4 * sizeFactor
    ); // top line
    drawLine(
      ctx,
      16 * sizeFactor,
      80 * sizeFactor,
      16 * sizeFactor,
      192 * sizeFactor,
      14 * sizeFactor,
      config["containment-class"][containment_class].color
    ); // left line
    ctx.fillStyle =
      config["disruption-class"][disruption_class].color_transparent;
    ctx.fillRect(
      350 * sizeFactor,
      80 * sizeFactor,
      220 * sizeFactor,
      53 * sizeFactor
    ); // right side box - disruption
    ctx.fillStyle = config["risk-class"][risk_class].color_transparent;
    ctx.fillRect(
      350 * sizeFactor,
      139 * sizeFactor,
      220 * sizeFactor,
      53 * sizeFactor
    ); // right side box - risk - 5 Pixels bezween the middle
    drawLineRel(
      ctx,
      350 * sizeFactor,
      80 * sizeFactor,
      0,
      53 * sizeFactor,
      8 * sizeFactor,
      config["disruption-class"][disruption_class].color
    ); // middle line disruption
    drawLineRel(
      ctx,
      350 * sizeFactor,
      139 * sizeFactor,
      0,
      53 * sizeFactor,
      8 * sizeFactor,
      config["risk-class"][risk_class].color
    ); // middle line risk

    /* ========== Add image ===========*/
    let img_containment = await loadImage(
      `./library/${iconpack}/containment-class_icons/${containment_class}-icon.svg`
    );
    let img_disruption = await loadImage(
      `./library/${iconpack}/disruption-class_icons/${disruption_class}-icon.svg`
    );
    let img_risk = await loadImage(
      `./library/${iconpack}/risk-class_icons/${risk_class}-icon.svg`
    );
    let img_secondary = undefined;
    if (
      secondary_class != undefined &&
      secondary_class != null &&
      secondary_class != ""
    ) {
      img_secondary = await loadImage(
        `./library/${iconpack}/secondary-class_icons/${secondary_class}-icon.svg`
      );
    }

    // Containment block icon
    const cX = 264;
    const cY = 108;
    const cW = 60;
    if (img_secondary != undefined) {
      // Disruption block blob
      fillCircle(
        ctx,
        (cX - cW * 0.3) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 4) * sizeFactor,
        0,
        "rgba(0, 0, 0, 1)"
      );
      drawLine(
        ctx,
        (cX - cW * 0.3) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW + 8) * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      let tmp = ctx.globalCompositeOperation;
      // Color invert image
      // await ctx_colorinvert(ctx);
      // Draw image
      ctx.drawImage(
        img_containment,
        (cX - cW * 0.8) * sizeFactor,
        (cY + cW * 0.1) * sizeFactor,
        cW * 0.8 * sizeFactor,
        cW * 0.8 * sizeFactor
      );
      // Reset color invert
      // await ctx_colorinvert(ctx);
      fillCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        0,
        config["secondary-class"][secondary_class].color
      );
      drawCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        4 * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      ctx.drawImage(
        img_secondary,
        cX * sizeFactor,
        cY * sizeFactor,
        cW * sizeFactor,
        cW * sizeFactor
      );
    } else {
      fillCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        0,
        config["containment-class"][containment_class].color
      );
      drawCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        4 * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      ctx.drawImage(
        img_containment,
        cX * sizeFactor,
        cY * sizeFactor,
        cW * sizeFactor,
        cW * sizeFactor
      );
    }

    // Disruption block
    const dX = 523;
    const dY = 87;
    const dW = 38;
    // Disruption block blob
    fillCircle(
      ctx,
      (dX + dW / 2 - 20) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 4) * sizeFactor,
      0,
      "rgba(0, 0, 0, 1)"
    );
    drawLineRel(
      ctx,
      (dX + dW / 2 - 20) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2) * sizeFactor,
      0,
      (dW + 8) * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    // Disruption block icon
    fillCircle(
      ctx,
      (dX + dW / 2) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 2) * sizeFactor,
      0,
      config["disruption-class"][disruption_class].color
    );
    drawCircle(
      ctx,
      (dX + dW / 2) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 2) * sizeFactor,
      4 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_disruption,
      dX * sizeFactor,
      dY * sizeFactor,
      dW * sizeFactor,
      dW * sizeFactor
    );

    // Risk block
    const rX = 523;
    const rY = 146;
    const rW = 38;
    // Risk block blob
    fillCircle(
      ctx,
      (rX + rW / 2 - 20) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 4) * sizeFactor,
      0,
      "rgba(0, 0, 0, 1)"
    );
    drawLineRel(
      ctx,
      (rX + rW / 2 - 20) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2) * sizeFactor,
      0,
      (rW + 8) * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    // Risk block icon
    fillCircle(
      ctx,
      (rX + rW / 2) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 2) * sizeFactor,
      4 * sizeFactor,
      config["risk-class"][risk_class].color
    );
    drawCircle(
      ctx,
      (rX + rW / 2) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 2) * sizeFactor,
      4 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_risk,
      rX * sizeFactor,
      rY * sizeFactor,
      rW * sizeFactor,
      rW * sizeFactor
    );

    // right side
    const oX = 636;
    const oY = 136;
    const oW = 24;

    // Octagon North (Containment Class)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
    ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.lineTo((oX - oW * 0.99) * sizeFactor, (oY - oW * 2.25) * sizeFactor);
    ctx.lineTo((oX + oW * 0.99) * sizeFactor, (oY - oW * 2.25) * sizeFactor);
    ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.closePath();
    ctx.fillStyle =
      config["containment-class"][containment_class].color_transparent;
    ctx.fill();
    ctx.restore();
    fillCircle(
      ctx,
      oX * sizeFactor,
      (oY - oW * 1.35) * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      0,
      config["containment-class"][containment_class].color
    );
    drawCircle(
      ctx,
      oX * sizeFactor,
      (oY - oW * 1.35) * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    if (img_secondary != undefined) {
      // Color invert image
      //await ctx_colorinvert(ctx);
      // Draw image
      ctx.drawImage(
        img_containment,
        (oX - oW / 2) * sizeFactor,
        (oY - oW * 1.85) * sizeFactor,
        oW * sizeFactor,
        oW * sizeFactor
      );
      // Reset color invert
      //await ctx_colorinvert(ctx);
    } else {
      ctx.drawImage(
        img_containment,
        (oX - oW / 2) * sizeFactor,
        (oY - oW * 1.85) * sizeFactor,
        oW * sizeFactor,
        oW * sizeFactor
      );
    }

    // Octagon West (Disruption Class)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
    ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.lineTo((oX - oW * 2.2) * sizeFactor, (oY - oW * 1.0) * sizeFactor);
    ctx.lineTo((oX - oW * 2.2) * sizeFactor, (oY + oW * 1.0) * sizeFactor);
    ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
    ctx.closePath();
    ctx.fillStyle =
      config["disruption-class"][disruption_class].color_transparent;
    ctx.fill();
    ctx.restore();
    fillCircle(
      ctx,
      (oX - oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      0,
      config["disruption-class"][disruption_class].color
    );
    drawCircle(
      ctx,
      (oX - oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_disruption,
      (oX - oW * 1.85) * sizeFactor,
      (oY - oW / 2) * sizeFactor,
      oW * sizeFactor,
      oW * sizeFactor
    );

    // Octagon East (Risk Class)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
    ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.lineTo((oX + oW * 2.2) * sizeFactor, (oY - oW * 1.0) * sizeFactor);
    ctx.lineTo((oX + oW * 2.2) * sizeFactor, (oY + oW * 1.0) * sizeFactor);
    ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
    ctx.closePath();
    ctx.fillStyle = config["risk-class"][risk_class].color_transparent;
    ctx.fill();
    ctx.restore();
    fillCircle(
      ctx,
      (oX + oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      0,
      config["risk-class"][risk_class].color
    );
    drawCircle(
      ctx,
      (oX + oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_risk,
      (oX + oW * 0.85) * sizeFactor,
      (oY - oW / 2) * sizeFactor,
      oW * sizeFactor,
      oW * sizeFactor
    );

    // Octagon South (Secondary Class)
    if (img_secondary != undefined) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
      ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
      ctx.lineTo((oX - oW * 0.99) * sizeFactor, (oY + oW * 2.25) * sizeFactor);
      ctx.lineTo((oX + oW * 0.99) * sizeFactor, (oY + oW * 2.25) * sizeFactor);
      ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fill();
      ctx.restore();
      fillCircle(
        ctx,
        oX * sizeFactor,
        (oY + oW * 1.35) * sizeFactor,
        (oW / 2 + 4) * sizeFactor,
        0,
        "rgba(255, 255, 255, 1)"
      );
      drawCircle(
        ctx,
        oX * sizeFactor,
        (oY + oW * 1.35) * sizeFactor,
        (oW / 2 + 4) * sizeFactor,
        2 * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      ctx.drawImage(
        img_secondary,
        (oX - oW / 2) * sizeFactor,
        (oY + oW * 0.85) * sizeFactor,
        oW * sizeFactor,
        oW * sizeFactor
      );
    }

    await layout_drawOctagon(ctx);

    /* ========== Add text ========== */
    // Containment block text
    const cb_fontX = 36;
    const cb_fontY = 126;
    if (img_secondary == undefined) {
      // No secondary class
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      fontsize = 14 * sizeFactor;
      ctx.font = `${fontsize}px Inter`;
      ctx.fillText(
        "CONTAINMENT CLASS:",
        cb_fontX * sizeFactor,
        cb_fontY * sizeFactor
      );
      fontsize = 30 * sizeFactor;
      ctx.font = `900 ${fontsize}px Inter`;
      ctx.fillText(
        config["containment-class"][containment_class].name.toUpperCase(),
        cb_fontX * sizeFactor,
        (cb_fontY + 30) * sizeFactor
      );
    } else {
      // Secondary class exists
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      fontsize = 12 * sizeFactor;
      ctx.font = `${fontsize}px Inter`;
      ctx.fillText(
        "CONTAINMENT CLASS:",
        cb_fontX * sizeFactor,
        (cb_fontY - 20) * sizeFactor
      );
      fontsize = 25 * sizeFactor;
      ctx.font = `900 ${fontsize}px Inter`;
      ctx.fillText(
        config["containment-class"][containment_class].name.toUpperCase(),
        cb_fontX * sizeFactor,
        (cb_fontY + 5) * sizeFactor
      );
      fontsize = 12 * sizeFactor;
      ctx.font = `${fontsize}px Inter`;
      ctx.fillText(
        "SECONDARY CLASS:",
        cb_fontX * sizeFactor,
        (cb_fontY + 24) * sizeFactor
      );
      fontsize = 25 * sizeFactor;
      ctx.font = `900 ${fontsize}px Inter`;
      ctx.fillText(
        config["secondary-class"][secondary_class].name.toUpperCase(),
        cb_fontX * sizeFactor,
        (cb_fontY + 49) * sizeFactor
      );
    }

    // Discruption block text
    const db_fontX = 363;
    const db_fontY = 101;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 10 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText(
      "DISRUPTION CLASS:",
      db_fontX * sizeFactor,
      db_fontY * sizeFactor
    );
    fontsize = 18 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["disruption-class"][disruption_class].name.toUpperCase(),
      db_fontX * sizeFactor,
      (db_fontY + 20) * sizeFactor
    );

    // Risk block text
    const rb_fontX = 363;
    const rb_fontY = 159;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 10 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("RISK CLASS:", rb_fontX * sizeFactor, rb_fontY * sizeFactor);
    fontsize = 18 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["risk-class"][risk_class].name.toUpperCase(),
      rb_fontX * sizeFactor,
      (rb_fontY + 20) * sizeFactor
    );

    // Discruption block icon number
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    fontsize = (dW / 2.5) * sizeFactor;
    ctx.font = `900 ${fontsize}px Inter`;
    ctx.fillText(
      disruption_class,
      (dX - dW / 2.5) * sizeFactor,
      (dY + dW / 1.5) * sizeFactor
    );

    // Risk block icon number
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    fontsize = (rW / 2.5) * sizeFactor;
    ctx.font = `900 ${fontsize}px Inter`;
    ctx.fillText(
      risk_class,
      (rX - rW / 2.5) * sizeFactor,
      (rY + rW / 1.5) * sizeFactor
    );
    /* ========== Canvas done ========== */
    return ctx;
  }

  async function layout_default_stripped(ctx) {
    /* ========== Add Lines & Boxes ========== */
    ctx.fillStyle =
      config["containment-class"][containment_class].color_transparent;
    ctx.fillRect(
      20 * sizeFactor,
      80 * sizeFactor,
      550 * sizeFactor,
      112 * sizeFactor
    ); // containment box
    drawLine(
      ctx,
      0,
      70 * sizeFactor,
      700 * sizeFactor,
      70 * sizeFactor,
      4 * sizeFactor
    ); // top line
    drawLine(
      ctx,
      20 * sizeFactor,
      80 * sizeFactor,
      20 * sizeFactor,
      192 * sizeFactor,
      14 * sizeFactor,
      config["containment-class"][containment_class].color
    ); // left line
    /* ========== Add image ===========*/
    await layout_drawOctagon(ctx);
    cX = 600;
    cY = 100;
    cW = 70;
    fillCircle(
      ctx,
      (cX + cW / 2) * sizeFactor,
      (cY + cW / 2) * sizeFactor,
      (cW / 2) * sizeFactor,
      0,
      config["containment-class"][containment_class].color_transparent
    );
    drawCircle(
      ctx,
      (cX + cW / 2) * sizeFactor,
      (cY + cW / 2) * sizeFactor,
      (cW / 2) * sizeFactor,
      4 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    let img_containment = await loadImage(
      `./library/${iconpack}/containment-class_icons/${containment_class}-icon.svg`
    );
    ctx.drawImage(
      img_containment,
      cX * sizeFactor,
      cY * sizeFactor,
      cW * sizeFactor,
      cW * sizeFactor
    ); // Left block, north icon
    /* ========== Add text ========== */
    var fontsize;
    const cb_fontX = 40;
    const cb_fontY = 130;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 14 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText(
      "CONTAINMENT CLASS:",
      cb_fontX * sizeFactor,
      cb_fontY * sizeFactor
    );
    fontsize = 30 * sizeFactor;
    ctx.font = `900 ${fontsize}px Inter`;
    ctx.fillText(
      config["containment-class"][containment_class].name,
      cb_fontX * sizeFactor,
      (cb_fontY + 30) * sizeFactor
    );
  }

  async function layout_base_hybrid(canvas) {
    /* ========== Create Canvas ========== */
    const ctx = canvas.getContext("2d");

    /* ========== Set Background ========== */
    ctx.fillStyle = c_background;
    ctx.fillRect(0, 0, c_width_hybrid, c_height_hybrid);

    /* ========== Add Lines & Boxes ========== */
    drawLine(
      ctx,
      710 * sizeFactor,
      5 * sizeFactor,
      710 * sizeFactor,
      65 * sizeFactor,
      4 * sizeFactor,
      config["clearance-level"][clearance_level].color
    ); // clearance level line
    drawLine(
      ctx,
      0 * sizeFactor,
      70 * sizeFactor,
      900 * sizeFactor,
      70 * sizeFactor,
      2 * sizeFactor
    ); // top line

    /* ========== Add text ========== */
    var fontsize;
    // Header block Item Number
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 30 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Item#:", 20 * sizeFactor, 50 * sizeFactor);
    fontsize = 30 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(c_text_item_number, 115 * sizeFactor, 50 * sizeFactor);
    // Header block Clearance Level
    fontsize = 18 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText(
      `${config["clearance-level"][clearance_level].name}:`,
      720 * sizeFactor,
      35 * sizeFactor
    );
    fontsize = 15 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["clearance-level"][clearance_level].abbr,
      720 * sizeFactor,
      55 * sizeFactor
    );
    /* ========== Finish ========== */
    return ctx;
  }

  async function layout_hybrid(ctx) {
    /* ========== Add Lines & Boxes ========== */
    drawLine(
      ctx,
      5 * sizeFactor,
      71 * sizeFactor,
      5 * sizeFactor,
      200 * sizeFactor,
      10 * sizeFactor,
      config["containment-class"][containment_class].color
    ); // containment line
    drawLine(
      ctx,
      554 * sizeFactor,
      71 * sizeFactor,
      554 * sizeFactor,
      126 * sizeFactor,
      6 * sizeFactor,
      config["disruption-class"][disruption_class].color
    ); // disruption line
    drawLine(
      ctx,
      554 * sizeFactor,
      126 * sizeFactor,
      554 * sizeFactor,
      200 * sizeFactor,
      6 * sizeFactor,
      config["risk-class"][risk_class].color
    ); // risk line
    if (
      secondary_class != undefined &&
      secondary_class != null &&
      secondary_class != ""
    ) {
      drawLine(
        ctx,
        285 * sizeFactor,
        71 * sizeFactor,
        285 * sizeFactor,
        200 * sizeFactor,
        10 * sizeFactor,
        config["secondary-class"][secondary_class].color
      ); // secondary line
    }
    drawLine(
      ctx,
      550 * sizeFactor,
      71 * sizeFactor,
      550 * sizeFactor,
      200 * sizeFactor,
      2 * sizeFactor
    ); // middle line
    /* ========== Add image ===========*/
    let img_containment = await loadImage(
      `./library/${iconpack}/containment-class_icons/${containment_class}-icon.svg`
    );
    let img_disruption = await loadImage(
      `./library/${iconpack}/disruption-class_icons/${disruption_class}-icon.svg`
    );
    let img_risk = await loadImage(
      `./library/${iconpack}/risk-class_icons/${risk_class}-icon.svg`
    );
    let img_secondary = undefined;
    if (
      secondary_class != undefined &&
      secondary_class != null &&
      secondary_class != ""
    ) {
      img_secondary = await loadImage(
        `./library/${iconpack}/secondary-class_icons/${secondary_class}-icon.svg`
      );
    }

    // Containment block icon
    const cX = 470;
    const cY = 96;
    let cW = 60;
    let cSW = 4;
    let cOff = 0;
    let sec = false;
    if (img_secondary != undefined) {
      // Secondary present: Set Icon size and stroke width
      cOff = 20; // Offset of original cW to new cW
      cW = cW - cOff;
      cSW = 3;
      sec = true;
    }
    // Middle icon (sec == true => secondary class; else => containment class)
    fillCircle(
      ctx,
      (cX + (cW + cOff) / 2) * sizeFactor,
      (cY + (cW + cOff) / 2) * sizeFactor,
      (cW / 2 + 2) * sizeFactor,
      0,
      sec
        ? config["secondary-class"][secondary_class].color
        : config["containment-class"][containment_class].color
    );
    drawCircle(
      ctx,
      (cX + (cW + cOff) / 2) * sizeFactor,
      (cY + (cW + cOff) / 2) * sizeFactor,
      (cW / 2 + 2) * sizeFactor,
      cSW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      sec ? img_secondary : img_containment,
      (cX + cOff / 2) * sizeFactor,
      (cY + cOff / 2) * sizeFactor,
      cW * sizeFactor,
      cW * sizeFactor
    );
    // Icon for containment if secondary class is present
    if (sec) {
      fillCircle(
        ctx,
        (cX - 265 + (cW + cOff) / 2) * sizeFactor,
        (cY + (cW + cOff) / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        0,
        config["containment-class"][containment_class].color
      );
      drawCircle(
        ctx,
        (cX - 265 + (cW + cOff) / 2) * sizeFactor,
        (cY + (cW + cOff) / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        cSW * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      ctx.drawImage(
        img_containment,
        (cX - 265 + cOff / 2) * sizeFactor,
        (cY + cOff / 2) * sizeFactor,
        cW * sizeFactor,
        cW * sizeFactor
      );
    }
    // Disruption block icon
    const dX = 810;
    const dY = 85;
    const dW = 25;
    fillCircle(
      ctx,
      (dX + dW / 2) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 2) * sizeFactor,
      0,
      config["disruption-class"][disruption_class].color
    );
    drawCircle(
      ctx,
      (dX + dW / 2) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 2) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_disruption,
      dX * sizeFactor,
      dY * sizeFactor,
      dW * sizeFactor,
      dW * sizeFactor
    );
    // Risk block icon
    const rX = 775;
    const rY = 142;
    const rW = 25;
    fillCircle(
      ctx,
      (rX + rW / 2) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 2) * sizeFactor,
      0,
      config["risk-class"][risk_class].color
    );
    drawCircle(
      ctx,
      (rX + rW / 2) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 2) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_risk,
      rX * sizeFactor,
      rY * sizeFactor,
      rW * sizeFactor,
      rW * sizeFactor
    );
    /* ========== Add text ========== */
    var fontsize;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 19 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    if (
      secondary_class != undefined &&
      secondary_class != null &&
      secondary_class != ""
    ) {
      ctx.fillText("Containment Class:", 15 * sizeFactor, 121 * sizeFactor);
      fontsize = 22 * sizeFactor;
      ctx.font = `bold ${fontsize}px Inter`;
      ctx.fillText(
        config["containment-class"][containment_class].name,
        15 * sizeFactor,
        144 * sizeFactor
      );
      fontsize = 19 * sizeFactor;
      ctx.font = `${fontsize}px Inter`;
      ctx.fillText("Secondary Class:", 295 * sizeFactor, 121 * sizeFactor);
      fontsize = 22 * sizeFactor;
      ctx.font = `bold ${fontsize}px Inter`;
      ctx.fillText(
        config["secondary-class"][secondary_class].name,
        295 * sizeFactor,
        144 * sizeFactor
      );
    } else {
      ctx.fillText("Containment Class:", 15 * sizeFactor, 132 * sizeFactor);
      fontsize = 22 * sizeFactor;
      ctx.font = `bold ${fontsize}px Inter`;
      ctx.fillText(
        config["containment-class"][containment_class].name,
        200 * sizeFactor,
        132 * sizeFactor
      );
    }
    fontsize = 17 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Disruption Class:", 565 * sizeFactor, 105 * sizeFactor);
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      `${[disruption_class]} / ${
        config["disruption-class"][disruption_class].name
      }`,
      708 * sizeFactor,
      105 * sizeFactor
    );
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Risk Class:", 565 * sizeFactor, 160 * sizeFactor);
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      `${[risk_class]} / ${config["risk-class"][risk_class].name}`,
      660 * sizeFactor,
      160 * sizeFactor
    );
    /* ========== Canvas done ========== */
    return ctx;
  }

  async function layout_hybrid_stripped(ctx) {
    /* ========== Add Lines & Boxes ========== */
    drawLine(
      ctx,
      5 * sizeFactor,
      71 * sizeFactor,
      5 * sizeFactor,
      200 * sizeFactor,
      10 * sizeFactor,
      config["containment-class"][containment_class].color
    ); // containment line
    /* ========== Add image ===========*/
    let img_containment = await loadImage(
      `./library/${iconpack}/containment-class_icons/${containment_class}-icon.svg`
    );

    // Containment block icon
    const cX = 360;
    const cY = 96;
    let cW = 60;
    let cSW = 4;
    let cOff = 0;
    let sec = false;
    // Middle icon (sec == true => secondary class; else => containment class)
    fillCircle(
      ctx,
      (cX + (cW + cOff) / 2) * sizeFactor,
      (cY + (cW + cOff) / 2) * sizeFactor,
      (cW / 2 + 2) * sizeFactor,
      0,
      sec
        ? config["secondary-class"][secondary_class].color
        : config["containment-class"][containment_class].color
    );
    drawCircle(
      ctx,
      (cX + (cW + cOff) / 2) * sizeFactor,
      (cY + (cW + cOff) / 2) * sizeFactor,
      (cW / 2 + 2) * sizeFactor,
      cSW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      sec ? img_secondary : img_containment,
      (cX + cOff / 2) * sizeFactor,
      (cY + cOff / 2) * sizeFactor,
      cW * sizeFactor,
      cW * sizeFactor
    );

    /* ========== Add text ========== */
    var fontsize;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 19 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Containment Class:", 15 * sizeFactor, 132 * sizeFactor);
    fontsize = 22 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["containment-class"][containment_class].name,
      200 * sizeFactor,
      132 * sizeFactor
    );
    /* ========== Canvas done ========== */
    return ctx;
  }

  async function layout_base_textual(canvas) {
    /* ========== Create Canvas ========== */
    const ctx = canvas.getContext("2d");

    /* ========== Set Background ========== */
    ctx.fillStyle = c_background;
    ctx.fillRect(0, 0, c_width_hybrid, c_height_hybrid);

    /* ========== Add Lines & Boxes ========== */
    drawLine(
      ctx,
      710 * sizeFactor,
      5 * sizeFactor,
      710 * sizeFactor,
      70 * sizeFactor,
      2 * sizeFactor
    ); // clearance level line
    drawLine(
      ctx,
      0 * sizeFactor,
      70 * sizeFactor,
      900 * sizeFactor,
      70 * sizeFactor,
      2 * sizeFactor
    ); // top line

    /* ========== Add text ========== */
    var fontsize;
    // Header block Item Number
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 30 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Item#:", 20 * sizeFactor, 50 * sizeFactor);
    fontsize = 30 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(c_text_item_number, 115 * sizeFactor, 50 * sizeFactor);
    // Header block Clearance Level
    fontsize = 18 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText(
      `${config["clearance-level"][clearance_level].name}:`,
      720 * sizeFactor,
      35 * sizeFactor
    );
    fontsize = 15 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["clearance-level"][clearance_level].abbr,
      720 * sizeFactor,
      55 * sizeFactor
    );
    /* ========== Finish ========== */
    return ctx;
  }

  async function layout_textual(ctx) {
    /* ========== Add Lines & Boxes ========== */
    drawLine(
      ctx,
      550 * sizeFactor,
      71 * sizeFactor,
      550 * sizeFactor,
      200 * sizeFactor,
      2 * sizeFactor
    ); // middle line

    /* ========== Add text ========== */
    var fontsize;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 19 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    if (
      secondary_class != undefined &&
      secondary_class != null &&
      secondary_class != ""
    ) {
      ctx.fillText("Containment Class:", 15 * sizeFactor, 121 * sizeFactor);
      fontsize = 22 * sizeFactor;
      ctx.font = `bold ${fontsize}px Inter`;
      ctx.fillText(
        config["containment-class"][containment_class].name,
        15 * sizeFactor,
        144 * sizeFactor
      );
      fontsize = 19 * sizeFactor;
      ctx.font = `${fontsize}px Inter`;
      ctx.fillText("Secondary Class:", 295 * sizeFactor, 121 * sizeFactor);
      fontsize = 22 * sizeFactor;
      ctx.font = `bold ${fontsize}px Inter`;
      ctx.fillText(
        config["secondary-class"][secondary_class].name,
        295 * sizeFactor,
        144 * sizeFactor
      );
    } else {
      ctx.fillText("Containment Class:", 15 * sizeFactor, 132 * sizeFactor);
      fontsize = 22 * sizeFactor;
      ctx.font = `bold ${fontsize}px Inter`;
      ctx.fillText(
        config["containment-class"][containment_class].name,
        200 * sizeFactor,
        132 * sizeFactor
      );
    }
    fontsize = 17 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Disruption Class:", 565 * sizeFactor, 105 * sizeFactor);
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      `${[disruption_class]} / ${
        config["disruption-class"][disruption_class].name
      }`,
      708 * sizeFactor,
      105 * sizeFactor
    );
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Risk Class:", 565 * sizeFactor, 160 * sizeFactor);
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      `${[risk_class]} / ${config["risk-class"][risk_class].name}`,
      660 * sizeFactor,
      160 * sizeFactor
    );
    /* ========== Canvas done ========== */
    return ctx;
  }

  async function layout_textual_stripped(ctx) {
    /* ========== Add text ========== */
    var fontsize;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 19 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText("Containment Class:", 15 * sizeFactor, 132 * sizeFactor);
    fontsize = 22 * sizeFactor;
    ctx.font = `bold ${fontsize}px Inter`;
    ctx.fillText(
      config["containment-class"][containment_class].name,
      200 * sizeFactor,
      132 * sizeFactor
    );
    /* ========== Canvas done ========== */
    return ctx;
  }

  async function layout_base_splitter(canvas) {
    /* ========== Create Canvas ========== */
    const ctx = canvas.getContext("2d");

    /* ========== Set Background ========== */
    ctx.fillStyle = c_background;
    ctx.fillRect(0, 0, c_width_splitter, c_height_splitter);

    /* ========== Add clearance level ========== */
    const clX = 180;
    const clY = 37;
    const clW = 300;
    const clH = 5;
    const cl_lines = clearance_level * 2 - 1; // to calculate the necessary spaces
    const cl_height = clH * cl_lines;
    const cl_start = clY - cl_height / 2;
    const old_gCO = ctx.globalCompositeOperation;

    // If Level 6, add image
    if (clearance_level == 6) {
      const img_galactic = await loadImage(`./library/extras/galactic.jpg`);
      ctx.drawImage(
        img_galactic,
        clX * sizeFactor,
        (cl_start - 2.5) * sizeFactor,
        clW * sizeFactor,
        cl_height * sizeFactor
      );
      ctx.globalCompositeOperation = "destination-out";
    }
    for (let i = 0; i < cl_lines; i++) {
      if (clearance_level == 6) {
        if (i % 2 == 0)
          // This is an empty line
          continue;

        // Lines for Removing parts of the image
        drawLineRel(
          ctx,
          clX * sizeFactor,
          (cl_start + clH * i) * sizeFactor,
          clW * sizeFactor,
          0,
          clH * sizeFactor,
          "rgba(255, 255, 255, 1)"
        );
      } else {
        if (i % 2 == 1)
          // This is an empty line
          continue;

        drawLineRel(
          ctx,
          clX * sizeFactor,
          (cl_start + clH * i) * sizeFactor,
          clW * sizeFactor,
          0,
          clH * sizeFactor,
          config["clearance-level"][clearance_level].color
        );
      }
    }

    // Reset globalCompositeOperation
    ctx.globalCompositeOperation = old_gCO;

    // For Level 6, fill the erased parts with background
    for (let i = 0; i < cl_lines; i++) {
      if (clearance_level != 6) break;

      if (i % 2 == 0)
        // This is an empty line
        continue;

      drawLineRel(
        ctx,
        clX * sizeFactor,
        (cl_start + clH * i) * sizeFactor,
        clW * sizeFactor,
        0,
        clH * sizeFactor,
        c_background
      );
    }

    /* ========== Add Text ========== */
    var fontsize;
    // Header block Item Number
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 25 * sizeFactor;
    ctx.font = `bold ${fontsize}px Roboto`;
    ctx.fillText("ITEM#:", 5 * sizeFactor, 50 * sizeFactor);
    fontsize = 35 * sizeFactor;
    ctx.font = `bold ${fontsize}px Roboto`;
    ctx.fillText(c_text_item_number, 85 * sizeFactor, 50 * sizeFactor);
    // Header block Clearance Level
    fontsize = 20 * sizeFactor;
    ctx.font = `bold ${fontsize}px Roboto`;
    ctx.fillText(
      config["clearance-level"][clearance_level].dname,
      500 * sizeFactor,
      35 * sizeFactor
    );
    fontsize = 15 * sizeFactor;
    ctx.font = `bold ${fontsize}px Roboto`;
    ctx.fillText(
      config["clearance-level"][clearance_level].abbr.toUpperCase(),
      500 * sizeFactor,
      55 * sizeFactor
    );
    /* ========== Finish ========== */
    return ctx;
  }

  async function layout_drawOctagon_splitter(ctx) {
    /* ========== Add Octagon ========== */
    ogX = 750;
    ogY = 100;
    ogSize = 90;
    ogAHL = 6; // Arrowhead Length
    ogW = 4; // Stroke Width
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX + ogSize) * sizeFactor,
      (ogY + ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX - ogSize) * sizeFactor,
      (ogY - ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX - ogSize) * sizeFactor,
      (ogY + ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    drawArrow(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogX + ogSize) * sizeFactor,
      (ogY - ogSize) * sizeFactor,
      ogAHL * sizeFactor,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    // Please don't ask why I need a correction factor of 1.008 for the radius
    drawPolygon(
      ctx,
      ogX * sizeFactor,
      ogY * sizeFactor,
      (ogSize + ogW) * 1.008 * sizeFactor,
      8,
      Math.PI / 8,
      ogW * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
  }

  async function ctx_colorinvert(ctx) {
    let tmp = ctx.globalCompositeOperation;
    // Color invert image
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw image
    ctx.globalCompositeOperation = tmp;
  }

  async function drawBlob_splitter(
    ctx,
    cX,
    cY,
    cW,
    cH,
    borderradius,
    strokewidth,
    fillcolor
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = fillcolor;
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = strokewidth;
    ctx.moveTo(cX * sizeFactor, (cY - cH) * sizeFactor);
    ctx.lineTo((cX - cW) * sizeFactor, (cY - cH) * sizeFactor);
    ctx.quadraticCurveTo(
      (cX - cW * 1.3) * sizeFactor,
      (cY - cH * 0.9) * sizeFactor,
      (cX - cW * 1.3) * sizeFactor,
      (cY - cH * 0.25) * sizeFactor
    );
    ctx.lineTo((cX - cW * 1.3) * sizeFactor, (cY + cH * 0.25) * sizeFactor);
    ctx.quadraticCurveTo(
      (cX - cW * 1.3) * sizeFactor,
      (cY + cH * 0.9) * sizeFactor,
      (cX - cW) * sizeFactor,
      (cY + cH) * sizeFactor
    );
    ctx.lineTo((cX - cW) * sizeFactor, (cY + cH) * sizeFactor);
    ctx.lineTo(cX * sizeFactor, (cY + cH) * sizeFactor);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  async function layout_splitter(ctx) {
    /* ========== Add Lines & Boxes ========== */
    if (secondary_class != "") {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle =
        config["secondary-class"][secondary_class].color_transparent;
      // Containment Background Box
      cbbX = 23;
      cbbY = 65;
      cbbW = 342;
      cbbH = 127;
      cbbSW = 55; // Small side width

      ctx.moveTo(cbbX * sizeFactor, cbbY * sizeFactor);
      ctx.lineTo(cbbX * sizeFactor, (cbbY + cbbH) * sizeFactor);
      ctx.lineTo(
        (cbbX + (cbbW - cbbSW)) * sizeFactor,
        (cbbY + cbbH) * sizeFactor
      );
      ctx.lineTo((cbbX + cbbSW) * sizeFactor, cbbY * sizeFactor);
      ctx.closePath();
      ctx.fill();
      //ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      //color = config["containment-class"][containment_class].color_transparent.split(", ");
      //color[3] = "0.25)";
      //ctx.fillStyle = color.join(", ");
      ctx.fillStyle =
        config["containment-class"][containment_class].color_transparent;
      //ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
      ctx.moveTo((cbbX + cbbSW) * sizeFactor, cbbY * sizeFactor);
      ctx.lineTo((cbbX + cbbW) * sizeFactor, cbbY * sizeFactor);
      ctx.lineTo((cbbX + cbbW) * sizeFactor, (cbbY + cbbH) * sizeFactor);
      ctx.lineTo(
        (cbbX + (cbbW - cbbSW)) * sizeFactor,
        (cbbY + cbbH) * sizeFactor
      );
      ctx.closePath();
      ctx.fill();
      //ctx.stroke();
      ctx.restore();
    } else {
      ctx.fillStyle =
        config["containment-class"][containment_class].color_transparent;
      ctx.fillRect(
        16 * sizeFactor,
        65 * sizeFactor,
        350 * sizeFactor,
        127 * sizeFactor
      ); // left side box - containment - 5 Pixels bezween the middle
    }
    drawLine(
      ctx,
      16 * sizeFactor,
      65 * sizeFactor,
      16 * sizeFactor,
      192 * sizeFactor,
      14 * sizeFactor,
      config["containment-class"][containment_class].color
    ); // left line
    ctx.fillStyle =
      config["disruption-class"][disruption_class].color_transparent;
    ctx.fillRect(
      380 * sizeFactor,
      65 * sizeFactor,
      265 * sizeFactor,
      59 * sizeFactor
    ); // right side box - disruption
    ctx.fillStyle = config["risk-class"][risk_class].color_transparent;
    ctx.fillRect(
      380 * sizeFactor,
      133 * sizeFactor,
      265 * sizeFactor,
      59 * sizeFactor
    ); // right side box - risk - 5 Pixels bezween the middle
    drawLineRel(
      ctx,
      380 * sizeFactor,
      65 * sizeFactor,
      0,
      59 * sizeFactor,
      8 * sizeFactor,
      config["disruption-class"][disruption_class].color
    ); // middle line disruption
    drawLineRel(
      ctx,
      380 * sizeFactor,
      133 * sizeFactor,
      0,
      59 * sizeFactor,
      8 * sizeFactor,
      config["risk-class"][risk_class].color
    ); // middle line risk

    /* ========== Add image ===========*/
    let img_containment = await loadImage(
      `./library/${iconpack}/containment-class_icons/${containment_class}-icon.svg`
    );
    let img_disruption = await loadImage(
      `./library/${iconpack}/disruption-class_icons/${disruption_class}-icon.svg`
    );
    let img_risk = await loadImage(
      `./library/${iconpack}/risk-class_icons/${risk_class}-icon.svg`
    );
    let img_secondary = undefined;
    if (
      secondary_class != undefined &&
      secondary_class != null &&
      secondary_class != ""
    ) {
      img_secondary = await loadImage(
        `./library/${iconpack}/secondary-class_icons/${secondary_class}-icon.svg`
      );
    }

    // Containment block icon
    const cX = 285;
    const cY = 94;
    const cW = 70;
    if (img_secondary != undefined) {
      // Disruption block blob
      //fillCircle(ctx, (cX - cW * 0.3) * sizeFactor, (cY + cW / 2) * sizeFactor, (cW / 2 + 4) * sizeFactor, 0, 'rgba(0, 0, 0, 1)');
      //drawLine(ctx, (cX - cW * 0.3) * sizeFactor, (cY + cW / 2) * sizeFactor, (cX + cW / 2) * sizeFactor, (cY + cW / 2) * sizeFactor, (cW + 8) * sizeFactor, 'rgba(0, 0, 0, 1)');
      drawBlob_splitter(
        ctx,
        cX + cW / 2,
        cY + cW / 2,
        cW,
        cW / 2 + 2,
        2,
        4,
        config["containment-class"][containment_class].color
      );
      let tmp = ctx.globalCompositeOperation;
      // Color invert image
      // Draw image
      ctx.drawImage(
        img_containment,
        (cX - cW * 0.8) * sizeFactor,
        (cY + cW * 0.1) * sizeFactor,
        cW * 0.8 * sizeFactor,
        cW * 0.8 * sizeFactor
      );
      fillCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        0,
        "rgba(255, 255, 255, 1)"
      );
      drawCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        4 * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      ctx.drawImage(
        img_secondary,
        cX * sizeFactor,
        cY * sizeFactor,
        cW * sizeFactor,
        cW * sizeFactor
      );
    } else {
      fillCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        0,
        config["containment-class"][containment_class].color
      );
      drawCircle(
        ctx,
        (cX + cW / 2) * sizeFactor,
        (cY + cW / 2) * sizeFactor,
        (cW / 2 + 2) * sizeFactor,
        4 * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      ctx.drawImage(
        img_containment,
        cX * sizeFactor,
        cY * sizeFactor,
        cW * sizeFactor,
        cW * sizeFactor
      );
    }

    // Disruption block
    const dX = 590;
    const dY = 72;
    const dW = 45;
    // Disruption block blob
    fillCircle(
      ctx,
      (dX + dW / 2 - 20) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 4) * sizeFactor,
      0,
      "rgba(0, 0, 0, 1)"
    );
    drawLineRel(
      ctx,
      (dX + dW / 2 - 20) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2) * sizeFactor,
      0,
      (dW + 8) * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    // Disruption block icon
    fillCircle(
      ctx,
      (dX + dW / 2) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 2) * sizeFactor,
      0,
      config["disruption-class"][disruption_class].color
    );
    drawCircle(
      ctx,
      (dX + dW / 2) * sizeFactor,
      (dY + dW / 2) * sizeFactor,
      (dW / 2 + 2) * sizeFactor,
      4 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_disruption,
      dX * sizeFactor,
      dY * sizeFactor,
      dW * sizeFactor,
      dW * sizeFactor
    );

    // Risk block
    const rX = 590;
    const rY = 140;
    const rW = 45;
    // Risk block blob
    fillCircle(
      ctx,
      (rX + rW / 2 - 20) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 4) * sizeFactor,
      0,
      "rgba(0, 0, 0, 1)"
    );
    drawLineRel(
      ctx,
      (rX + rW / 2 - 20) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2) * sizeFactor,
      0,
      (rW + 8) * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    // Risk block icon
    fillCircle(
      ctx,
      (rX + rW / 2) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 2) * sizeFactor,
      4 * sizeFactor,
      config["risk-class"][risk_class].color
    );
    drawCircle(
      ctx,
      (rX + rW / 2) * sizeFactor,
      (rY + rW / 2) * sizeFactor,
      (rW / 2 + 2) * sizeFactor,
      4 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_risk,
      rX * sizeFactor,
      rY * sizeFactor,
      rW * sizeFactor,
      rW * sizeFactor
    );

    // right side
    const oX = 750;
    const oY = 100;
    const oW = 40;

    // Octagon North (Containment Class)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
    ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.lineTo((oX - oW * 0.99) * sizeFactor, (oY - oW * 2.25) * sizeFactor);
    ctx.lineTo((oX + oW * 0.99) * sizeFactor, (oY - oW * 2.25) * sizeFactor);
    ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.closePath();
    ctx.fillStyle =
      config["containment-class"][containment_class].color_transparent;
    ctx.fill();
    ctx.restore();
    fillCircle(
      ctx,
      oX * sizeFactor,
      (oY - oW * 1.35) * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      0,
      config["containment-class"][containment_class].color
    );
    drawCircle(
      ctx,
      oX * sizeFactor,
      (oY - oW * 1.35) * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_containment,
      (oX - oW / 2) * sizeFactor,
      (oY - oW * 1.85) * sizeFactor,
      oW * sizeFactor,
      oW * sizeFactor
    );

    // Octagon West (Disruption Class)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
    ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.lineTo((oX - oW * 2.2) * sizeFactor, (oY - oW * 1.0) * sizeFactor);
    ctx.lineTo((oX - oW * 2.2) * sizeFactor, (oY + oW * 1.0) * sizeFactor);
    ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
    ctx.closePath();
    ctx.fillStyle =
      config["disruption-class"][disruption_class].color_transparent;
    ctx.fill();
    ctx.restore();
    fillCircle(
      ctx,
      (oX - oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      0,
      config["disruption-class"][disruption_class].color
    );
    drawCircle(
      ctx,
      (oX - oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_disruption,
      (oX - oW * 1.85) * sizeFactor,
      (oY - oW / 2) * sizeFactor,
      oW * sizeFactor,
      oW * sizeFactor
    );

    // Octagon East (Risk Class)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
    ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY - oW * 1.6) * sizeFactor);
    ctx.lineTo((oX + oW * 2.2) * sizeFactor, (oY - oW * 1.0) * sizeFactor);
    ctx.lineTo((oX + oW * 2.2) * sizeFactor, (oY + oW * 1.0) * sizeFactor);
    ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
    ctx.closePath();
    ctx.fillStyle = config["risk-class"][risk_class].color_transparent;
    ctx.fill();
    ctx.restore();
    fillCircle(
      ctx,
      (oX + oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      0,
      config["risk-class"][risk_class].color
    );
    drawCircle(
      ctx,
      (oX + oW * 1.35) * sizeFactor,
      oY * sizeFactor,
      (oW / 2 + 4) * sizeFactor,
      2 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_risk,
      (oX + oW * 0.85) * sizeFactor,
      (oY - oW / 2) * sizeFactor,
      oW * sizeFactor,
      oW * sizeFactor
    );

    // Octagon South (Secondary Class)
    if (img_secondary != undefined) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(oX * sizeFactor, oY * sizeFactor);
      ctx.lineTo((oX - oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
      ctx.lineTo((oX - oW * 0.99) * sizeFactor, (oY + oW * 2.25) * sizeFactor);
      ctx.lineTo((oX + oW * 0.99) * sizeFactor, (oY + oW * 2.25) * sizeFactor);
      ctx.lineTo((oX + oW * 1.62) * sizeFactor, (oY + oW * 1.6) * sizeFactor);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fill();
      ctx.restore();
      fillCircle(
        ctx,
        oX * sizeFactor,
        (oY + oW * 1.35) * sizeFactor,
        (oW / 2 + 4) * sizeFactor,
        0,
        "rgba(255, 255, 255, 1)"
      );
      drawCircle(
        ctx,
        oX * sizeFactor,
        (oY + oW * 1.35) * sizeFactor,
        (oW / 2 + 4) * sizeFactor,
        2 * sizeFactor,
        "rgba(0, 0, 0, 1)"
      );
      ctx.drawImage(
        img_secondary,
        (oX - oW / 2) * sizeFactor,
        (oY + oW * 0.85) * sizeFactor,
        oW * sizeFactor,
        oW * sizeFactor
      );
    }

    await layout_drawOctagon_splitter(ctx);

    /* ========== Add text ========== */
    // Containment block text
    const cb_fontX = 36;
    const cb_fontY = 119;
    if (img_secondary == undefined) {
      // No secondary class
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      fontsize = 14 * sizeFactor;
      ctx.font = `${fontsize}px Inter`;
      ctx.fillText(
        "CONTAINMENT CLASS:",
        cb_fontX * sizeFactor,
        cb_fontY * sizeFactor
      );
      fontsize = 30 * sizeFactor;
      ctx.font = `900 ${fontsize}px Inter`;
      ctx.fillText(
        config["containment-class"][containment_class].name.toUpperCase(),
        cb_fontX * sizeFactor,
        (cb_fontY + 30) * sizeFactor
      );
    } else {
      // Secondary class exists
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      fontsize = 12 * sizeFactor;
      ctx.font = `${fontsize}px Roboto`;
      ctx.fillText(
        "CONTAINMENT CLASS:",
        cb_fontX * sizeFactor,
        (cb_fontY - 30) * sizeFactor
      );
      fontsize = 25 * sizeFactor;
      ctx.font = `bold ${fontsize}px Roboto`;
      ctx.fillText(
        config["containment-class"][containment_class].name.toUpperCase(),
        cb_fontX * sizeFactor,
        (cb_fontY - 5) * sizeFactor
      );
      fontsize = 12 * sizeFactor;
      ctx.font = `${fontsize}px Roboto`;
      ctx.fillText(
        "SECONDARY CLASS:",
        cb_fontX * sizeFactor,
        (cb_fontY + 31) * sizeFactor
      );
      fontsize = 25 * sizeFactor;
      ctx.font = `bold ${fontsize}px Roboto`;
      ctx.fillText(
        config["secondary-class"][secondary_class].name.toUpperCase(),
        cb_fontX * sizeFactor,
        (cb_fontY + 56) * sizeFactor
      );
    }

    // Discruption block text
    const db_fontX = 392;
    const db_fontY = 87;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 14 * sizeFactor;
    ctx.font = `${fontsize}px Roboto`;
    ctx.fillText(
      "DISRUPTION CLASS:",
      db_fontX * sizeFactor,
      db_fontY * sizeFactor
    );
    fontsize = 30 * sizeFactor;
    ctx.font = `bold ${fontsize}px Roboto`;
    ctx.fillText(
      config["disruption-class"][disruption_class].name.toUpperCase(),
      db_fontX * sizeFactor,
      (db_fontY + 25) * sizeFactor
    );

    // Risk block text
    const rb_fontX = 392;
    const rb_fontY = 155;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 14 * sizeFactor;
    ctx.font = `${fontsize}px Roboto`;
    ctx.fillText("RISK CLASS:", rb_fontX * sizeFactor, rb_fontY * sizeFactor);
    fontsize = 30 * sizeFactor;
    ctx.font = `bold ${fontsize}px Roboto`;
    ctx.fillText(
      config["risk-class"][risk_class].name.toUpperCase(),
      rb_fontX * sizeFactor,
      (rb_fontY + 25) * sizeFactor
    );

    // Discruption block icon number
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    fontsize = (dW / 2.5) * sizeFactor;
    ctx.font = `900 ${fontsize}px Inter`;
    ctx.fillText(
      disruption_class,
      (dX - dW / 2.5) * sizeFactor,
      (dY + dW / 1.5) * sizeFactor
    );

    // Risk block icon number
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    fontsize = (rW / 2.5) * sizeFactor;
    ctx.font = `900 ${fontsize}px Inter`;
    ctx.fillText(
      risk_class,
      (rX - rW / 2.5) * sizeFactor,
      (rY + rW / 1.5) * sizeFactor
    );
    /* ========== Canvas done ========== */
    return ctx;
  }
  async function layout_splitter_stripped(ctx) {
    /* ========== Add Lines & Boxes ========== */
    ctx.fillStyle =
      config["containment-class"][containment_class].color_transparent;
    ctx.fillRect(
      16 * sizeFactor,
      65 * sizeFactor,
      630 * sizeFactor,
      127 * sizeFactor
    ); // left side box - containment - 5 Pixels bezween the middle
    drawLine(
      ctx,
      16 * sizeFactor,
      65 * sizeFactor,
      16 * sizeFactor,
      192 * sizeFactor,
      14 * sizeFactor,
      config["containment-class"][containment_class].color
    ); // left line
    /* ========== Add image ===========*/
    let img_containment = await loadImage(
      `./library/${iconpack}/containment-class_icons/${containment_class}-icon.svg`
    );

    // Containment block icon
    const cX = 550;
    const cY = 94;
    const cW = 70;
    fillCircle(
      ctx,
      (cX + cW / 2) * sizeFactor,
      (cY + cW / 2) * sizeFactor,
      (cW / 2 + 2) * sizeFactor,
      0,
      config["containment-class"][containment_class].color
    );
    drawCircle(
      ctx,
      (cX + cW / 2) * sizeFactor,
      (cY + cW / 2) * sizeFactor,
      (cW / 2 + 2) * sizeFactor,
      4 * sizeFactor,
      "rgba(0, 0, 0, 1)"
    );
    ctx.drawImage(
      img_containment,
      cX * sizeFactor,
      cY * sizeFactor,
      cW * sizeFactor,
      cW * sizeFactor
    );
    /* ========== Add text ========== */
    // Containment block text
    const cb_fontX = 36;
    const cb_fontY = 119;
    // No secondary class
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fontsize = 14 * sizeFactor;
    ctx.font = `${fontsize}px Inter`;
    ctx.fillText(
      "CONTAINMENT CLASS:",
      cb_fontX * sizeFactor,
      cb_fontY * sizeFactor
    );
    fontsize = 30 * sizeFactor;
    ctx.font = `900 ${fontsize}px Inter`;
    ctx.fillText(
      config["containment-class"][containment_class].name.toUpperCase(),
      cb_fontX * sizeFactor,
      (cb_fontY + 30) * sizeFactor
    );
    /* ========== Canvas done ========== */
    return ctx;
  }

  // https://github.com/Automattic/node-canvas/issues/2191
  // Version 2.11.0 bugged, use 2.10.2

  //registerFont("library/extras/fonts/Roboto-Regular.ttf", { family: "Roboto", style: "normal" });
  //registerFont("library/extras/fonts/RobotoCondensed-Regular.ttf", { family: "Roboto", style: "normal" });

  let canvas_svg = createCanvas(c_width_default, c_height_default, "svg");
  let canvas = createCanvas(c_width_default, c_height_default);

  // Generate default layout (base)
  async function generate_layout_base(c_width, c_height, type) {
    canvas_svg = createCanvas(c_width, c_height, "svg");
    canvas = createCanvas(c_width, c_height);
    if (type == "svg") {
      layout_base_default(canvas_svg).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_default_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Default Stripped Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        } else {
          layout_default(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Default Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        }
      });
    } else if (type == "png") {
      layout_base_default(canvas).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_default_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Default Stripped Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        } else {
          layout_default(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Default Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        }
      });
    }
  }

  // Generate hybrid layout
  async function generate_layout_hybrid(c_width, c_height, type) {
    canvas_svg = createCanvas(c_width, c_height, "svg");
    canvas = createCanvas(c_width, c_height);
    if (type == "svg") {
      layout_base_hybrid(canvas_svg).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_hybrid_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Hybrid Stripped Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        } else {
          layout_hybrid(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Hybrid Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        }
      });
    } else if (type == "png") {
      layout_base_hybrid(canvas).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_hybrid_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Hybrid Stripped Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        } else {
          layout_hybrid(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Hybrid Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        }
      });
    }
  }

  // Generate textual layout
  async function generate_layout_textual(c_width, c_height, type) {
    canvas_svg = createCanvas(c_width, c_height, "svg");
    canvas = createCanvas(c_width, c_height);
    if (type == "svg") {
      layout_base_textual(canvas_svg).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_textual_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Textual Stripped Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        } else {
          layout_textual(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Textual Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        }
      });
    } else if (type == "png") {
      layout_base_textual(canvas).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_textual_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Textual Stripped Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        } else {
          layout_textual(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Textual Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        }
      });
    }
  }

  // Generate splitter layout
  async function generate_layout_splitter(c_width, c_height, type) {
    canvas_svg = createCanvas(c_width, c_height, "svg");
    canvas = createCanvas(c_width, c_height);
    if (type == "svg") {
      layout_base_splitter(canvas_svg).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_splitter_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Splitter Stripped Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        } else {
          layout_splitter(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.svg",
              canvas_svg.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Splitter Layout SVG");
              }
            );
            res.json({ image: canvas_svg.toBuffer().toString("base64") });
          });
        }
      });
    } else if (type == "png") {
      layout_base_splitter(canvas).then((ctx) => {
        if (
          config["containment-class"][containment_class].layout != "default"
        ) {
          layout_splitter_stripped(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Splitter Stripped Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        } else {
          layout_splitter(ctx).then((ctx) => {
            fs.writeFile(
              "./output/image.png",
              canvas.toBuffer(),
              function (err) {
                if (err) throw err;
                console.log("Generated Splitter Layout PNG");
              }
            );
            res.json({ image: canvas.toBuffer().toString("base64") });
          });
        }
      });
    }
  }

  // Determine which layout to generate
  switch (theme) {
    case 0:
      generate_layout_base(c_width_default, c_height_default, type);
      break;
    case 1:
      generate_layout_hybrid(c_width_hybrid, c_height_hybrid, type);
      break;
    case 2:
      generate_layout_textual(c_width_hybrid, c_height_hybrid, type);
      break;
    case 3:
      generate_layout_splitter(c_width_splitter, c_height_splitter, type);
      break;
    default:
      generate_layout_base(c_width_default, c_height_default, type);
      break;
  }
});
app.listen(port, function (e) {
  console.log("app is running on " + port);
});
