var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//$(function () {
//    alert("Your screen resolution is: " + widthssss + "x", heightssss);
//}

var svg;
var g, x, y;
var xAxis, yAxis;
var Datajson;
var Dataset;
var offerX_ucl, offerX_lcl, offerY_ucl, offerY_lcl, Xmin, Ymax;
var boxwidth, boxHeight = 0, filter;

export function setoffset(offset) {
    try {
        var set_offset = JSON.parse(offset)
        offerX_ucl = set_offset["x_ucl"];
        offerX_lcl = set_offset["x_lcl"];
        offerY_ucl = set_offset["y_ucl"];
        offerY_lcl = set_offset["y_lcl"];
        Xmin = set_offset["x_min"];
        Ymax = set_offset["y_max"];

    }
    catch (e) {
        console.log(e)
    }

}
function destoy() {
    $("#XYOFFSETSVG").remove();
    $("#OverSpecXY p").remove();
    $("#OverSpecXY div").remove();
    $("#showselete-XYOFFSET p").remove();
    $("#showselete-XYOFFSET div").remove();
}

export function setchart(/*Xmin, Xmax, Ymax, Ymin, */json) {
    try {

        var startTime = performance.now();
        destoy();
        var array = [Xmin, Ymax, offerX_ucl, offerY_ucl];
        const maxCompare = Math.max(...array);
        boxwidth = 600 /*box.offsetWidth*/;
        boxHeight = ($("#divModal").height()) ;

        Datajson = JSON.parse(json);
        filter = Datajson.filter(function (d) {
            if (d.y_offset >= offerY_ucl) { return d }
            else if (d.y_offset <= offerY_lcl) { return d }
            else if (d.x_offset >= offerX_ucl) { return d }
            else if (d.x_offset <= offerX_lcl) { return d }
            else { }
        });
        //boxHeight -=100;
        svg = d3.select("#svg-chart-XYOFFSET")
            //.attr("width", width + margin.left + margin.right)
            //.attr("height", boxHeight -100)
            .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + ((boxHeight + margin.top - margin.bottom)) + " ")
            .append("g").attr("id", "XYOFFSETSVG")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x = d3.scaleLinear()
            .domain([-maxCompare - (maxCompare / 2), maxCompare + (maxCompare / 2)])
            .range([0, width]);

        y = d3.scaleLinear()
            .domain([-maxCompare - (maxCompare / 2), maxCompare + (maxCompare / 2)])
            .range([(boxHeight - margin.top - margin.bottom), 0]);


        yAxis = svg.append("g")
            .attr("id", "yAxis")
            .attr("transform", "translate(" + x(0) + ",0)")

            .call(d3.axisLeft(y));
        xAxis = svg.append("g")
            .attr("id","xAxis")
            .attr("transform", "translate(0," + y(0) + ")")
            /*.attr("transform", "translate(0," + (boxHeight) + ")")*/
            .call(d3.axisBottom(x));

        g = svg.append("g").lower();
        var radian = 0.5;
        radian = Datajson.length < 500 ? 2 : 1;
        g.selectAll("circle")
            .data(Datajson)
            .join("circle")
            .attr("cx", function (d) { return x(d.x_offset); })
            .attr("cy", function (d) { return y(d.y_offset); })
            .attr("r", radian)
            .style("fill", function (d) {
                if (d.y_offset >= offerY_ucl) { return "rgb(199, 110, 110)"; }
                else if (d.y_offset <= offerY_lcl) {
                    return "rgb(199, 110, 110)";
                }
                else if (d.x_offset >= offerX_ucl) {
                    return "rgb(199, 110, 110)";
                }
                else if (d.x_offset <= offerX_lcl) {
                    return "rgb(199, 110, 110)";
                }
                else { return "#82ACFF"; }
            })/*#69b3a2*/
            .on("click", mousemove)
            .append("title")
            .text((d, i) => ` X offset : ${d.x_offset} , Y offset : ${d.y_offset}`)

        d3.select('#svg-chart-XYOFFSET').call(zoom
            .extent([[0, 0], [width, height]])
            .scaleExtent([1, 20])
            .on("zoom", zoomed)).transition().duration(750);
        var lineUcl_lcl = svg.append("g").attr("id", "lineUcl_lcl");
        lineUcl_lcl.append("line").lower().attr("id", "XuclZ")
            .attr("x1", x(offerX_ucl))
            .attr("x2", x(offerX_ucl))
            .attr("y1", y(offerY_ucl))
            .attr("y2", y(offerY_lcl))
            .attr("stroke", "red")
            .attr("stroke-width", "1px")
        lineUcl_lcl.append("line").lower().attr("id", "XlclZ")
            .attr("x1", x(offerX_lcl))
            .attr("x2", x(offerX_lcl))
            .attr("y1", y(offerY_ucl))
            .attr("y2", y(offerY_lcl))
            .attr("stroke", "red")
            .attr("stroke-width", "1px")
        lineUcl_lcl.append("line").lower().attr("id", "YuclZ")
            .attr("x1", x(offerX_lcl))
            .attr("x2", x(offerX_ucl))
            .attr("y1", y(offerY_ucl))
            .attr("y2", y(offerY_ucl))
            .attr("stroke", "red")
            .attr("stroke-width", "1px")
        lineUcl_lcl.append("line").lower().attr("id", "YlclZ")
            .attr("x1", x(offerX_lcl))
            .attr("x2", x(offerX_ucl))
            .attr("y1", y(offerY_lcl))
            .attr("y2", y(offerY_lcl))
            .attr("stroke", "red")
            .attr("stroke-width", "1px")
        //$(function () {
        //    $("#subOver").accordion();
        //});
        var textHaveOver = filter.length == 0 ? "No OverSpec" : "OverSpec";
        var overSpec_Div = d3.select("#OverSpecXY");
        overSpec_Div.append("p").text(textHaveOver).attr("id", "OverSpecText").attr("class", "mb-0 p-2 fw-bold").style("width", "50vh").style("background-color", "#ddd").style("color", "black").style("border-radius", "0px 10px 0px 0px");
        let getsizeText = document.querySelector('#OverSpecText');
        var subOver = overSpec_Div.append("div").attr("id", "subOver")
            .attr("class", "shadow accordion")
            .style("background-color", "#34393d")
            .style("font-size", "0.8rem")
            .style("height", (boxHeight - margin.top - margin.bottom - getsizeText.offsetHeight) + "px")
            .style("overflow-y", "auto");
        $.each(filter, function (i, v) {
            var item = subOver.append("div").attr("class", "accordion-item").style("background-color", "rgb(52, 57, 61)").style("border", "none");
            var htmlAccord = "", id = "collapse" + i;

            //subOver.append("p").attr("class", "p-2 fw-bold mb-1 border").text("X Offset : " + v.x_offset + " | Y Offset : " + v.y_offset).style("background-color", "rgb(199, 110, 110)").style("color", "black");
            htmlAccord += `<button class="btn w-100 btn-sm collapsed fw-bold mb-1 border" style="background-color:rgb(199, 110, 110); color:black;" type="button" data-bs-toggle="collapse" data-bs-target=${"#" + id} aria-expanded="true" aria-controls=${id}>
                            ${"X Offset : " + v.x_offset + " | Y Offset : " + v.y_offset}
                       </button>`;
            $.each(v.location, function (ii, vv) {
                //subOver.append("div").append("p").text(vv.location).attr("class", "p-1")
                htmlAccord += `<div id=${id} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#subOver" style="background-color:rgb(52, 57, 61); color:white;">
                                <div class="accordion-body">
                                    <strong>${vv.location}</strong>
                                </div>
                            </div>`;
            })
            item.html(htmlAccord);
        });
        var pshow = d3.select("#showselete-XYOFFSET")
        pshow.append('p').attr("class", "mb-0 fw-bold p-2").attr("id", "headerXY_count").html("No Select")
            .style("width", "50vh").style("background-color", "#ddd").style("color", "black").style("border-radius", "0px 10px 0px 0px");
        let boxx = document.querySelector('#headerXY_count');
        var groupTooltip = pshow.append('div')
            .style("height", (boxHeight - margin.top - margin.bottom - boxx.offsetHeight) + "px")
            .style("overflow-y", "auto")
            .style("background-color", "#34393d");
        //$.each(i.location, function (index, vul) {
        //    //groupTooltip.append('p').attr("class", "mb-0 p-1 textOddEven").html(vul.location + ":" + vul.count).style("border-bottom", "1px solid");
        //});
        var endTime = performance.now();
        console.log(`(Modal)XY_POINT ${(endTime - startTime) / 1000} seconds`);

    }
    catch (e) {
        console.log(e);
    }
}

