import * as acc from "./accessors.js";
import * as arr from "./arrows.js";
import * as fil from "./filters.js";
import * as imgrs from "./imagers.js";
import * as msg from "./messages.js";
import * as over from "./overlayer.js";


const margin = {horizontal: 50, vertical: 100};
const sideMenuPeek = 40;

var thumbnail_border_width = null,
    thumbnail_area = null,
    axis_margin_w = null,
    axis_margin_h = null,
    width = null,
    height = null;

export var id_name = null,
    title_name = null,
    x_name = null,
    y_name = null,
    size_name = null,
    color_name = null,
    color_map = null;

export function getChoice(col) {
    var val = d3.select(`#choice${col}`).select(".fieldChoice-active");
    return val.empty() ? null : val.attr("id");
}

/* Render a warning message in case the window dimensions are too small. */
export function checkDimensions() {
    var ssm = d3.select("#small-screen-msg");
    if (!ssm.empty()) {
        ssm.remove();
    }
    if (window.innerWidth < 640 || window.innerHeight < 510) {
        d3.selectAll(".sideMenu").style("opacity", 0);
        d3.select("#chartArea").style("opacity", 0);
        d3.select("#filterBlock").style("opacity", 0);
        var sm_sc_m = d3.select("body")
            .append('h1')
            .attr('id', "small-screen-msg")
            .html(window.innerHeight < 250 ? msg.very_small_screen : msg.small_screen);
        var ssm_w = Number(sm_sc_m.style('width').replace('px', '')),
            ssm_h = Number(sm_sc_m.style('height').replace('px', ''));
        sm_sc_m.style('left', (window.innerWidth - ssm_w) / 2 + 'px')
            .style('top', (window.innerHeight - ssm_h) / 2 + 'px');
        return false;
    }
    return true;
}


