function getdata(thearray,prov){
    for (i = 0; i < thearray.length; i++) { 
        if (thearray[i][0] == prov) {
            return thearray[i][1];
        }
        else{
            continue;
        }
     }
     return 0;
}
var width = 960, height = 700;
//1.定义投影和生成器
//定义地图投影
var projection=d3.geoMercator()
.center([107,31]) //地图中心位置,107是经度，31是纬度
.scale(600) //设置缩放量
.translate([width/2,height/2]); // 设置平移量

//定义地理路径生成器,使每一个坐标都会先调用此投影,才产生路径值
var path=d3.geoPath()
.projection(projection);// 设定投影

//3.请求china.geo.json数据,添加<path>,每个path用于绘制一个省的路径
/**
 * 获取鼠标位置
 * @param {Object} e 当前的元素对象
 */
function mouseXY(e){
    var e=e||window.event;
    return { "x": e.offsetX, "y": e.offsetY };
}

/**
 * 删除文字和方框
 */
function fangkuangRemove()
{
    d3.select("#fangkuang1").remove();
    d3.select("#fangkuang2").remove();
    d3.select("#fangkuang3").remove();
}
/**
 * 创建方框和框内文字
 * @param {Object} svg 
 * @param {Object} d
 */
function createFangkuang(svg,d,data,imgsrc)
{
    
    let XY=mouseXY(event);
    svg.append("rect")
            .attr("id", "fangkuang1")
            .attr("x", XY.x)
            .attr("y",XY.y)
            .attr("class","fangkuang")
    //创建显示tooltip文本
    svg.append("text")
            .attr("id", "fangkuang2")
            .attr("x", XY.x+55)
            .attr("y",XY.y+20)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#fff")
            .text(d.properties.name+ ":" + data);
    svg.append("svg:image")
            .attr("id", "fangkuang3")
            .attr("xlink:href", imgsrc) // 设置图片路径
            .attr("width", 100)
            .attr("height", 85)
            .attr("x", XY.x)
            .attr("y", XY.y + 24);
}
//请求china.geo.json
function drawmap(cate_id, date){
    data = dataset;
    //创建svg
    var svg = d3.select(".graph-bd")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
            
    var groups=svg.append("g");
    
    const colorScale = d3.scaleQuantile()
                        .domain([0, 4])
                        .range(['#FEE5D9', '#FCAE91', '#FB6A4A', '#CB181D']);

    groups.selectAll("path")
        .data(china_geo_data.features)
        .enter()
        .append("path")
        .attr("d", path) 
        .style("fill", function(d) {
            var relativehot = getdata(data[cate_id][date]["province"],d.properties.name)/(getdata(data[cate_id]["2022-12-21"]["province"],d.properties.name)+1)
            return colorScale(relativehot); // 根据数据大小计算得出的颜色
        })   
        .on('mouseover',function(event, d){
            d3.select(this)
            .style('fill','#2CD8FF');
            if (getdata(data[cate_id][date]["province"],d.properties.name)/(getdata(data[cate_id]["2022-12-21"]["province"],d.properties.name)+1)>2){
                createFangkuang(svg,d,getdata(data[cate_id][date]["province"],d.properties.name),"./images/22.jpg");
            }
            else {
                createFangkuang(svg,d,getdata(data[cate_id][date]["province"],d.properties.name),"./images/33.jpg");
            }
            updateIndicator(getdata(data[cate_id][date]["province"], d.properties.name)/(getdata(data[cate_id]["2022-12-21"]["province"],d.properties.name)+1));	
            
            let legendCircle = document.querySelector('circle')
            if (legendCircle) legendCircle.style.display = 'block';
        })
        .on('mousemove',function(event, d){
            fangkuangRemove();
            if (getdata(data[cate_id][date]["province"],d.properties.name)/(getdata(data[cate_id]["2022-12-21"]["province"],d.properties.name)+1)>2){
                createFangkuang(svg,d,getdata(data[cate_id][date]["province"],d.properties.name),"./images/22.jpg");
            }
            else {
                createFangkuang(svg,d,getdata(data[cate_id][date]["province"],d.properties.name),"./images/33.jpg");
            }
            updateIndicator(getdata(data[cate_id][date]["province"], d.properties.name)/(getdata(data[cate_id]["2022-12-21"]["province"],d.properties.name)+1));	
        })
        .on('mouseout',function(event, d){
            d3.select(this)
            .style("fill", function(d) {
                var relativehot = getdata(data[cate_id][date]["province"],d.properties.name)/(getdata(data[cate_id]["2022-12-21"]["province"],d.properties.name)+1)
                return colorScale(relativehot); // 根据数据大小计算得出的颜色
        });
            fangkuangRemove();
            let legendCircle = document.querySelector('circle')
            if (legendCircle) legendCircle.style.display = 'none';
        });
        var legendSvg = d3.select(".graph-bd")
                        .append("svg")
                        .attr("width", 150)
                        .attr("height", 400 + 20)
                        .style("margin-top", "70px");
        
        var numRects = 4; // 设置图例矩形的数量
        var rectHeight = 400 / numRects;

        for (var i = 0; i < numRects; i++) {
            legendSvg.append("rect")
                .attr("x", 0)
                .attr("y", i * rectHeight)
                .attr("width", 30)
                .attr("height", rectHeight)
                .style("fill", colorScale(i));
            legendSvg.selectAll("text")
                .data(d3.range(numRects))
                .enter()
                .append("text")
                .attr("x", 40)
                .attr("y", function(d) { 
                    return (d * rectHeight) + rectHeight / 2; })
                .text(function(d) { 
                    return d + "-" + (d+1);
            });
        }
        // 4+以上图例
        legendSvg.append("rect")
                .attr("x", 0)
                .attr("y", numRects * rectHeight)
                .attr("width", 30)
                .attr("height", 20)
                .style("fill", "#B0080D");
        legendSvg.append("text")
                .attr("x", 40)
                .attr("y", numRects * rectHeight + 12)
                .text("4+");
        var indicator = legendSvg.append("circle")
                            .attr("cx", 15)
                            .attr("cy", -5)
                            .attr("r", 5)
                            .style("fill", "black");
        function updateIndicator(value) {
        var cy = (value * rectHeight > 4*rectHeight)? 4*rectHeight + 10 : value * rectHeight;
        indicator.attr("cy", cy);
        }
}
