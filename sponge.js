/*
 * created by matortheeternal
 * 04/16/2014
 *
 * Usage:
 * /cs sponge <block> <size>
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

let session = context.remember();
let origin = context.getPlayer().getBlockIn().toVector().toBlockPoint();

const iterations = argv[2];
const cyanFont = "\u00a7b";
const cr = "\u00a74";
let useage = "Useage: /cs sponge <block> <iterations>";
useage += "block - name of block";
useage += "iterations - number of iterations";

var volume = 0;
context.checkArgs(1, 2, useage);
main: {
  if (argv[1] == "help") {
    context.print(cyanFont + useage);
    break main;
  }
  if (iterations < 1 || iterations > 5) {
    context.print(cr + "Argument <iterations> must be between 1 and 5.");
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

  if (blockScale + originY > upperBuildHeightLimit) {
    context.print(redFont + "Will not fit at this height");
    context.print(redFont + "Note: try at y=" +
      upperBuildHeightLimit - blockScale);
  }

  let buildMessage = "Generating a size ";
  buildMessage += iterations;
  buildMessage += " Menger Sponge...";
  context.print(buildMessage);
  sponge(blockScale, 1, 0, 1);
  context.print("Completed! Placed " + volume + " blocks!");
}

// making a menger sponge
function sponge(d0, xOffset, yOffset, zOffset) {
  const block = context.getBlock(argv[1]);
  // return if d0 = 1
  if (d0 == 1) {
    var vec = origin.add(
      xOffset,
      yOffset,
      zOffset);
    session.setBlock(vec, block);
    volume++;
    return;
  }

  // 1/3 and 2/3 of side length
  var d1 = d0 / 3;

  // recursion loop
  for (var h = 0; h < 3; h++) {
    for (var w = 0; w < 3; w++) {
      if ((h == 1) && (w == 1))
        continue;
      for (var l = 0; l < 3; l++) {
        if (((h == 1) && (l == 1)) || ((w == 1) && (l == 1)))
          continue;
        // recursion
        if (d0 > 3)
          sponge(d1, w * d1 + xOffset, h * d1 + yOffset, l * d1 + zOffset)
        else {
          var vec = origin.add(
            w + xOffset,
            h + yOffset,
            l + zOffset);
          session.setBlock(vec, block);
          volume++;
        }
      }
    }
  }
}
