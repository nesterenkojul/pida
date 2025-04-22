import * as ren from "./renderer.js";
import * as chr from "./choosers.js";
import * as imvw from "./imageViewer.js";
import * as fil from "./filters.js";
import * as msg from "./messages.js";


export function enableArrows() {
    // render the arrow button image + connect it with an on-click function
    fetch('./arrr.txt')
        .then(response => response.text())
        .then(text => d3.selectAll('.arrowBtn').select('svg').html(text));

    var btnLeft = document.getElementById('choiceBtn');
    btnLeft.addEventListener('click', openLeft);

    var btnRight = document.getElementById('renderBtn');
    btnRight.addEventListener('click', openRight);

    var btnBottom = document.getElementById('viewerBtn');
    btnBottom.addEventListener('click', openBottom);

    var btnOverlay = document.getElementById('overlayBtn');
    btnOverlay.addEventListener('click', openOverlay);
}


function openLeft(event) {
    d3.select("#chartArea").style("opacity", 0);
    d3.select("#filterBlock").html("");
    fil.nullifyFilters();
    var content = d3.select("#menuLeft").select('.menuContent');
    content.style("opacity", 0);
    var arrow = d3.select(event.target).select('svg');
    var otherArrow = d3.select('#renderBtn').select('svg');
    var bottomArrow = d3.select('#viewerBtn').select('svg');
    var overlayArrow = d3.select('#overlayBtn').select('svg');
    
    // open the left menu
    if (arrow.attr('class') == 'arrowOpen') {
        d3.select("#menuLeft").style('transition', 'none');
        // if the viewer bottom menu is opened – close it
        if (bottomArrow.attr('class') == 'arrowClose') {
            d3.select("#menuBottom").style("opacity", 0);
            bottomArrow.attr('class', 'arrowOpen');
        }
        // if the overlay expansion bottom menu is opened – close it
        if (overlayArrow.attr('class') == 'arrowClose') {
            var overlay_menu = d3.select("#menuOverlay");
            overlay_menu.style("opacity", 0);
            overlay_menu.select('.menuContent').attr("id", null).html("");
            overlay_menu.select("#filterBlock").attr("id", "filterBlockOverlay").html("");
            d3.select("#chartAreaDisabled").attr("id", "chartArea").html("");
            d3.select("#filterBlockDisabled").attr("id", "filterBlock").html("");
            overlayArrow.attr('class', 'arrowOpen');
        }
        // if the right menu is opened – close it
        if (otherArrow.attr('class') == 'arrowClose') {
            otherArrow.attr('class', 'arrowOpen');
        }
        arrow.attr('class', 'arrowClose');
    } else { // close the left menu
        d3.select("#menuLeft").style('transition', '0.5s');
        arrow.attr('class', 'arrowOpen');
        // if no data chosen – render warning message
        if (d3.selectAll('.cancelBtn').size() != 2) {
            d3.select("#chartArea").html(msg.no_data);
            d3.select("#chartArea").transition().duration(1000).style("opacity", 1);
        } else {
            // if data chosen – render choice lists of column names and automatically open the right menu
            var choice_msg = d3.select("#fieldChoice").select('#noDataMsg');
            if (!choice_msg.empty()) {
                choice_msg.remove();
            }
            chr.setFieldOptions();
            var rightContent = d3.select("#menuRight").select('.menuContent');
            rightContent.style("opacity", 0);
            otherArrow.attr('class', 'arrowClose');  
            rightContent.transition().duration(1000).style("opacity", 1);
        }
    } 

    ren.screenAdapt(event, 'rerender');
    content.transition().duration(1000).style("opacity", 1);
}


