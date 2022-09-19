

//window.alert("Hello world!");
var topMargin = 15, rightMargin = 15, bottomMargin = 35, leftMargin = 15, setWidth = 230, setHeight = 185;
var dataSet;
export function FileSaveAs(filename, fileContentsss) {

    var ss = JSON.parse(fileContentsss);
    var column = Object.keys(ss[0]);
    var fileContent = "";
    $.each(column, function (i, v) {
        var ii = i;
        var vv = v;
        fileContent = fileContent + v;

        if (i != column.length - 1) {
            fileContent = fileContent + ",";
        }
    });
    fileContent = fileContent + "\n";
    var index = 0;
    $.each(ss, function (i, v) {
        $.each(column, function (ii, vv) {
            fileContent = fileContent + v[vv];
            index += 1;
            if (index != column.length) {
                fileContent = fileContent + ",";
            }

        })
        index = 0;
        fileContent = fileContent + "\n";
    });
    var link = document.createElement('a');
    link.download = filename;
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(fileContent)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
export function getdata(id, allData, offset, MaxDataOff) {

    dataSet = allData;
    quadrant(id, dataSet, offset, MaxDataOff);
}
export function quadrant(id, allData, offset, MaxDataOff) {
    var startTime = performance.now();
    try {
        setWidth = $("#Quadrant").width();
        setHeight = $("#Quadrant").height();
        $("#quadrantSVG").remove();
        // set the dimensions and margins of the graph
        var margin = { top: topMargin, right: rightMargin, bottom: bottomMargin, left: (leftMargin) },
            width = setWidth - margin.left - margin.right,
            height = setHeight - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(id)
            .append("svg").attr("id", "quadrantSVG")/*.on("click", quadrant_CallModal)*/
            .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom) + " ")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        if (allData == false) {
            svg.append("text")
                .attr("x", 210 / 2)
                .attr("y", 200 / 2)
                .text("NO DATA")
                .attr("fill", "#ffff")
                .style("text-anchor", "middle")
                .style("font-family", "sans-serif")
                .style("font-weight", "bold")
                .style("font-size", "15px");
        }
        else {
            var datas = JSON.parse(allData);
            var dataUcl_lcl = JSON.parse(offset);
            var offerX_ucl = dataUcl_lcl["x_ucl"] /*offset[0]["offerX_ucl"]*/;
            var offerX_lcl = dataUcl_lcl["x_lcl"]  /*offset[0]["offerX_lcl"]*/;
            var offerY_ucl = dataUcl_lcl["y_ucl"]  /*offset[0]["offerY_ucl"]*/;
            var offerY_lcl = dataUcl_lcl["y_lcl"]/*offset[0]["offerY_lcl"]*/;
            var Maxoffset_map = datas.map(i => i["x_offer"] > i["y_offer"] ? i["x_offer"] : i["y_offer"]);
            var Maxoffset = Math.max(...Maxoffset_map);
            //-->let setArray = Object.values(offset[0]);
            //-->const maxUcl_lcl = Math.max(...setArray);
            //-->const maxCompare = maxUcl_lcl > MaxDataOff ? maxUcl_lcl : MaxDataOff;
            const maxUcl_lcl = 0.200
            const maxCompare = maxUcl_lcl > Maxoffset ? maxUcl_lcl : Maxoffset;
            //offerY_ucl = 0.05;
            //offerX_ucl = 0.03;
            var count = 0;
            //console.log(datas.count());

            datas.filter(function (d) {
                if (d.y_offer >= offerY_ucl) { count += 1; }

                else if (d.y_offer <= offerY_lcl) {
                    count += 1;
                }
                else if (d.x_offer >= offerX_ucl) {
                    count += 1;
                }
                else if (d.x_offer <= offerX_lcl) {
                    count += 1;
                }
                else { }
            });




            // X axis
            var x = d3.scaleLinear()
                .domain([-maxCompare - 0.2, maxCompare + 0.2])
                .range([0, width]);

            var xAxis = svg.append("g").raise()
                .attr("transform", "translate(0," + ((height) / 2) + ")")
                .attr("id", "xAxis")
                .call(d3.axisBottom(x).ticks(5));

            // Y axis
            var y = d3.scaleLinear()
                .domain([-maxCompare - 0.2, maxCompare + 0.2])
                .range([height, 0]);

            var yAxis = svg.append("g").raise()
                .attr("transform", "translate(" + (width / 2) + ",0)")
                .attr("id", "yAxis")
                .call(d3.axisLeft(y).ticks(5));

            // Add dots
            svg.append('g').lower()
                .selectAll("circle")
                .data(datas)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.x_offer); })
                .attr("cy", function (d) { return y(d.y_offer); })
                .attr("r", 3)
                .style("fill", function (d) {
                    if (d.y_offer > offerY_ucl) { return "red"; }
                    else if (d.y_offer < offerY_lcl) {
                        return "red";
                    }
                    else if (d.x_offer > offerX_ucl) {
                        return "red";
                    }
                    else if (d.x_offer < offerX_lcl) {
                        return "red";
                    }
                    else { return "#82ACFF"; }
                });
            svg.append("line").lower().attr("id", "Xucl")
                .attr("x1", x(offerX_ucl))
                .attr("x2", x(offerX_ucl))
                .attr("y1", y(offerY_ucl))
                .attr("y2", y(offerY_lcl))
                .attr("stroke", "red")//rgb(199, 110, 110)
                .attr("stroke-width", "1px")
            svg.append("line").lower().attr("id", "Xlcl")
                .attr("x1", x(offerX_lcl))
                .attr("x2", x(offerX_lcl))
                .attr("y1", y(offerY_ucl))
                .attr("y2", y(offerY_lcl))
                .attr("stroke", "red")
                .attr("stroke-width", "1px")
            svg.append("line").lower().attr("id", "Yucl")
                .attr("x1", x(offerX_lcl))
                .attr("x2", x(offerX_ucl))
                .attr("y1", y(offerY_ucl))
                .attr("y2", y(offerY_ucl))
                .attr("stroke", "red")
                .attr("stroke-width", "1px")
            svg.append("line").lower().attr("id", "Ylcl")
                .attr("x1", x(offerX_lcl))
                .attr("x2", x(offerX_ucl))
                .attr("y1", y(offerY_lcl))
                .attr("y2", y(offerY_lcl))
                .attr("stroke", "red")
                .attr("stroke-width", "1px")


            var statusText = "OK";
            var statusColor = "rgb(119, 199, 110)";
            if (count != 0) { statusText = count + " NG"; statusColor = "#c76e6e"; }
            $("#divStatusXY").remove();
            var statusDiv = d3.select("#Quadrant").append("div").attr("id", "divStatusXY").style("position", "absolute").style("bottom", "5px").style("right", "5px")
            statusDiv.html
                (`
              <svg   xmlns="http://www.w3.org/2000/svg" width="130" height="30" viewBox="0 0 100 30 ">
                <g id="statusPass" transform="translate(0,0)">
                    <rect x="0" y="10" height="20" width="110" fill="${statusColor}" rx="6" stroke="none" style="stroke-width: 0.8;"></rect>
                    <rect x="0" y="10" height="20" width="55" fill="#ddd" rx="6" stroke="none" style="stroke-width: 0.8;"></rect>
                    <text x="13" y="23" fill="black" style="font-family: sans-serif; font-weight: bold; font-size: 10px;">Judge</text>
                    <text x="66" y="23" fill="black" style="font-family: sans-serif; font-weight: bold; font-size: 10px;">${statusText}</text></g>
              </svg>
            `)
            //var status = svg.append("g").attr("id", "statusQ").attr("transform",
            //    "translate(" + (width - 105) + "," + (height - 10) + ")");;
            //status.append("rect")
            //    .attr("x", 0)
            //    .attr("y", 10)
            //    .attr("height", 20)
            //    .attr("width", 55 * 2)
            //    .attr("fill", statusColor)
            //    .attr("rx", 6)
            //    .attr("stroke", "none")
            //    .style("stroke-width", "0.8");
            //status.append("rect")
            //    .attr("x", 0)
            //    .attr("y", 10)
            //    .attr("height", 20)
            //    .attr("width", 55)
            //    .attr("fill", "#ddd")
            //    .attr("rx", 6)
            //    .attr("stroke", "none")
            //    .style("stroke-width", "0.8");
            //status.append("text")
            //    .attr("x", 13)
            //    .attr("y", 23)
            //    .text("Judge")
            //    .attr("fill", "black")
            //    .style("font-family", "sans-serif")
            //    .style("font-weight", "bold")
            //    .style("font-size", "10px");
            //status.append("text")
            //    .attr("x", 33 * 2)
            //    .attr("y", 23)
            //    .text(statusText)
            //    .attr("fill", "black")
            //    .style("font-family", "sans-serif")
            //    .style("font-weight", "bold")
            //    .style("font-size", "10px");

        }
        //var button = svg.append("foreignObject").attr("x", 0).attr("y", 0).attr("width", 210).attr("height", 200).append("xhtml:div").attr("id", "innerDiv")
        //    .attr("class", "d-flex justify-content-end").style("cursor", "pointer").attr("id", "button")
        //button.append("a").attr("class", "btn btn-primary btn-sm fw-bold").attr("id", "buttonGui11").text("").on("click", reset);
    }
    catch (e) {
        console.log(e)
    }
    var endTime = performance.now();
    console.log(`XY POINT ${(endTime - startTime) / 1000} seconds`);
    $("#load").css("display", "none");
}
export function quadrant_CallModal() {
    $('#gui1Chart_modal').remove();
    $('#TooltipGui11').remove();
    $('#buttonGui11').remove();
    var myModal = new bootstrap.Modal(document.getElementById("myModal"), {});
    quadrantSet_modal("#gui11", dataSet);
    myModal.show();
}
export function quadrantSet_modal(id, allData) {
    var datas = JSON.parse(allData);
    var mapheight = d3.map(datas, function (d) { return d.solder_volume }).keys();

    // set the dimensions and margins of the graph
    var margin = { top: topMargin, right: rightMargin, bottom: bottomMargin, left: (leftMargin - 35) },
        width = setWidth - margin.left - margin.right,
        height = setHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg").attr("id", "gui1Chart_modal")
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", "0 0 " + ((width) + margin.left + margin.right) + " " + (height + margin.top + margin.bottom) + " ")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleLinear()
        .domain([-0.3, 0.3])
        .range([0, width]);

    var xAxis = svg.append("g").raise()
        .style("font-size", "5px")
        .style("stroke-width", 0.5)
        .attr("transform", "translate(0," + (height / 2) + ")")
        .call(d3.axisBottom(x));

    // Y axis
    var y = d3.scaleLinear()
        .domain([-0.3, 0.3])
        .range([height, 0]);

    var yAxis = svg.append("g").raise()
        .style("font-size", "5px")
        .style("stroke-width", 0.5)
        .attr("transform", "translate(" + (width / 2) + ",0)")
        .call(d3.axisLeft(y));


    // Create the scatter variable: where both the circles and the brush take place
    var scatter = svg.append('g').lower()
        .attr("clip-path", "url(#clip)")
    // create a tooltip
    var Tooltip = d3.select(id)
        .append("div")
        .attr("id", "TooltipGui11")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        Tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        Tooltip
            .html(
                "<svg width='130px' height='40px'>" +
                "<text fill='#000' x='10' dy='1em' style='font-weight:bold'>X offset :</text>" +
                "<text fill='#000' x='85' dy='1em'>" + d.x_offset + "</text>" +
                "<text fill='#000' x='10' dy='2.5em' style='font-weight:bold'>Y offset :</text>" +
                "<text fill='#000' x='85' dy='2.5em'>" + d.y_offset + "</text>" +
                "</svg>")
            .style("left", (d3.mouse(this)[0] + 70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function (d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }
    // Add dots
    scatter
        .selectAll("circle")
        .data(datas)
        /*.enter()*/
        .join("circle")
        .attr("cx", function (d) { return x(d.x_offset); })
        .attr("cy", function (d) { return y(d.y_offset); })
        .attr("r", 2)
        .style("fill", "rgb(105 179 162 / 62%)")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);
    svg.call(zoom);

    var button = d3.select(id).append("div").attr("class", "d-flex justify-content-end").style("cursor", "pointer").attr("id", "button")
    button.append("a").attr("class", "btn btn-primary btn-sm fw-bold").attr("id", "buttonGui11").text("reset").on("click", reset);

    function updateChart() {
        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);
        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))
        scatter
            .selectAll("circle")
            .attr("cx", function (d) { return newX(d.x_offset); })
            .attr("cy", function (d) { return newY(d.y_offset); });
    }
    function reset() {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    }
}

export function load(display) {
    $("#loadBg").css("display", display);
    $("#load").css("display", display);
}