/* Resize all elements according to the window dimensions. */
export function screenAdapt(event, type='init') {
    thumbnail_border_width = window.innerHeight * 0.005;
    width = window.innerWidth - 2*sideMenuPeek - 2*margin.horizontal;
    height = window.innerHeight - 2*margin.vertical - sideMenuPeek;
    axis_margin_w = margin.horizontal;
    axis_margin_h = margin.vertical / 2;
    
    // chart area
    d3.select("#chartArea").style("left", `${sideMenuPeek + margin.horizontal}px`)
        .style("width", `${width}px`)
        .style("height", `${height}px`)
        .style("opacity", 0);
    
    var main_msg = d3.select("#chartArea").select('h1');
    if (!main_msg.empty()) {
        var mm_w = Number(main_msg.style('width').replace('px', '')),
            mm_h = Number(main_msg.style('height').replace('px', ''));
        main_msg.style('left', (width - mm_w) / 2 + 'px')
            .style('top', (height - mm_h) / 2 + 'px');
    }

    // filter block
    d3.select("#filterBlock").style("left", `${sideMenuPeek + margin.horizontal}px`)
        .style("z-index", 0)
        .style("bottom", `${2*sideMenuPeek}px`)
        .style("width", `${width}px`)
        .style("opacity", (type != 'init') ? 1 : 0);

    // left & right side menus
    d3.selectAll('.sideMenu')
        .style('width', `${window.innerWidth - margin.horizontal}px`)
        .style('height', `${window.innerHeight - margin.vertical - 2*sideMenuPeek}px`)
        .style("opacity", 1);
    
    var menuLeft = d3.select('#menuLeft');
    if (menuLeft.select('svg').attr('class') == 'arrowOpen') {
        menuLeft.style('left', `-${window.innerWidth - margin.horizontal - sideMenuPeek - 5}px`);
    } else {
        menuLeft.transition().duration(500).style('left', `-${sideMenuPeek}px`);
    }
    var menuRight = d3.select('#menuRight');
    if (menuRight.select('svg').attr('class') == 'arrowOpen') {
        menuRight.style('right', `-${window.innerWidth - margin.horizontal - sideMenuPeek - 5}px`);
    } else {
        menuRight.transition().duration(500).style('right', `-${sideMenuPeek}px`);
    }

    d3.select('#uploadForm').style('left', `${2*sideMenuPeek - 10}px`);
    d3.selectAll('.uploadColumn')
        .style('width', `${(window.innerWidth - margin.horizontal - 3*sideMenuPeek - 10) / 2}px`)
        .style('height', `${window.innerHeight - margin.vertical - 2*sideMenuPeek}px`);
    d3.select('#fieldChoice').style('left', `${sideMenuPeek}px`);
    d3.selectAll('.choiceList')
        .style('width', `${(window.innerWidth - margin.horizontal - 6*sideMenuPeek) / 6}px`)
        .style('height', `${window.innerHeight - margin.vertical - 2*sideMenuPeek}px`);
    d3.selectAll('.options').style('height', `${window.innerHeight - margin.vertical - 2*sideMenuPeek - 
        Number(d3.select('h2').style('height').replace('px', '')) - 2*Number(d3.select('h2').style('margin-bottom').replace('px', ''))}px`);

    // overlay expansion bottom menu
    var menuOverlay = d3.select('#menuOverlay')
        .style('left', `${margin.horizontal + sideMenuPeek}px`)
        .style('width', `${width}px`)
        .style('height', `${window.innerHeight}px`);
    var content_height = height - sideMenuPeek;
    var content_width = width - 20;
    menuOverlay.select('.menuContent')
        .style("left", '10px')
        .style('height', content_height + 'px')
        .style('width', content_width + 'px');
    var overlay_filters = menuOverlay.select('#filterBlock');
    if (!overlay_filters.empty()) {
        overlay_filters.style("left", '10px')
            .style('top', content_height + 1.5*sideMenuPeek + 'px')
            .style('width', content_width - 10 + 'px');
    }
    menuOverlay.transition().duration(1000).style('top', (menuOverlay.select('svg').attr('class') == 'arrowOpen') ? 
        `${3*window.innerHeight}px` : `${margin.vertical}px`);

    // document viewer bottom menu
    var menuBottom = d3.select('#menuBottom')
        .style('left', `${margin.horizontal + sideMenuPeek}px`)
        .style('width', `${width}px`)
        .style('height', `${window.innerHeight}px`);
    var content_height = window.innerHeight - margin.vertical - 2*sideMenuPeek + 16;
    var content_width = width;
    menuBottom.select('.menuContent')
        .style('height', content_height + 'px')
        .style('width', content_width +'px');
    var info = menuBottom.select("#info");
    var viewer = menuBottom.select("#viewer");
    var init_width = Number(viewer.style("width").replace('px', ''));
    var init_height = Number(viewer.style("height").replace('px', ''));
    if (menuBottom.select('.menuContent').attr("id") == "vertical") {
        var new_width = width * 0.7;
        var new_height = new_width * init_height / init_width;
        if (new_height > content_height - 5) {
            new_height = content_height - 5;
            new_width = new_height * init_width / init_height;
        }
        viewer.style('width', new_width + 'px')
            .style('height', new_height + 'px')
            .style('top', 0)
            .style('left', '-1px');
        info.style('width', `${width * 0.3 - 20}px`)
            .style('height', content_height + 'px')
            .style('left', new_width + 'px')
            .style('top', 0);
    } else {
        var new_height = (window.innerHeight - margin.vertical - 2*sideMenuPeek) * 0.7;
        var new_width = new_height * init_width / init_height;
        if (new_width > content_width) {
            new_width = content_width;
            new_height = new_width * init_height / init_width;
        }
        var margins = width - new_width;
        viewer.style('height', new_height + 'px')
            .style('width', new_width + 'px')
            .style('left', `${margins / 2 - 1}px`)
            .style('top', 0);
        info.style('width', content_width + 'px')
            .style('height', `${content_height - new_height - 40}px`)
            .style('top', new_height + 40 + 'px')
            .style('left', 0);
    }
    if (menuBottom.select('svg').attr('class') == 'arrowClose') {
        menuOverlay.style("opacity", 0);
        menuBottom.transition().duration(1000).style('top', `${margin.vertical}px`);
    } else {
        menuBottom.transition().duration(1000).style('top', `${3*window.innerHeight}px`);
    }
    
    // final reveal
    if (d3.selectAll('.arrowClose').empty() || menuOverlay.select('svg').attr('class') == 'arrowClose') {
        d3.select("#chartArea").transition().duration(1000).style("opacity", 1);
        d3.select("#filterBlock").transition().duration(1000).style("opacity", 1);
    }
}


