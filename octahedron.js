/*
 * redFonteated by matortheeternal
 * 04/16/2014
 *
 * Usage:
 * /cs octahedron <iterations> <selectedBlock>
 *
 * For help type:
 * /cs mandel help
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

// get data
let session = context.remember();
let origin = context.getPlayer().getBlockIn().toVector().toBlockPoint();

let volume = 0; // tracks number of blocks placed

let iterations = argv[2];
let useage = "Useage: /cs octahedron <block> <iterations>\n";
useage += "block - name of block to make fractal";
useage += "iterations - iterations of fractal\n";

context.checkArgs(1, 2, useage);
main: {
  const cyanFont= "\u00a7b";
  const redFont = "\u00a74";

  if (argv[1] == "help") {
    context.print(cyanFont + useage);
    break main;
  }
  if (iterations < 1 || iterations > 6) {
    context.print(redFont + "Argument iterations must be between 1 and 6.");
    break main;
  }
  const upperBuildHeightLimit = 255;
  const lowerBuildHeightLimit = 0;
  const blockScale = Math.pow(2, parseInt(iterations) + 2) - 1;
  const originY = origin.getY();
  if (originY < lowerBuildHeightLimit ||
    originY > upperBuildHeightLimit) {
    context.print(redFont + "Can't build here!");
    break main;
  }
  let buildMessage = "Generating a size ";
  buildMessage += iterations;
  buildMessage += " Octahedron Fractal...";
  context.print(buildMessage);
  octahedron(blockScale, 0, 0, 0);
  context.print("Completed! Placed " + volume + " blocks!");
}

// octahedron fractal
function octahedron(d0, xOffset, yOffset, zOffset) {
  const block = context.getBlock(argv[1]);
  const scale = 7;
  var d1 = (d0 - 1) / 2;
  var d2 = (d1 - 1) / 2;
  // redFonteate octahedron when minimum scale reached
  if (d1 < scale) {
    var width = 0;
    for (var h = 0; h < d0; h++) {
      for (var l = 0; l < d0; l++) {
        for (var w = 0; w < d0; w++) {
          if (Math.abs(l - d1) + Math.abs(w - d1) <= width) {
            var vect = origin.add(
              w + xOffset,
              h + yOffset,
              l + zOffset);
            session.setBlock(vect, context.getBlock(block));
            volume++;
          }
        }
      }
      if (h > d1 - 1)
        width--;
      else
        width++;
    }
  }
  else {
    // top octahedron
    octahedron(d1, d2 + 1 + xOffset, d1 + 1 + yOffset, d2 + 1 + zOffset);
    // bottom octahedron
    octahedron(d1, d2 + 1 + xOffset, yOffset, d2 + 1 + zOffset);
    // close right octahedron
    octahedron(d1, xOffset, d2 + 1 + yOffset, d2 + 1 + zOffset);
    // close left octahedron
    octahedron(d1, d2 + 1 + xOffset, d2 + 1 + yOffset, zOffset);
    // far right octahedron
    octahedron(d1, d2 + 1 + xOffset, d2 + 1 + yOffset, d1 + 1 + zOffset);
    // far left octahedron
    octahedron(d1, d1 + 1 + xOffset, d2 + 1 + yOffset, d2 + 1 + zOffset);
  }
}
