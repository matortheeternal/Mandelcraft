/*
 * mandel2d.js
 * created by jshultz (VulcanShultzy)
 * 10/15/2021
 */

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

const session = context.remember();
const origin = player.getBlockIn().toVector().toBlockPoint();

context.checkArgs(1, 2, "<size> <block>");
const cyanFont = "\u00a7b";
const redFont = "\u00a7c";

function main() {
  const size = argv[1];
  const selectedBlocks = context.getBlock(argv[2]);

  hilbert(size, selectedBlocks);
}

function hilbert(size, block) {
  var cursor = origin.add(1, 0, 2);

  const theta = 90;
  // define the initial condition as an axiom


  const curve = calcCurve(size);

  var scale = 2;

  session.setBlock(cursor, block);

  curve.forEach((vec2, i) => {
    for (var i = 0; i < scale; i++) {
      cursor = cursor.add(vec2[0], 0, vec2[1]);
      session.setBlock(cursor, block);
    }
  });
}

function calcCurve(size) {
  var curve = "A";
  for (var i = 0; i < size; i++) {
    curve.replaceAll(/A/ig, "-BF+AFA+FB-");
    curve.replaceAll(/B/ig, "+AF-BFA-FB+");
  }
  return curve;
}

main();