/* Adds all chart elements to the chart area and the filter block. */
export async function render(target, type='init') {
    screenAdapt(this, type == 'init' ? 'init' : 'rerender');
    var area = d3.select("#chartArea");
    // disables rerendering if the initial chart had not been rendered
    if ((target.id != 'renderBtn' && target.id != 'menuOverlay' && area.select('g').empty()) || 
        (!(d3.selectAll('.arrowClose').empty()) && d3.select('#menuOverlay').select('svg').attr('class') == 'arrowOpen')) {
        return;
    }
    area.style("opacity", 0);
    area.html("");
    
    // connect the user's choice of column names and data encoding methods
    id_name = getChoice('Id');
    title_name = getChoice('Title');
    x_name = d3.select(area.node().parentNode).attr('id') == 'menuOverlay' ? null : getChoice('X');
    y_name = d3.select(area.node().parentNode).attr('id') == 'menuOverlay' ? null : getChoice('Y');
    size_name = getChoice('Size');
    color_name = getChoice('Color');

    // accesses metadata
    const meta = await acc.accessMetadata();
    const delimiter = await acc.guessDelimiter();
    var raw_data = await d3.dsv(delimiter, meta);
    raw_data = raw_data.map(numberColumnsToNum);
    var data = raw_data.filter(applyFilters, false);

    // set thumbnail area depending on dataset size
    var thumb_coef = window.innerHeight < window.innerWidth ? 
        window.innerHeight / window.innerWidth / data.length / 2 : 
        window.innerWidth / window.innerHeight / data.length / 2;
    thumb_coef = (thumb_coef > 0.01 || (!x_name && !y_name)) ? 0.01 : thumb_coef;
    thumbnail_area = window.innerHeight * window.innerWidth * thumb_coef;
    
    // converts supposed-to-be-numeric columns to the Number data type
    function numberColumnsToNum(d) {
        var num_cols = [x_name, y_name, size_name];
        for (const col of num_cols) {
            if (!!col) {
                d[col] = Number(d[col]);
            }
        }
        return d;
    }

    // returns a list of IDs of items from the selected overlay group
    function getIdLimits() {
        var overlay = d3.select('.overlay-group-active');
        if (overlay.empty()) {
            return null;
        }
        var overlay_id = overlay.attr('id');
        var ids = new Set();
        for (var element of d3.selectAll('.overlay_' + overlay_id)) {
            var id = d3.select(element).attr('id');
            ids.add(id);
        }
        return ids;
    }


    // filters metadata according to the current state of filters (x/y/size sliders and color buttons)
    function applyFilters(d) {
        var id_limits = getIdLimits();
        if (!!id_limits && !id_limits.has(d[id_name])) {
            return false;
        }
        var pairs = [[x_name, fil.x_limits], [y_name, fil.y_limits], [size_name, fil.size_limits]];
        for (const pair of pairs) {
            if (!!pair[0] && !!pair[1]) {
                var val = d[pair[0]];
                var [min_v, max_v] = pair[1];
                var can_return = val >= min_v && val <= max_v;
                if (!can_return) {
                    return false;
                }
            }
        }
        return (!color_name || this) ? true : !fil.excluded_color_categories.has(String(d[color_name]));
    }

    // generates x or y ("type" parameter) axis, renders it and returns the corresponding transformation function
    function setupAxis(svg, type, axis_name, limits, pixel_range, transformation) {
        const max_tick_num = type == 'x' ? Math.floor(width / 50) : Math.floor(height / 40);
        var [min_val, max_val] = !limits ? d3.extent(data, (d) => d[axis_name]) : limits;
        var values = [...new Set(data.map(d => d[axis_name]))].sort((a, b) => (a - b));
        var step = Infinity;
        for (var i = 1; i < values.length; i++) {
            var diff = values[i] - values[i-1];
            step = (diff < step) ? diff : step;
        }
        if (values.length <= max_tick_num && step >= Math.ceil((max_val - min_val) / max_tick_num)) {
            var tickValues = values;
        } else {
            var ticks = Math.ceil((max_val - min_val) / step + 1);
            while (ticks > max_tick_num) {
                step = step*2;
                ticks = Math.ceil((max_val - min_val) / step + 1);
            }
            var tickValues = [min_val];
            for (var i = 1; i < ticks - 1; i++) {
                tickValues.push(min_val + i*step);
            }
            if (tickValues[ticks - 2] + step > max_val) {
                tickValues.pop();
            }
            tickValues.push(max_val);
        }

        var tick_format = function (val) {
            return Number(val).toFixed((String(step) + '.').split('.')[1].length);
        }

        var axis = d3.scaleLinear()
                .domain([min_val, max_val])
                .range(pixel_range);
        var axisGenerator = (type == 'x') ? d3.axisBottom(axis) : d3.axisLeft(axis);
        axisGenerator.tickValues(tickValues);
        axisGenerator.tickFormat(tick_format);
  
        svg.append("g")
            .attr("class", 'axis')
            .attr("transform", transformation)
            .call(axisGenerator);
        return axis;
    }

    var x_vals = null, 
        y_vals = null;
   
    if (!x_name && !y_name) {
        // x and y columns not chosen -> renders a simple array layout of items
        var svg = area;
        svg.attr("width", width)
            .attr("height", height)
            .style('margin-top', axis_margin_h)
            .style('margin-bottom', axis_margin_h)
            .style('margin-left', axis_margin_w)
            .style('margin-right', axis_margin_w)
            .style('overflow-y', 'scroll');
        var ordered = false;
    } else {
        // at least one of x and y columns chosen -> renders a chart in xy-coordinates
        var svg = area.style('overflow-y', 'hidden')
            .append("svg")
            .attr("id", "chartLayer")
            .attr("width",  width)
            .attr("height", height)
            .append("g");
        var ordered = true;  
    }
    if (x_name) {
        var x_range = !y_name ? [30, width - 30] : [2*axis_margin_w, width - axis_margin_w];
        var x = setupAxis(svg, 'x', x_name, fil.x_limits, x_range, `translate(0, ${height - axis_margin_h})`);
    }
    if (y_name) {
        var y_range = !x_name ? [height - 30, 30] : [height - 2*axis_margin_h, axis_margin_h];
        var y = setupAxis(svg, 'y', y_name, fil.y_limits, y_range, `translate(${axis_margin_w}, 0)`);
    }
    if (!!x_name & !y_name) {
        var [y_vals, max_val] = beeswarmAxis(data, x_name);
        console.log(y_vals);
        var y = d3.scaleLinear()
            .domain([0, max_val + 1])
            .range([height - 2*axis_margin_h, axis_margin_h]);
    }
    if (!!y_name & !x_name) {
        var [x_vals, max_val] = beeswarmAxis(data, y_name);
        var x = d3.scaleLinear()
                .domain([0, max_val + 1])
                .range([2*axis_margin_w, width - axis_margin_w]);
    }

    var size_scaler = sizeScaler(data, !!size_name);
    if (!!size_name) {
        // size column chosen -> items are sorted by size
        data = sort_by_key(data, size_name);
    }

    var thumbnails = svg.append('g').attr('id', 'thumbnail-layer');

    if (type == 'init' && !!color_name && target.id != 'menuOverlay') {
        // color-coding categorical values from the 'color' column - only on the first render
        color_map = new Map();
        var categories =  [...new Set(data.map(d => d[color_name]))];
        for (var i = 0; i < categories.length; i++) {
            color_map.set(categories[i], msg.color_list[i]);
        }
    }

    // sets up limit rules for determining overlay groups (too high/wide beeswarm or same (x,y) values)
    var limit_type = null;
    if (!!x_name || !!y_name) {
        var limit = !!x_vals ? width : !!y_vals ? height : null;
        var translation = !!x_vals ? y : !!y_vals ? x : null;
        limit_type = !!x_vals ? 'x' : !!y_vals ? 'y' : 'both';
        var vals_arr = !!x_vals ? data.map(d => d[y_name]) : !!y_vals ? data.map(d => d[x_name]) : null;
        var vals_map = new Map(),
            ids_map = new Map(),
            pos_map = new Map();
        if (!!vals_arr) {
            vals_arr.forEach(v => {
                vals_map.set(v, 0);
                ids_map.set(v, []);
            })
        }
    }

    // adds thumbnail images (or overlay groups) to the chart area
    for (var i = 0; i < data.length; i++) {
        var [thumb_width, thumb_height] = await addThumbnail(
            ordered, data[i], thumbnails, 
            thumbnail_area, thumbnail_border_width, 
            size_scaler, x, y, color_map,
            !x_vals ? null : x_vals[i], !y_vals ? null : y_vals[i]);
        if (limit_type == 'both') {
            var pos_key = x(data[i][x_name]) + ' ' + y(data[i][y_name]);
            var pos_id_arr = pos_map.has(pos_key) ? pos_map.get(pos_key) : [];
            pos_id_arr.push(data[i][id_name]);
            pos_map.set(pos_key, pos_id_arr);
        } else if (!!limit_type) {
            var new_len = limit_type == 'x' ? thumb_width : thumb_height;
            vals_map.set(vals_arr[i], new_len + vals_map.get(vals_arr[i]));
            var vals_id_arr = ids_map.get(vals_arr[i]);
            vals_id_arr.push(data[i][id_name]);
            ids_map.set(vals_arr[i], vals_id_arr);
        }
    }

    if (!!x_name || !!y_name) {
        over.removeOverlays(limit_type, limit, translation, vals_map, ids_map, pos_map, data, id_name,
            thumbnail_area, thumbnail_border_width, size_scaler, color_map);
    } else {
        d3.selectAll(".thumb-group").transition().duration(500).style("opacity", 1);
    }

    // sets up filters on the initial render or updates color filter on rerender
    if (type == 'init') {
        fil.enableFilters(data, x_name, y_name, size_name, color_name, color_map);
        if (target.id == 'menuOverlay') {
            fil.updateColorAvailability(raw_data.filter(applyFilters, true), color_name);
        }
    } else {
        fil.updateColorAvailability(raw_data.filter(applyFilters, true), color_name);
    }

    // adds a blurry border to the chart area to hide thumbnail overflows
    if (d3.select('#blurLayer').empty() && (!!x_name || !!y_name)) {
        var init_blur = area.append('svg')
            .attr("id", "blurLayer")
            .attr("width",  width)
            .attr("height", height);
        var shadow = init_blur.style("box-shadow");
        init_blur.style("box-shadow", !!x_vals || !!y_vals ? shadow.replace("-8px 0px 6px 0px", "0px 0px 6px 6px") : shadow.replace("0px 0px 6px 6px", "-8px 0px 6px 0px"));
    } else if (!x_name && !y_name) {
        d3.select('#blurLayer').remove();
    }
}


