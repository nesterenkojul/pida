import * as arr from "./arrows.js";


export function removeOverlays(limit_type, limit, translation, vals_map, ids_map, pos_map, data, id_name,
    thumbnail_area, thumbnail_border_width, size_scaler, color_map) {
    d3.selectAll(".overlay-group").remove();
    var overlay_group_count = 1;
    if (limit_type == 'both') {
        for (var [pos, ids] of pos_map) {
            if (ids.length > 1) {
                var pos_vals = pos.split(' ').map(Number);
                var group = d3.select('#thumbnail-layer').append('g')
                    .attr('class', 'overlay-group')
                    .attr('id', overlay_group_count)
                    .style("opacity", 0)
                    .on('click', function() {
                        d3.select("#chartArea").style("opacity", 0);
                        d3.select("#filterBlock").style("opacity", 0);
                        d3.select(this).attr('class', 'overlay-group-active');
                        arr.openOverlay(this, data, id_name, thumbnail_area, 
                            thumbnail_border_width, size_scaler, color_map);
                    });
                var prev_circle = d3.select('circle');
                var prev_radius = !prev_circle.empty() ? Number(prev_circle.attr('r').replace('px', '')) : -1;
                var circle = group.append('circle')
                    .attr('cx', pos_vals[0])
                    .attr('cy', pos_vals[1]);
                var text = group.append('text')
                    .text(ids.length);
                var radius = Number(text.style("width").replace('px', '')) * 1.2;
                radius = radius < prev_radius ? prev_radius : radius;
                var text_offset_y = Number(text.style("height").replace('px', '')) / 5;
                circle.attr('r', radius < 15 ? 15 : radius);
                text.attr("dx", pos_vals[0])
                    .attr("dy", pos_vals[1] + text_offset_y);
                for (var id of ids) {
                    var element = document.querySelector(`[id="${id}" ]`);
                    d3.select(element).attr('class', 'overlay_' + overlay_group_count).html("");
                }
                overlay_group_count += 1;
            }
        }
    } else {
        for (var [val, len] of vals_map) {
            if (len > limit) {
                var ids = ids_map.get(val);
                var group = d3.select('#thumbnail-layer').append('g')
                    .attr('class', 'overlay-group')
                    .attr('id', val)
                    .style("opacity", 0)
                    .on('click', function() {
                        d3.select("#chartArea").style("opacity", 0);
                        d3.select("#filterBlock").style("opacity", 0);
                        d3.select(this).attr('class', 'overlay-group-active');
                        arr.openOverlay(this, data, id_name, thumbnail_area, 
                            thumbnail_border_width, size_scaler, color_map);
                    });
                var prev_circle = d3.select('circle');
                var prev_radius = !prev_circle.empty() ? Number(prev_circle.attr('r').replace('px', '')) : -1;
                var cx = limit_type == 'x' ? limit / 2 : translation(val);
                var cy = limit_type == 'y' ? limit / 2 : translation(val);
                var circle = group.append('circle')
                    .attr('cx', cx)
                    .attr('cy', cy);
                var text = group.append('text')
                    .text(ids.length);
                var radius = Number(text.style("width").replace('px', '')) * 1.2;
                radius = radius < prev_radius ? prev_radius : radius;
                var text_offset_y = Number(text.style("height").replace('px', '')) / 5;
                circle.attr('r', radius < 15 ? 15 : radius);
                text.attr("dx", cx)
                    .attr("dy", cy + text_offset_y);
                for (var id of ids) {
                    var element = document.querySelector(`[id="${id}" ]`);
                    d3.select(element).attr('class', 'overlay_' + val).html("");
                }
            }
        }
    }
    d3.selectAll(".thumb-group").transition().duration(500).style("opacity", 1);
    d3.selectAll(".overlay-group").transition().duration(1000).style("opacity", 1);
}