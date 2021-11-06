/*
 * created by matortheeternal
 * 04/16/2014
 *
 * Usage:
 * /cs greek_cross <block> <iterations>
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);
var session = context.remember();
var origin = context.getPlayer().getBlockIn().toVector().toBlockPoint();

// process arguments
let iterations = argv[2];
const cg = "\u00a7b";
const cr = "\u00a74";
let volume = 0;
let useage = "Useage: /cs greek_cross <block> <iterations>\n";
useage += "block - name of block\n";
useage += "iterations to run\n";

context.checkArgs(1, 2, useage);
main: {
  if (argv[1] == "help") {
    context.print(useage);
    break main;
  }
  if (iterations < 1 || iterations > 7) {
    context.print(cr + "Argument must be between 1 and 7.");
    break main;
  }
  const upperBuildHeightLimit = 255;
  const lowerBuildHeightLimit = 0;
  const originY = origin.getY();
  const blockScale = Math.pow(2, parseInt(iterations) + 1) - 1;
  if (originY < lowerBuildHeightLimit
    || originY > upperBuildHeightLimit) {
    context.print(redFont + "Can't build here!");
    break main;
  }
  context.print("Generating a level " + iterations + " Greek Cross Fractal... \n");
  cross(blockScale, 0, 0, 0, 3, 0);
  context.print("Placed " + volume + " blocks!");
}

// making a greek cross fractal
function cross(d0, xOffset, yOffset, zOffset, scale, mode) {
  const block = context.getBlock(argv[1]);
  var d1 = (d0 - 1) / 2;
  if ((Math.floor(d1) - d1 != 0) || (d1 < scale))
    return;
  // make cross
  if (mode != 1) {
    for (var w = 0; w < d0; w++) {
      if (w == d1)
        continue;
      var vec = origin.add(
        w + xOffset,
        d1 + yOffset,
        d1 + zOffset);
      session.setBlock(vec, block);
      volume++;
    }
  }
  if (mode != 2) {
    for (var h = 0; h < d0; h++) {
      if (h == d1)
        continue;
      var vec = origin.add(
        d1 + xOffset,
        h + yOffset,
        d1 + zOffset);
      session.setBlock(vec, block);
      volume++;
    }
  }
  if (mode != 3) {
    for (var l = 0; l < d0; l++) {
      if (l == d1)
        continue;
      var vec = origin.add(
        d1 + xOffset,
        d1 + yOffset,
        l + zOffset);
      session.setBlock(vec, block);
      volume++;
    }
  }
  d1++;
  // recursion close
  cross(d1 - 1, 0 + xOffset, d1 / 2 + yOffset, d1 / 2 + zOffset, scale, 1);
  cross(d1 - 1, d1 / 2 + xOffset, 0 + yOffset, d1 / 2 + zOffset, scale, 2);
  cross(d1 - 1, d1 / 2 + xOffset, d1 / 2 + yOffset, 0 + zOffset, scale, 3);
  // recursion far
  cross(d1 - 1, d1 + xOffset, d1 / 2 + yOffset, d1 / 2 + zOffset, scale, 1);
  cross(d1 - 1, d1 / 2 + xOffset, d1 + yOffset, d1 / 2 + zOffset, scale, 2);
  cross(d1 - 1, d1 / 2 + xOffset, d1 / 2 + yOffset, d1 + zOffset, scale, 3);
}