/* Create a bordered clickable thumbnail of a document to the chart area. Returns the thumbnail dimensions */
export async function addThumbnail(ordered, entry, thumbnails, 
    thumbnail_area, thumbnail_border_width, 
    size_scaler, x, y, color_map, x_val, y_val) {
    var url = await imgrs.returnImageURL(entry[id_name]);
    var dimensions = await imgrs.returnImageSize(url);
    var init_area = dimensions.width * dimensions.height;
    var thumbnail_scale_coef = (thumbnail_area / init_area) ** 0.5;
    var width = dimensions.width * thumbnail_scale_coef * size_scaler(entry[size_name]);
    var height = dimensions.height * thumbnail_scale_coef * size_scaler(entry[size_name]);
    var color = color_name ? color_map.get(entry[color_name]) : "transparent";
    var thumb_group = thumbnails.append('g')
        .attr('class', 'thumb-group')
        .attr('id', entry[id_name])
        .style("opacity", 0)
        .on('click', arr.openBottom);
    
    if (ordered) {
        // xy-coordinates
        var x_pos = x_val ? x(x_val) - width / 2 : x(entry[x_name]) - width / 2,
            y_pos = y_val ? y(y_val) - height / 2 : y(entry[y_name]) - height / 2;
        thumb_group.append('image')
            .attr('class', 'thumbnail')
            .attr("xlink:href", url)
            .attr("x", x_pos)
            .attr("y", y_pos)
            .attr('width', width)
            .attr('height', height);
        thumb_group.append('rect')
            .attr('class', 'thumbnail-border')
            .attr("x", x_pos)
            .attr("y", y_pos)
            .attr('width', width)
            .attr('height', height)
            .style('stroke-width', thumbnail_border_width + 'px')
            .style('stroke', color);
    } else {
        // array layout
        var img_container = thumb_group.append('div')
            .attr('class', 'thumbnail-img-container')
            .attr('id', entry[id_name])
            .style('width', width + 4*thumbnail_border_width + 'px')
            .style('height', height + 4*thumbnail_border_width + 'px')
            .style('margin', 2*thumbnail_border_width + 'px');
        img_container.append('img')
            .attr('class', 'thumbnail-img')
            .attr("src", url)
            .attr('width', width)
            .attr('height', height)
            .style('margin', thumbnail_border_width + 'px')
            .style('border', `${thumbnail_border_width}px solid ${color}`);
        img_container.append('div')
            .attr('class', 'thumbnail-img-mask')
            .style('width', width + 'px')
            .style('height', height + 'px')
            .style('top',2*thumbnail_border_width + 'px')
            .style('left', 2*thumbnail_border_width + 'px');
    }

    return [width, height];
}


