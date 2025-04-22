import * as acc from "./accessors.js";
import * as imgrs from "./imagers.js";
import * as ren from "./renderer.js";
import * as msg from "./messages.js";


export async function enableViewer(thumb_group) {
    var placeholder = d3.select("#menuBottom").select(".menuContent");
    placeholder.select("#viewer").html("");
    placeholder.select("#info").html("");
    
    // image or pdf viewer block
    var id = d3.select(thumb_group).attr("id");
    var url = await imgrs.returnImageURL(id);
    var dimensions = await imgrs.returnImageSize(url);
    placeholder.attr("id", (dimensions.width > dimensions.height) ? "horizontal" : "vertical");
    var files = await acc.accessFilesById([id], true);
    var file = !!files ? files[0] : null;
    var viewer = placeholder.select("#viewer");
    viewer.style('width', dimensions.width + 'px').style('height', dimensions.height + 'px');
    if (!!file && file.type == 'application/pdf') {
        var file_url = URL.createObjectURL(file);
        viewer.append("iframe")
            .attr("frameBorder", "none")
            .attr("src", file_url)
            .attr("class", "viewerDisplay")
            .attr("id", "pdfViewer");
    } else {
        viewer.append('img').attr("class", "viewerDisplay").attr("src", url);   
    }

    // metadata block
    const meta = await acc.accessMetadata();
    const delimiter = await acc.guessDelimiter();
    var raw_data = await d3.dsv(delimiter, meta);
    var entry = d3.group(raw_data, (d) => d[ren.id_name]).get(id)[0];
    var not_chsn = msg.language == 'eng' ? '<span>not chosen</span>' : '<span>не выбрано</span>';
    var init_x_name = ren.getChoice('X'),
        init_y_name = ren.getChoice('Y');
    var template = 
        `<h2><span>ID |</span> ${ren.id_name}</h2> <p>${entry[ren.id_name]}</p>
        <h2><span>${msg.language == 'eng' ? 'Title' : 'Название'}
        ${!ren.title_name ? '</span>' : ' |</span> ' + ren.title_name}</h2> <p>${!ren.title_name ? not_chsn : entry[ren.title_name]}</p>
        <h2><span>X${!init_x_name ? '</span>' : ' |</span> ' + init_x_name}</h2> <p>${!init_x_name ? not_chsn : entry[init_x_name]}</p>
        <h2><span>Y${!init_y_name ? '</span>' : ' |</span> ' + init_y_name}</h2> <p>${!init_y_name ? not_chsn : entry[init_y_name]}</p>
        <h2><span>${msg.language == 'eng' ? 'Size' : 'Размер'}
        ${!ren.size_name ? '</span>' : ' |</span> ' + ren.size_name}</h2> <p>${!ren.size_name ? not_chsn : entry[ren.size_name]}</p>
        <h2><span>${msg.language == 'eng' ? 'Color' : 'Цвет'}
        ${!ren.color_name ? '</span>' : ' |</span> ' + ren.color_name}</h2> <p>${!ren.color_name ? not_chsn : entry[ren.color_name]}</p>`;
    placeholder.select("#info").html(template);
}