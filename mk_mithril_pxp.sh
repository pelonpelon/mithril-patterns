#!/bin/sh

# Using sweet.js macros, convert stock mithril.js to mithril_pxp.js
#
# console.log("function name") is added to all functions
#
# running counts are added to mithril.js methods m.redraw() and m.render()


sjs --readable-names -m ./mithril_pxp_macros.sjs -o ./mithril_pxp.js node_modules/mithril/mithril.js