/* Create a transformation function for the size column */
function sizeScaler(data, enabled=false) {
    if (enabled) {
        return d3.scaleLinear()
        .domain(d3.extent(data, (d) => d[size_name]))
        .range([0.5, 1.5]);
    }
    return function(x) { return 1; }
}


/* Create a beeswarm-type ordering of items in case only x or y column is chosen. Returns new values for the not chosen axis + the max value */
function beeswarmAxis(data, x_name) {
    var x_vals = data.map((d) => d[x_name]);
    var y_vals = [];
    var xy_val_map = new Map();
    var max_val = 1;
    for (const x_val of x_vals) {
        if (xy_val_map.has(x_val))
        {
            var prev_y = xy_val_map.get(x_val);
            y_vals.push(prev_y + 1);
            xy_val_map.set(x_val, prev_y + 1);
            max_val = prev_y + 1 > max_val ? prev_y + 1 : max_val;
        } else {
            y_vals.push(1);
            xy_val_map.set(x_val, 1);
        }
    }
    for (var i = 0; i < x_vals.length; i++) {
        var max_val_for_this_x = xy_val_map.get(x_vals[i]);
        y_vals[i] = y_vals[i] * max_val / max_val_for_this_x; 
    }
    return [y_vals, max_val];
}


/* Sort an array of JSONs by a key name */
function sort_by_key(array, key) {
    return array.sort(function(a, b) {
        var a_k = a[key]; var b_k = b[key];
        return ((a_k < b_k) ? -1 : ((a_k > b_k) ? 1 : 0));
    });
}