var mousemove = function (d, i) {
    $("#showselete-XYOFFSET p").remove();
    $("#showselete-XYOFFSET div").remove();
    var pshow = d3.select("#showselete-XYOFFSET")
    pshow.append('p').attr("class", "mb-0 fw-bold p-2").attr("id", "headerXY_count").html("X:" + i.x_offset + " Y:" + i.y_offset + " Count :" + i.count)
        .style("width", "50vh").style("background-color", "#ddd").style("color", "black").style("border-radius", "0px 10px 0px 0px");
    let box = document.querySelector('#headerXY_count');

    var groupTooltip = pshow.append('div')
        .style("height", (boxHeight - margin.top - margin.bottom - box.offsetHeight) + "px")
        .style("overflow-y", "auto");
    $.each(i.location, function (index, vul) {
        groupTooltip.append('p').attr("class", "mb-0 p-1 textOddEven").html(vul.location + ":" + vul.count).style("border-bottom", "1px solid");
    });




    //tooltip
    //    .html("<p>X:" + i.x_offset + " Y:" + i.y_offset + "</p>" + html)
    //    .style("left", (this.cx.animVal.value) + "px")
    //    .style("top", (this.cy.animVal.value ) + "px")
}


function zoomed({ transform }) {
    var newX = transform.rescaleX(x);
    var newY = transform.rescaleY(y);

    xAxis.call(d3.axisBottom(newX))
    yAxis.call(d3.axisLeft(newY))

    g.attr("transform", transform);
    $("#lineUcl_lcl").remove();
    var lineUcl_lcl = svg.append("g").attr("id", "lineUcl_lcl");
    lineUcl_lcl.append("line").lower().attr("id", "XuclZ")
        .attr("x1", newX(offerX_ucl))
        .attr("x2", newX(offerX_ucl))
        .attr("y1", newY(offerY_ucl))
        .attr("y2", newY(offerY_lcl))
        .attr("stroke", "red")
        .attr("stroke-width", "1px")
    lineUcl_lcl.append("line").lower().attr("id", "XlclZ")
        .attr("x1", newX(offerX_lcl))
        .attr("x2", newX(offerX_lcl))
        .attr("y1", newY(offerY_ucl))
        .attr("y2", newY(offerY_lcl))
        .attr("stroke", "red")
        .attr("stroke-width", "1px")
    lineUcl_lcl.append("line").lower().attr("id", "YuclZ")
        .attr("x1", newX(offerX_lcl))
        .attr("x2", newX(offerX_ucl))
        .attr("y1", newY(offerY_ucl))
        .attr("y2", newY(offerY_ucl))
        .attr("stroke", "red")
        .attr("stroke-width", "1px")
    lineUcl_lcl.append("line").lower().attr("id", "YlclZ")
        .attr("x1", newX(offerX_lcl))
        .attr("x2", newX(offerX_ucl))
        .attr("y1", newY(offerY_lcl))
        .attr("y2", newY(offerY_lcl))
        .attr("stroke", "red")
        .attr("stroke-width", "1px")

}

