import * as acc from "./accessors.js";


export async function setFieldOptions() {
    const meta = await acc.accessMetadata();
    const delimiter = await acc.guessDelimiter();
    const data = await d3.dsv(delimiter, meta);
    const fields = Object.keys(data[0]);
    const types = ['Id', 'Title', 'X', 'Y', 'Size', 'Color'];
    types.forEach(t => { setOptionsByType(t, data, fields); });
    d3.selectAll(".fieldChoice-available").on("click", updateChoice);
    d3.selectAll(".fieldChoice-unavailable").on("click", updateChoice);
}


function setOptionsByType(type, data, fields) {
    var placeholder = d3.select(`#choice${type}`).select(".options").html("");
    for (const field of fields) {
        if (!field) {
            continue;
        }
        var values = data.map(d => d[field]);
        var unique_values = [... new Set(values)];
        var available = true;
        if (type == 'Id') {
            available = (values.length == unique_values.length);
        }
        if (type == 'X' | type == 'Y' | type == 'Size') {
            available = !(unique_values.map(Number).includes(NaN));
        }
        if (type == 'Color') {
            available = (unique_values.length <= 6);
        }

        if (available) {
            placeholder.append('div')
            .attr('class', 'fieldChoice-available')
            .attr('id', field)
            .html(`<p>${field}</p>`);
        } else {
            placeholder.append('div')
            .attr('class', 'fieldChoice-unavailable')
            .attr('id', field)
            .html(`<p>${field}</p>`);
        }
    }
}


function updateChoice() {
    var selected = d3.select(this);
    var selected_class = selected.attr("class");
    var parent = d3.select(this.parentNode);
    if (selected_class == "fieldChoice-available") {
        var current = parent.select('.fieldChoice-active');
        if (!!current) {
            current.attr('class', 'fieldChoice-available');
        }
        selected.attr('class', 'fieldChoice-active');
   }
   if (selected_class == "fieldChoice-active") {
        selected.attr('class', 'fieldChoice-available');
    }
}