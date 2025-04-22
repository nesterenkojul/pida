import * as upl from "./uploaders.js";
import * as ren from "./renderer.js";
import * as arr from "./arrows.js";
import * as msg from "./messages.js";


msg.rus(); // language settings. for english use: msg.eng() + change form load source in index.html
arr.enableArrows();
upl.createUploader('file', 'uploadBlockFile');
upl.createUploader('meta', 'uploadBlockMeta');
window.onload = function (event) {
    d3.select('#chartArea').html(msg.welcome);
    var dimensions_ok = ren.checkDimensions();
    if (dimensions_ok) {
        ren.screenAdapt(event);
    }
}
window.onresize = function (event) {
    var dimensions_ok = ren.checkDimensions();
    if (dimensions_ok) {
        ren.render(event.target, 'resize');
    }
}