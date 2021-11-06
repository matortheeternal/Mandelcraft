/*
 * Created by by VulcanShultzy
 *
 * Usage:
 * /cs pyramid <iterations> <blocks>
 * Arguments:
 * iterations:  iterations of fractal
 * block: block to use
 *
 * For help type:
 * /cs mandel help
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

let session = context.remember();
let origin = context.getPlayer().getBlockIn().toVector().toBlockPoint();
let useage = "Useage /cs seirpinski_pyra <block> <iterations>\n";
useage += "block - name of block\n";
useage += "iterations - iterations of fractal\n";
useage += "Note: known to not generate at player's y-level.";
useage += "Top may not fully generate."

var volume = 0;

const iterations = argv[2];

context.checkArgs(1, 2, useage);
main: {
  const cyanFont = "\u00a7b";
  const redFont = "\u00a74";
  if (argv[1] == "help") {
    context.print(cyanFont + useage);
    break main;
  }

  if (iterations < 1 || iterations > 6) {
    context.print(redFont + "Argument iterations must be between 1 and 6");
    break main;
  }
  const upperBuildHeightLimit = 255;
  const lowerBuildHeightLimit = 0;
  const blockScale = Math.pow(2, parseInt(iterations) + 2) - 1;
  const originY = origin.getY();
  if (originY < lowerBuildHeightLimit ||
    originY > upperBuildHeightLimit) {
    context.print(redFont + "Can't build here!");
  }
  let buildMessage = "Generating a size ";
  buildMessage += iterations;
  buildMessage += " pyramid fractal...";
  context.print(buildMessage);
  pyramid(blockScale, 0, 0, 0);
  context.print("Completed! Placed " + volume + " blocks!");
}

// make a seirpinski pyramid
function pyramid(iterations, xOffset, yOffset, zOffset) {
  const block = context.getBlock(argv[2]);
  const scale = 7;
  const half = (iterations - 1) / 2;
  const quarter = (half - 1) / 2;
  if (half < scale) {
    var width = 3;
    for (var y = 0; y < half + 1; y++) {
      for (var z = 0; z < scale; z++) {
        for (var x = 0; x < scale; x++) {
          if (Math.abs(z - half) + Math.abs(x - half) <= width) {
            var vect = origin.add(
              x + xOffset,
              y + yOffset,
              z + zOffset);
            session.setBlock(vect, block);
            volume++;
          }
        }
      }
      width--;
    }
  }

  else {
    pyramid(half,
      quarter + 1 + xOffset,
      half + 1 + yOffset,
      quarter + 1 + zOffset);
    pyramid(half,
      xOffset,
      quarter + 1 + yOffset,
      quarter + 1 + zOffset);
    pyramid(half,
      quarter + 1 + xOffset,
      quarter + 1 + yOffset,
      zOffset);
    pyramid(half,
      quarter + 1 + xOffset,
      quarter + 1 + yOffset,
      half + 1 + zOffset);
    pyramid(half,
      half + 1 + xOffset,
      quarter + 1 + yOffset,
      quarter + 1 + zOffset);
  }
}
