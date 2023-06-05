function hide(id){document.getElementById(id).style.display='none';}
function show(id){document.getElementById(id).style.display='flex'; document.getElementById(id).style.justifyContent='space-between'}
var Data=[{date:"0101",value:"23"},{date:"0102",value:"13"},{date:"0103",value:"17"},{date:"0104",value:"18"},{date:"0105",value:"29"}];
function plot(selector,data=Data,width = 640,height = 400,marginTop = 20,marginRight = 30, marginBottom = 30,marginLeft = 40,MarginX=8,MarginY=8,w_height=50,w_width=100,r=5,rgb="rgb(1,1,1)",t1="",t2="",t3="",t4=""){
    // Declare the x (horizontal position) scale.
    const xScale = d3.scaleBand(data.map(d=>d.date), [marginLeft, width - marginRight]).paddingInner(1).paddingOuter(1);

    // Declare the y (vertical position) scale.
    const yScale = d3.scaleLinear([0, d3.max(data,d=>d.value)], [height - marginBottom, marginTop+w_height]);

    // Create the SVG container.
    const svg = selector.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis.
    svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(xScale).ticks(width/80).tickSizeOuter(0))
    .call(g => g.append("text")
    .attr("x", marginLeft/2+width/2-marginRight/2)
    .attr("y", marginBottom-10)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text(t3));

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale).ticks(height / 40))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("x2", width - marginLeft - marginRight)
    .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
    .attr("x", -marginLeft)
    .attr("y", 1/2*height)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text(t4));

    // Append a line connecting the values.
    const line = d3.line()
    .x(d=>xScale(d.date))
    .y(d=>yScale(d.value));
    svg.append("path")
    .attr("fill", "none")
    .attr("stroke", rgb)
    .attr("stroke-width", 1.5)
    .attr("d", line(data));

    //append data circle

    svg.selectAll("circle").data(data).join("circle").attr("class","data-circle").attr("cx",d=>xScale(d.date)).attr("cy",d=>yScale(d.value)).attr("r",r).attr("id",d=>`${d.date}`).attr("onmouseover",d=>`show('i${d.date}')`).attr("onmouseout",d=>`hide('i${d.date}')`);
            
    //提示框

    selector.selectAll('div').data(data).enter().append("div").attr("id",d=>`i${d.date}`).attr("class","window").text(d=>t1+` ${d.date}\n`+t2+` ${d.value}`).style("left",d=>`${xScale(d.date)+MarginX}px`).style("top",d=>`${yScale(d.value)-w_height+MarginY}px`).style("display","none").style("width",`${w_width}px`).style("height",`${w_height}px`);
    d3.selectAll(".window").append("img").attr("src","2233.png").attr("class","n2233").style("width",`${w_height*68/45}px`).style("height",`${w_height}px`)//.style("margin-left",`${w_width-w_height*68/45}px`);
    let rect = svg.append('rect')
    .attr("class", "shield_rect")
    .attr("x", marginLeft)
    .attr("y", 0)
    .attr("width", width - marginLeft - marginRight)
    .attr("height", height - marginBottom)
    .style("fill", "white")
    rect.transition()
    .duration(3000)
    .attr("x", width - marginRight)
    .remove()
}
function draw_line_date(department,date,selector,width = 640,height = 400,marginTop = 20,marginRight = 30, marginBottom = 30,marginLeft = 40,w_height=50,w_width=200,r=5,rgb="rgb(1,1,1)",MarginX=8, MarginY=8){
    departments = {'日常':'21','鬼畜调教':'22','综合':'27','网络游戏':'65','综艺':'71','科技':'95','搞笑':'138','科普':'201'}
    var data=dataset[departments[department]][date]["hour"];
    var D=[];
    for(i=0;i<24;i++){
        D.push({date:`${i+1}:00 `,value:data[i][0]+data[i][1]});
    }
    plot(selector,data=D,width = width,height = height,marginTop = marginTop,marginRight = marginRight, marginBottom = marginBottom,marginLeft = marginLeft,MarginX=MarginX, MarginY=MarginY,w_height=w_height,w_width=w_width,r=r,rgb=rgb,t1="时刻：",t2="讨论热度：",t3="Hour",t4="Hot Index");
}