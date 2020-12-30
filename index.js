const visit = require("unist-util-visit");
const toText = require("hast-util-to-text");

const asciimath = require("asciimath");

module.exports = rehypeAsciiMath;

function rehypeAsciiMath(options) {
  return transformMath;

  function transformMath(tree, file) {
    visit(tree, "element", onelement);

    function onelement(element) {
      const classes = element.properties.className || [];
      const inline = classes.includes("math-inline");
      const displayMode = classes.includes("math-display");

      if (!inline && !displayMode) {
        return;
      }

      let value = toText(element);
      let parsedTex = undefined;
      if (value.startsWith("`") && value.endsWith("`"))
        parsedTex = asciimath.parse(value.substr(1, value.length - 2));

      if (parsedTex) {
        element.children = [{ type: "text", value: parsedTex }];
      }
    }
  }
}
