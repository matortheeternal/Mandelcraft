/*
 * Quadratic Koch Surface by matortheeternal
 * 04/16/2014
 *
 * Usage:
 * /cs koch_surf <blockType> <size>
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

var session = context.remember();
var origin = context.getPlayer().getBlockIn().toVector().toBlockPoint();

const iterations = argv[2];
const cyanFont = "\u00a7b";
const redFont = "\u00a74";

var volume = 0;

let useage = "<block> <iterations>\n";
useage += "block - name of block\n";
useage += "iterations - size of fractal\n";

context.checkArgs(1, 2, useage);
main: {
  if (argv[1] == "help") {
    context.print(cyanFont + useage);
    break main;
  }
  if (iterations < 1 || iterations > 5) {
    context.print(redFont + "Argument size must be between 1 and 5.");
    break main;
  }

  const upperBuildHeightLimit = 255;
  const lowerBuildHeightLimit = 0;
  const blockScale = Math.pow(3, iterations);
  const originY = origin.getY();
  if (originY < lowerBuildHeightLimit ||
    originY > upperBuildHeightLimit) {
    context.print(redFont + "Can't build here!");
  }

  let creationMsg = "Generating a size ";
  creationMsg += iterations;
  creationMsg += " Quadratic Koch Surface...";
  context.print(creationMsg);
    koch(blockScale, 0, 0, 0, 0);
  context.print("Completed! Placed " + volume + " blocks!");
}

// quadratic koch surface recursion master function
function kochRe(d, xOffset, yOffset, zOffset, mode, wS, hS, lS) {
  var wR = 1;
  var hR = 1;
  var lR = 1;
  if (wS != 1)
    wR = 0;
  if (hS != 1)
    hR = 0
  if (lS != 1)
    lR = 0;
  // surrouniterationsing spawn
  for (var w = (wS - wR); w < (wS + wR + 1); w++) {
    for (var h = (hS - hR); h < (hS + hR + 1); h++) {
      for (var l = (lS - lR); l < (lS + lR + 1); l++) {
        if ((l != lS) || (h != hS) || (w != wS))
          koch(d, w * d + xOffset, h * d + yOffset, l * d + zOffset, mode);
      }
    }
  }
  // subspawn
  if (hS <= 1)
    koch(d, wS * d + xOffset, (hS + 1) * d + yOffset, lS * d + zOffset, 0);
  if ((hS >= 1) && (mode >= 1))
    koch(d, wS * d + xOffset, (hS - 1) * d + yOffset, lS * d + zOffset, 1);
  if (wS <= 1)
    koch(d, (wS + 1) * d + xOffset, hS * d + yOffset, lS * d + zOffset, 2);
  if (wS >= 1)
    koch(d, (wS - 1) * d + xOffset, hS * d + yOffset, lS * d + zOffset, 3);
  if (lS <= 1)
    koch(d, wS * d + xOffset, hS * d + yOffset, (lS + 1) * d + zOffset, 4);
  if (lS >= 1)
    koch(d, wS * d + xOffset, hS * d + yOffset, (lS - 1) * d + zOffset, 5);
}

// making a quadratic koch surface
function koch(iter, xOffset, yOffset, zOffset, mode) {
  // return if iter = 1
  if (iter == 1)
    return;

  // 1/3 aniterations 2/3 of side length
  var d = iter / 3;

  // use mode to recurse
  var h = 1;
  var w = 1;
  var l = 1;
  switch (mode) {
    case 0:
      h--;
      cube(d, w * d + xOffset, h * d + yOffset, l * d + zOffset);
      kochRe(d, xOffset, yOffset, zOffset, 0, w, h, l);
      break;
    case 1:
      h++;
      cube(d, w * d + xOffset, h * d + yOffset, l * d + zOffset);
      kochRe(d, xOffset, yOffset, zOffset, 1, w, h, l);
      break;
    case 2:
      w--;
      cube(d, w * d + xOffset, h * d + yOffset, l * d + zOffset);
      kochRe(d, xOffset, yOffset, zOffset, 2, w, h, l);
      break;
    case 3:
      w++;
      cube(d, w * d + xOffset, h * d + yOffset, l * d + zOffset);
      kochRe(d, xOffset, yOffset, zOffset, 3, w, h, l);
      break;
    case 4:
      l--;
      cube(d, w * d + xOffset, h * d + yOffset, l * d + zOffset);
      kochRe(d, xOffset, yOffset, zOffset, 4, w, h, l);
      break;
    case 5:
      l++;
      cube(d, w * d + xOffset, h * d + yOffset, l * d + zOffset);
      kochRe(d, xOffset, yOffset, zOffset, 5, w, h, l);
      break;
  }
}

function cube(size, xRel, yRel, zRel) {
  const block = context.getBlock(argv[1]);
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      for (var z = 0; z < size; z++) {
        var vec = origin.add(xRel + x, yRel + y, zRel + z);
        session.setBlock(vec, block);
        volume++;
      }
    }
  }
}
