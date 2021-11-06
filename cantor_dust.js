/*
 * cantor_dust by matortheeternal
 * 04/16/2014
 *
 * Usage:
 * /cs cantor_dust <blockType> <size>
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

const session = context.remember();
const origin = context.getPlayer().getBlockIn().toVector().toBlockPoint();


var selectedBlock = context.getBlock(argv[1]);
var iterations = argv[2];
const cyanFont = "\u00a7b";
const redFont = "\u00a74";
let useage = "<block> <iterations>";
useage += "Arguments:\n";
useage += "<block>: name of block\n";
useage += "<iterations> - iterations to run\n";

let volume = 0;

context.checkArgs(1, 2, useage);
main: {
  if (argv[1] == "help") {
    let helpMesssge = "Actual size will be 3^iter\n";
    context.print(helpMesssge);
    break main;
  }

  if (iterations < 1 || iterations > 5) {
    context.print(cyanFont + "Argument <size> must be between 1 and 5");
    break main;
  }
  const upperBuildHeightLimit = 255;
  const lowerBuildHeightLimit = 0;
  let blockScale = Math.pow(3, iterations);
  let originY = origin.getY();

  if (originY < lowerBuildHeightLimit
    || originY > upperBuildHeightLimit) {
    context.print(redFont + "Can't build here!");
    break main;
  }
  if (blockScale > heightLimit) {
    context.print(redFont + "Will not fit at this height");
    context.print(redFont + "Note: try again at y=" +
      upperBuildHeightLimit - blockScale);
    break main;
  }
  let buildMessage = "Generating level "
  buildMessage += iterations
  buildMessage += " Cantor Dust...";
  context.print(buildMessage);
  dust(blockScale, 1, 0, 1);
  context.print("Complted! Placed " + volume + " blocks!");
}

// making cantor dust
function dust(d0, xOffset, yOffset, zOffset) {
  // return if d0 = 1
  if (d0 == 1) {
    var vec = origin.add(
      xOffset,
      yOffset,
      zOffset);
    session.setBlock(vec, selectedBlock);
    volume++;
    return;
  }

  // 1/3 of side length
  var d1 = d0 / 3;

  // recursion loop
  for (var h = 0; h < 3; h++) {
    if (h == 1)
      continue;
    for (var w = 0; w < 3; w++) {
      if (w == 1)
        continue;
      for (var l = 0; l < 3; l++) {
        if (l == 1)
          continue;
        // recursion
        if (d0 > 3)
          dust(d1, w * d1 + xOffset, h * d1 + yOffset, l * d1 + zOffset)
        else {
          var vec = origin.add(
            w + xOffset,
            h + yOffset,
            l + zOffset);
          session.setBlock(vec, selectedBlock);
          volume++;
        }
      }
    }
  }
}
