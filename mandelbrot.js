/*
 * mandel2d.js
 * created by jshultz (VulcanShultzy)
 * 10/01/2021
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

const session = context.remember();
const origin = player.getBlockIn().toVector().toBlockPoint();

const cyanFont = "\u00a7b";
const redFont = "\u00a7c";

let palette = argv[1].split(",");

if (palette.length < 2) {
  switch (palette) {
    case "rainbow":
      palette = ["black_concrete",
        "magenta_concrete",
        "purple_concrete",
        "blue_concrete",
        "light_blue_concrete",
        "cyan_concrete",
        "warped_planks",
        "green_concrete",
        "lime_concrete",
        "yellow_concrete",
        "orange_concrete",
        "red_concrete"
      ];
      break;

    default:
    palette = ["black_concrete",
      "magenta_concrete",
      "purple_concrete",
      "blue_concrete",
      "light_blue_concrete",
      "cyan_concrete",
      "warped_planks",
      "green_concrete",
      "lime_concrete",
      "yellow_concrete",
      "orange_concrete",
      "red_concrete"
    ];
      break;
  }
}

const size = parseInt(argv[2]);
const maxIter = argv[4] ? parseInt(argv[4]) : 100;

let volume = 0;

let useage = "<palette> <size> [maxIter] [flags]\n";
useage += "mandelbrot help for help\n";
useage += "mandelbrot def for definition\n";
useage += "Arguments:\n";
useage += "<palette> a list of blocks, separated by commas\n";
useage += "<size> size of the fractal";
useage += "limits: horizontal - 1 to 1024";
useage += "vertical - 1 to 256 at y=0";
useage += "[maxIter] Optional - maximum iterations to calculate a position";
useage += "- defaults to 100";
useage += "[flags] Optional - general modifiers\n";
useage += "Flags:\n";
useage += "[x] placed vertically - aligned to x axis\n";
useage += "[z] placed vertically - aligned to z axis\n";

if (argv.length > 2) flags = String(argv[3]);
else flags = false;

if (flags) {
  alignX = flags.search("x") != -1;
  alignZ = flags.search("z") != -1;
  julia = flags.search("j") != -1;
}
else alignX = alignZ = julia = false;

context.checkArgs(1, 4, useage);
main: {
  if (argv[1] == "def") {
    let definition = "Mandelbrot Set\n";
    definition += "Defined as set of all points on a complex plane\n";
    definition += "that remain stable for Zn+1 = Zn^2 + C\n";
    definition += "as n goes to infinity\n";
    context.print(definition);
    break main;
  }
  if (argv[1] == "help") {
    let helpMesssge = "Palette must use block names separated by commas.\n";
    helpMesssge += "Spaces are not allowed.\n";
    helpMesssge += "ex. mandelbrot black_terracotta,red_terracotta 128\n";
    helpMessage += "For palette options: mandelbrot palletes"
    context.print(helpMesssge);
    break main;
  }
  if (argv[1] == "palettes") {
    let paletteList = "rainbow\n";
    context.print(paletteList);
    break main;
  }

  const upperBuildHeightLimit = 255;
  const lowerBuildHeightLimit = 0;
  const originY = origin.getY();
  if (size < 1 || size > 1024) {
    context.print(redFont + "Invalid size, must be between 1-1024");
    break main;
  }
  if (originY < lowerBuildHeightLimit ||
    originY > upperBuildHeightLimit) {
    context.print(redFont + "Can't build here!");
    break main;
  }
  else if ((alignX || alignZ) && size + originY - 1 > upperBuildHeightLimit) {
    context.print(redFont + "Will not fit at this position.");
    context.print(redFont + "Note: try again at y="
      + upperBuildHeightLimit - size);
    break main;
  }

  let buildMessage = "Generating a "
  buildMessage += size;
  buildMessage += "x";
  buildMessage += size;
  buildMessage += " block Mandelbrot Set...";

  if (julia) {
    // validate and parse the format of the string
    let juliaMatch = flags.search(/j=-?\d+\.\d*,-?\d+\.\d*/g);
    if (juliaMatch != -1) {
      let juliaPos = flags.slice(juliaMatch + 2).split(",", 2);
      let juliaX, juliaY;
      [juliaX, juliaY] = juliaPos;
      execMsg += "Julia mode enabled | c=" + juliaX + "+" + juliaY + "i";
      context.print(buildMessage);
      mandelbrot(size, parseInt(juliaX), parseInt(juliaY));
      context.print("Completed! Placed " + volume + " blocks!");
    }

  } else {
    context.print(buildMessage);
    mandelbrot(size, 0, 0);
    context.print("Completed! Placed " + volume + " blocks!");
  }
}

function mandelbrot(size, cx, cy) {
  for (var xi = 0; xi < size; xi++) {
    for (var yi = 0; yi < size; yi++) {

      var x = xi / size * 2.5 - 2;
      var y = yi / size * -2.5 + 1.25;

      var c = complexNumber(x, y);
      var z = complexNumber(cx, cy);

      if (julia) {
        x = xi / size * 3.3 - 1.65;
        y = yi / size * -3.3 + 1.65;
        c = complexNumber(cx, cy);
        z = complexNumber(x, y);
      }

      var iteration = 0;
      while (abs(z) < 2 && iteration < maxIter) {
        // z' = z*z+c
        z = add(multi(z, z), c);
        iteration++;
      }
      if (alignX)
        cursor = origin.add(xi + 1, size - yi, 0);
      else if (alignZ)
        cursor = origin.add(0, size - yi, xi + 1);
      else
        cursor = origin.add(xi + 1, 0, yi + 1);
      var blockIndex = iteration < maxIter ?
        Math.ceil(iteration / maxIter * (palette.length - 1)) :
          abs(z) >= 2 ? 1 : 0;
      var selectedBlock = context.getBlock(palette[blockIndex]);
      session.setBlock(cursor, selectedBlock);

      if (volume > 0 && volume % 10000 == 0) {
        context.print(volume + " blocks placed");
      }
      volume++;
    }
  }
}

function complexNumber(real, imag) {
  return { real: real, imag: imag };
}

function add(cnum1, cnum2) {
  return { real: cnum1.real + cnum2.real, imag: cnum1.imag + cnum2.imag };
}

function multi(cnum1, cnum2) {
  return {
    real: cnum1.real * cnum2.real - cnum1.imag * cnum2.imag,
    imag: cnum1.real * cnum2.imag + cnum1.imag * cnum2.real
  };
}

function abs(cnum) {
  return Math.sqrt(cnum.real * cnum.real + cnum.imag * cnum.imag);
}