function openRight(event) {
    d3.select("#chartArea").style("opacity", 0);
    d3.select("#filterBlock").html("");
    fil.nullifyFilters();
    var content = d3.select("#menuRight").select('.menuContent');
    content.style("opacity", 0);
    var arrow = d3.select(event.target).select('svg');
    var otherArrow = d3.select('#choiceBtn').select('svg');
    var bottomArrow = d3.select('#viewerBtn').select('svg');
    var overlayArrow = d3.select('#overlayBtn').select('svg');
    var choice_msg = d3.select("#fieldChoice").select('#noDataMsg');
    if (!choice_msg.empty()) {
        choice_msg.remove();
    }

    // open the right menu
    if (arrow.attr('class') == 'arrowOpen') {
        d3.select("#menuRight").style('transition', 'none');
        // if the viewer bottom menu is opened – close it
        if (bottomArrow.attr('class') == 'arrowClose') {
            d3.select("#menuBottom").style("opacity", 0);
            bottomArrow.attr('class', 'arrowOpen');
        }
        // if the overlay expansion bottom menu is opened – close it
        if (overlayArrow.attr('class') == 'arrowClose') {
            var overlay_menu = d3.select("#menuOverlay");
            overlay_menu.style("opacity", 0);
            overlay_menu.select('.menuContent').attr("id", null).html("");
            overlay_menu.select("#filterBlock").attr("id", "filterBlockOverlay").html("");
            d3.select("#chartAreaDisabled").attr("id", "chartArea").html("");
            d3.select("#filterBlockDisabled").attr("id", "filterBlock").html("");
            overlayArrow.attr('class', 'arrowOpen');
        }
        // if the left menu is opened – close it
        if (otherArrow.attr('class') == 'arrowClose') {
            otherArrow.attr('class', 'arrowOpen'); 
        }
        // if no data chosen – render warning message
        if (d3.selectAll('.cancelBtn').size() != 2) {
            d3.select("#chartArea")
                .html(msg.no_data);
            d3.select("#fieldChoice")
                .append('div')
                .attr('id', 'noDataMsg')
                .html(msg.field_choice_unavailable); 
        } else if (d3.selectAll('.fieldChoice-available').empty() && d3.selectAll('.fieldChoice-unavailable').empty()) {
            // if data chosen – render choice lists of column names
            chr.setFieldOptions();
        }
        arrow.attr('class', 'arrowClose');
        content.transition().duration(1000).style("opacity", 1);
    } else { // close the right menu
        d3.select("#menuRight").style('transition', '0.5s');
        arrow.attr('class', 'arrowOpen');
        // if no data chosen – render warning message
        if (d3.selectAll('.cancelBtn').size() != 2) {
            d3.select("#chartArea").html(msg.no_data);
            otherArrow.attr('class', 'arrowClose');         
        } else if (d3.select('#choiceId').select('.fieldChoice-active').empty()) {
            // if data chosen and columns not chosen – render warning message
            d3.select("#chartArea").html(msg.yes_data);
        } else {
            // if data chosen and columns chosen – render the chart
            ren.render(event.target, 'init');
        }
        d3.select("#chartArea").style("opacity", 1);
        d3.select("#filterBlock").style("opacity", 1);
    } 

    ren.screenAdapt(event, 'rerender');
}


export async function openBottom(event) {
    var content = d3.select("#menuBottom").style("opacity", 1).select('.menuContent');
    content.style("opacity", 0);
    var arrow = d3.select("#viewerBtn").select('svg');
    
    // open the viewer bottom menu
    if (arrow.attr('class') == 'arrowOpen') {
        await imvw.enableViewer(event.target.parentNode);
        d3.select("#chartArea").transition().duration(500).style("opacity", 0);
        d3.select("#filterBlock").transition().duration(500).style("opacity", 0);
        arrow.attr('class', 'arrowClose');
        content.style("opacity", 1);
    } else {
        // close the viewer bottom menu
        arrow.attr('class', 'arrowOpen');
        content.select("#viewer").html("");
        content.select("#info").html("");
        ren.render(event.target, 'rerender');
    } 
    ren.screenAdapt(event, 'rerender');
    // after the viewer is closed - show the overlay expansion menu (in case it has been open before)
    if (arrow.attr('class') == 'arrowOpen') {
        d3.select("#menuOverlay").style("opacity", 0);
        d3.select("#menuOverlay").transition().duration(1500).style("opacity", 1);
    }
}


export async function openOverlay(target) {
    var menu = d3.select("#menuOverlay").style("opacity", 1);
    d3.select("#chartArea").transition().duration(500).style("opacity", 0);
    d3.select("#filterBlock").transition().duration(500).style("opacity", 0);
    var content = menu.select('.menuContent');
    content.style("opacity", 0);
    var arrow = d3.select("#overlayBtn").select('svg');

    // open the overlay expansion bottom menu
    if (arrow.attr('class') == 'arrowOpen') {
        // set new chart area and filter block inside the menu (main ones are hidden)
        d3.select("#chartArea").attr("id", "chartAreaDisabled");
        d3.select("#filterBlock").attr("id", "filterBlockDisabled");
        content.attr("id", "chartArea");
        menu.select("#filterBlockOverlay").attr("id", "filterBlock");
        ren.render(menu.node(), 'init');
        arrow.attr('class', 'arrowClose');
    } else {
        // close the overlay expansion bottom menu
        // clear contents of the menu and return all elements to their state prior to opening the menu
        arrow.attr('class', 'arrowOpen');
        content.attr("id", null).html("");
        menu.select("#filterBlock").attr("id", "filterBlockOverlay").html("");
        d3.select("#chartAreaDisabled").attr("id", "chartArea");
        d3.select("#filterBlockDisabled").attr("id", "filterBlock");
        d3.select('.overlay-group-active').attr('class', 'overlay-group');
        fil.returnMainFilters();
        ren.render(target, 'rerender');
    } 
    
    ren.screenAdapt(this, 'rerender');
}