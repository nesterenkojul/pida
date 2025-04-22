import * as ren from "./renderer.js";
import * as msg from "./messages.js";


export var x_limits=null, 
    y_limits=null, 
    size_limits=null, 
    excluded_color_categories=new Set();


export async function enableFilters(data, x_name, y_name, size_name, color_name, color_map) {
    d3.select("#filterBlock").html("");

    var filter_count = [x_name, y_name, size_name, color_name].filter(d => d != null).length;
    
    if (!!y_name) {
        var y_vals = [...new Set(data.map(d => d[y_name]))];
        if (y_vals.length == 1) {
            filter_count -= 1;
        } 
    }
    if (!!x_name) {
        var x_vals = [...new Set(data.map(d => d[x_name]))];
        if (x_vals.length == 1) {
            filter_count -= 1;
        }
    }
    if (!!size_name) {
        var size_vals = [...new Set(data.map(d => d[size_name]))];
        if (size_vals.length == 1) {
            filter_count -= 1;
        }
    }
    if (!!y_name) {
        if (y_vals.length != 1) {
            addSlider('Y', y_vals, y_name, filter_count);
        } 
    }
    if (!!x_name) {
        if (x_vals.length != 1) {
            addSlider('X', x_vals, x_name, filter_count);
        }
    }
    if (!!size_name) {
        if (size_vals.length != 1) {
            addSlider('Size', size_vals, size_name, filter_count);
        }
    }
    if (!!color_name) {
        addColorBtns(color_name, color_map, filter_count);
        if (color_map.size == 1) {
            d3.select('.colorBtn-active').attr('class', 'colorBtn-partly-available').on('click', () => {});
        }
    }
}


function addColorBtns(color_name, color_map, filter_count) {
    var placeholder = d3.select("#filterBlock")
            .append('div')
            .attr('id', `filterColor`)
            .style('width', `${Math.floor(100 / filter_count) - 2}%`)
            .html(`<div id="colorCategoryName"></div>
                    <div id="colorBtns"></div>
                   <p><span>${msg.language == 'eng' ? 'Color' : 'Цвет'} |</span> ${color_name}</p>`)
            .select('#colorBtns');

    for (const [cat, col] of color_map) {
        placeholder.append('button')
            .attr('class', 'colorBtn-active')
            .attr('id', cat)
            .style('width', `${Math.floor((100 - 2*color_map.size) / color_map.size)}%`)
            .style('background', col)
            .on('click', updateColorChoice)
            .on('mouseover', displayColorCategory)
            .on('mouseout', () => d3.select("#colorCategoryName").html(" "));
    }
}


/* displays the category name on hover above a color button */
function displayColorCategory() {
    var btn = d3.select(this);
    var id = btn.attr('id');
    var color = btn.style('background');
    d3.select("#colorCategoryName")
        .html(id)
        .style("color", color);
}


/* filters data on color button click */
function updateColorChoice(event) {
    var btn = d3.select(this);
    var id = btn.attr('id');
    var cls = btn.attr('class');
    if (cls == 'colorBtn-active') {
        excluded_color_categories.add(id);
        btn.attr('class', 'colorBtn-inactive').html('');
    } else {
        excluded_color_categories.delete(id);
        btn.attr('class', 'colorBtn-active').html('');
    }
    rerender(event);
}


/* updates the clickability of color buttons according to the current category visibility */
export function updateColorAvailability(data, color_name) {
    var visible_vals = new Set(data.map(d => String(d[color_name])));
    d3.select('#colorBtns').selectAll('button').each(function(d) {
        var btn = d3.select(this); 
        var id = btn.attr('id');
        if (!visible_vals.has(id)) {
            btn.attr('class', 'colorBtn-unavailable')
                .html('')
                .append('svg')
                .attr('viewBox', `0 0 10 10`)
                .append('path')
                .attr('d', "M 2 2 L 8 8 M 2 8 L 8 2");
        } else if (excluded_color_categories.has(id)) {
            btn.attr('class', 'colorBtn-inactive').html('');
        } else {
            if (visible_vals.length == 1) {
                btn.attr('class', 'colorBtn-partly-available').on('click', () => {}).html('');
            } else {
                btn.attr('class', 'colorBtn-active').html('');
            }
        }
    });
}


function addSlider(type, values, name, filter_count) {
    var [min_val, max_val] = d3.extent(values);
    var step = Infinity;
    values = values.sort();
    for (var i = 1; i < values.length; i++) {
        var diff = values[i] - values[i-1];
        step = (diff < step) ? diff : step;
    }
    
    var slider = d3.select("#filterBlock")
                        .append('div')
                        .attr('class', 'filterSlider')
                        .attr('id', `filter${type}`)
                        .style('width', `${Math.floor(100 / filter_count) - 10}%`)
                        .html(`<div class="rangeSlider"></div>
                                <p><span>${msg.language == 'rus' && type == 'Size' ? 'Размер' : type} |</span> ${name}</p>`)
                        .select('.rangeSlider')
                        .node();

    var tooltip_format = function (val) {
        return val.toFixed((String(step) + '.').split('.')[1].length);
    }

    noUiSlider.create(slider, {
        start: [min_val, max_val],
        connect: true,
        step: step,
        tooltips: {to: tooltip_format},
        range: {
                'min': min_val,
                'max': max_val
            }
        });

    slider.noUiSlider.on('change', rerender);
}


async function rerender(values) {
    if (!!this) {
        values = values.map(Number);
        var id = this.target.parentNode.id.replace('filter', '');
        console.log(id);
        if (id == 'X') {
            x_limits = values;
        }
        if (id == 'Y') {
            y_limits = values;
        }
        if (id == 'Size') {
            size_limits = values;
        }
    }
    await ren.render(!this ? values.target : this.target, 'rerender');
}


/* restores the state of filters after closing the overlay window */
export function returnMainFilters() {
    for (const id of ['X', 'Y', 'Size']) {
        var filter = d3.select('#filter' + id);
        if (!filter.empty()) {
            var slider = filter.select('.rangeSlider').node();
            var values = slider.noUiSlider.get();
            values = values.map(Number);
            if (id == 'X') {
                x_limits = values;
            }
            if (id == 'Y') {
                y_limits = values;
            }
            if (id == 'Size') {
                size_limits = values;
            }
        }

        d3.select('#colorBtns').selectAll('button').each(function(d) {
            var btn = d3.select(this); 
            var id = btn.attr('id');
            if (btn.attr('class') == 'colorBtn-inactive') {
                excluded_color_categories.add(id);
            } else if (btn.attr('class') == 'colorBtn-active') {
                excluded_color_categories.delete(id);
            } 
        });
        console.log(excluded_color_categories);
    }
}


export function nullifyFilters() {
    x_limits=null;
    y_limits=null;
    size_limits=null;
    excluded_color_categories=new Set();
}