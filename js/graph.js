function run() {
    let root = document.querySelector('.graph-bd')
    let dataset = [
        { key: 0, value: 5 },		//dataset is now an array of objects.
        { key: 1, value: 10 },		//Each object has a 'key' and a 'value'.
        { key: 2, value: 13 },
        { key: 3, value: 19 },
        { key: 4, value: 21 },
        { key: 5, value: 25 },
        { key: 6, value: 22 },
        { key: 7, value: 18 },
        { key: 8, value: 15 },
        { key: 9, value: 13 },
        { key: 10, value: 11 },
        { key: 11, value: 12 },
        { key: 12, value: 15 },
        { key: 13, value: 20 },
        { key: 14, value: 18 },
        { key: 15, value: 17 },
        { key: 16, value: 16 },
        { key: 17, value: 18 },
        { key: 18, value: 23 },
        { key: 19, value: 25 } 
    ];
    draw_bars(root, dataset)
    let addButton = document.querySelector('.tool.add')
    let removeButton = document.querySelector('.tool.remove')
    addButton.addEventListener('click', function(e) {
        var newNumber = Math.floor(Math.random() * 23) + 2
        dataset.push({
            key: dataset[dataset.length - 1].key + 1,
            value: newNumber
        })
        redraw_bars(root, dataset)
    })
    removeButton.addEventListener('click', function(e) {
        dataset.shift()
        redraw_bars(root, dataset)
    })
}
window.addEventListener('load', run)


function draw_bars(root, dataset) {
    // 在root中添加svg
    var w = root.offsetWidth, h = root.offsetHeight, padding = 20;
    var svg = d3.select(root)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // 在svg中画图即可 ----------------------------------------------------------------

    var key = function(d) {
        return d.key;
    };
    // Scale
    var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length))
                    .rangeRound([padding, w - padding])
                    .paddingInner(0.05);
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d) { return d.value; })])
                    .range([0, h - padding]);
    // rects
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
                return h - yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return yScale(d.value);
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (d.value * 10) + ")";
        });
    // labels
    svg.selectAll("text")
        .data(dataset, key)
        .enter()
        .append("text")
        .text(function(d) {
            return d.value;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return h - yScale(d.value) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
}

function redraw_bars(root, dataset) {
    // 获得原来的svg
    var svg = d3.select("svg");

    // 需要重新定义之前的局部变量
    var w = root.offsetWidth, h = root.offsetHeight, padding = 20;
    var key = function(d) {
        return d.key;
    };
    // 定义好后重新画图即可 ----------------------------------------------------------------
    
    // Scale
    var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length))
                    .rangeRound([padding, w - padding])
                    .paddingInner(0.05);
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d) { return d.value; })])
                    .range([0, h - padding]);
    // Update scale domains
    xScale.domain(d3.range(dataset.length));
    yScale.domain([0, d3.max(dataset, function(d) { return d.value; })]);
    // Update bars
    var bars = svg.selectAll("rect")
        .data(dataset, key);
    bars.enter()
        .append("rect")
        .attr("x", w)
        .attr("y", function(d) {
            return h - yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return yScale(d.value);
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (d.value * 10) + ")";
        })
        .merge(bars)	//Update…
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return h - yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return yScale(d.value);
        })
    //Exit…
    bars.exit()
        .transition()
        .duration(500)
        .attr("x", -xScale.bandwidth())
        .remove();
    // Update labels
    var labels = svg.selectAll("text")
    .data(dataset, key);
    //Enter…
    labels.enter()
        .append("text")
        .text(function(d) {
            return d.value;
        })
        .attr("text-anchor", "middle")
        .attr("x", w)
        .attr("y", function(d) {
            return h - yScale(d.value) + 14;
        })						
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .merge(labels)	//Update…
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 2;
        });
    //Exit…
    labels.exit()
        .transition()
        .duration(500)
        .attr("x", -xScale.bandwidth())
        .remove();
}