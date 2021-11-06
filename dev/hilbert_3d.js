/*
 * Mandel.js v2.0
 * created by matortheeternal
 * 04/16/2014
 *
 * Usage:
 * /cs mandel <fractalType> <blockType> <size> [args]
 *
 * For help type:
 * /cs mandel help
 *
 * Supported types:
 *   sponge: Makes a Menger Sponge.  Iteration size 1-6.
 *   dust: Makes Cantor Dust.  Iteration size 1-6.
 *   koch: Makes a Quadratic Koch Surface.  Iteration size 1-6.
 *   cross: Makes a Greek Cross Fractal.  Iteration size 1-7.
 *   hilbert: Makes a Hilbert Curve.  Iteration size 1-7.
 *	 pyramid: Makes a Siepinski pyramid.  Iterations size 1-5.
 *   octahedron: Makes an Octahedron Fractal.  Iteration size 1-5.
 *   dodecahedron: working...
 *   box: Makes a mandelbox.  Size is dimensional value (5-255).
 *   bulb: Makes a Mandelbulb.  Size is dimensional value (5-255).
 *   cBulb: Makes a custom Mandelbulb (slower). Size is dimensional value (5-255).
 */

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);

// get data
var session = context.remember();
var origin = context.getPlayer().getBlockIn().toVector().toBlockPoint();

// writer
var writer = new BufferedWriter(new FileWriter("MandelLog.txt"));

// process arguments
context.checkArgs(1, 2, "<size> <block>");
var block = argv[1];
var d = argv[2];
const cg = "\u00a7b";
const cr = "\u00a74";

function main() {
  if (d > 7) {
    context.print(cr+"Can't generate a level "+d+" Hilbert Curve!  (Too big)");
    return;
  }
  scale = argv[4] || 3;
  context.print("Generating a level "+d+" Hilbert Curve... \n");
  hilbert_1(d, scale);
  context.print("Placed "+volume+" blocks!");
}

main();
