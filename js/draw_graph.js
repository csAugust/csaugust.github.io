function hide(id){document.getElementById(id).style.display='none';}
function show(id){document.getElementById(id).style.display='inline-block';}
function changeColor(object,color,a){
    var w = document.getElementsByClassName("window");
    object.attributes.fill.value=color;
    if(w[0] != undefined){
        w[0].remove();
        return;
    }
    var x=a[0];
    var y=a[1];
    var size=a[2];
    var avg=a[3];
    var word=a[4];
    var id=a[5];
    if(size>=avg){
        var src="./images/2233.png";
    }
    else{
        var src="./images/3322.png";
    }
    w_width=200;
    div=document.createElement("div");
    div.className="window";
    div.style.marginLeft=`${x}px`;
    div.style.marginTop=`${-50+y-600}px`;
    div.style.width=`${w_width}px`;
    div.innerHTML=` '${word}'   \n 热度 : ${size}<img class='n2233' src='${src}' style="margin-left:${w_width-50*68/45 -8}px;">`;
    document.getElementById(id).appendChild(div);
}
var Data=[{date:"0101",value:"23"},{date:"0102",value:"13"},{date:"0103",value:"17"},{date:"0104",value:"18"},{date:"0105",value:"29"}];
function plot(selector,data=Data,width = 640,height = 400,marginTop = 20,marginRight = 30, marginBottom = 30,marginLeft = 40,Margin=8,w_height=50,w_width=100,r=5,rgb="rgb(1,1,1)",t1="",t2="",t3="",t4="",fsize=15){
    // Declare the x (horizontal position) scale.
    const xScale = d3.scaleBand(data.map(d=>d.date), [marginLeft, width - marginRight]).paddingInner(1).paddingOuter(1);

    // Declare the y (vertical position) scale.
    const yScale = d3.scaleLinear([0, d3.max(data,d=>d.value)], [height - marginBottom, marginTop+w_height]);

    const cS=d3.scaleLinear([0, d3.max(data,d=>d.value)], [0,100]);

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
    .attr("font-size", '12px')
    .call(g => g.append("text")
    .attr("x", marginLeft/2+width/2-marginRight/2)
    .attr("y", marginBottom-10)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text(t3));

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
    .attr("class","y-a")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale).ticks(height / 40))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("x2", width - marginLeft - marginRight)
    .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
    .attr("x", -marginLeft)
    .attr("y", '40px')
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text(t4));


    // Append a line connecting the values.
    const line = d3.line()
    .x(d=>xScale(d.date))
    .y(d=>yScale(d.value));
    svg.append("path")
    .attr("fill", "none")
    .attr("stroke",rgb)
    .attr("stroke-width", 1.5)
    .attr("d", line(data));

    //append data circle

    svg.selectAll("circle").data(data).join("circle").attr("fill",d => `rgb(${100-cS(d.value)},${180-cS(d.value)*1.5},${250-cS(d.value)/3})`).attr("class","data-circle").attr("cx",d=>xScale(d.date)).attr("cy",d=>yScale(d.value)).attr("r",r).attr("id",d=>`${d.date}`).attr("onmouseover",d=>`show('i${d.date}')`).attr("onmouseout",d=>`hide('i${d.date}')`);
            
    //提示框
    var avg = d3.sum(data,d => d.value)/data.length;
    selector.selectAll('div').data(data).enter().append("div").attr("id",d=>`i${d.date}`).attr("class","window").text(d=>t1+" "+t3+`-${d.date}\n`+t2+` ${d.value}`).style("left",d=>`${xScale(d.date)}px`).style("top",d=>`${yScale(d.value)-w_height}px`).style("display","none").style("width",`${w_width}px`).style("height",`${w_height}px`);
    d3.selectAll(".window").append("img").attr("src",function(d){if(d.value>=avg){return "./images/2233.png";}else{return "./images/3322.png"}}).attr("class","n2233").style("width",`${50*68/45}px`).style("height",`${50}px`).style("margin-left",`${w_width-50*68/45-8}px`);
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
function draw_line_date(department,date,selector,width = 640,height = 400,marginTop = 20,marginRight = 30, marginBottom = 30,marginLeft = 40,w_height=50,w_width=200,r=5,rgb="rgb(1,1,1)",Margin=8){
    departments = {'日常':'21','鬼畜调教':'22','综合':'27','网络游戏':'65','综艺':'71','科技':'95','搞笑':'138','科普':'201','手机游戏':'172'}
    var data=dataset[departments[department]][date]["hour"];
    var D=[];
    for(i=0;i<24;i++){
        D.push({date:`${i+1}:00 `,value:data[i][0]+data[i][1]});
    }
    plot(selector,data=D,width = width,height = height,marginTop = marginTop,marginRight = marginRight, marginBottom = marginBottom,marginLeft = marginLeft,Margin=Margin,w_height=w_height,w_width=w_width,r=r,rgb=rgb,t1="时刻：",t2="讨论热度：",t3="Hour",t4="Hot Index");
}
function draw_line_month(department,y_m,selector,width = 640,height = 400,marginTop = 20,marginRight = 30, marginBottom = 30,marginLeft = 40,w_height=50,w_width=200,r=5,rgb="rgb(1,1,1)",Margin=8){
    departments = {'日常':'21','鬼畜调教':'22','综合':'27','网络游戏':'65','综艺':'71','科技':'95','搞笑':'138','科普':'201','手机游戏':'172'}
    var data=dataset[departments[department]];
    var D=[];
    for(const [key,values] of Object.entries(data)){
        if(key.slice(0,7) == y_m){
            D.push({date:key.slice(8),value:values["comment"]+values["danmu"]});
        }
    }
    plot(selector,data=D,width = width,height = height,marginTop = marginTop,marginRight = marginRight, marginBottom = marginBottom,marginLeft = marginLeft,Margin=Margin,w_height=w_height,w_width=w_width,r=r,rgb=rgb,t1="日期：",t2="讨论热度：",t3=y_m,t4="Hot Index",fsize=12, rate=1);
}
var words_data=[{word:"你好",size:12},{word:"再见",size:225},{word:"小笼包",size:7},{word:"对不起",size:51},{word:"您好",size:13},{word:"吃了没",size:11},{word:"天气",size:32}];
function draw_wordcloud(selector,data=words_data,marginTop=0,marginRight=0,marginBottom=0,marginLeft=0,width=1200,height=600,padding=30,rotate=10,fontFamily="sans-serif",fontScale= 200,color="blue",c_color="gray"){
    var svg =selector.append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("font-family", fontFamily)
    .attr("text-anchor", "middle")

    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    var sum= d3.sum(data,d=>d.size);
    var avg= sum/data.length;

    const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);
    
    fScale={}

    const cloud = d3.layout.cloud()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .words(data)
    .padding(padding)
    .rotate(rotate)
    .font(fontFamily)
    .fontSize(d => (Math.sqrt(d.size))*fontScale)
    .spiral("archimedean")
    .on("word",({size,x, y, rotate, word}) => {
    g.append("text")
        .attr("font-size", size)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .text(word)
        .attr("fill",color)
        .attr("onmouseover",`changeColor(this,'${c_color}',[${x},${y},${Math.trunc((size/fontScale)**2)+1},${avg},'${word}','${selector["_groups"][0][0].id}'])`)
        .attr("onmouseout",`changeColor(this,'${color}',[${x},${y},${Math.trunc((size/fontScale)**2)+1},${avg},'${word}','${selector["_groups"][0][0].id}'])`);
    });
    cloud.start();
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
function draw_wordcloud_date(selector,department,date,width=1200,height=600,color="rgb(38,181,243)",fontsize=200){
    departments = {'日常':'21','鬼畜调教':'22','综合':'27','网络游戏':'65','综艺':'71','科技':'95','搞笑':'138','科普':'201','手机游戏':'172'}
    var data=dataset[departments[department]][date]["hot_words"];
    var Words=[];
    for(i=0;i<100;i++){
        if(stoplist.indexOf(data[i][0])==-1){
            Words.push({word:data[i][0],size:data[i][1]});
        }
    }
    draw_wordcloud(selector=selector,data=Words,marginTop=0,marginRight=0,marginBottom=0,marginLeft=0,width=width,height=height,padding=10,rotate=0,fontFamily="sans-serif",fontScale= fontsize,color=color,c_color="gray",rate=2);
}


function draw_wordcloud_month(selector,department,y_m,width=1200,height=600,color="rgb(38,181,243)",fontsize=200){
    departments = {'日常':'21','鬼畜调教':'22','综合':'27','网络游戏':'65','综艺':'71','科技':'95','搞笑':'138','科普':'201','手机游戏':'172'}
    var data=dataset[departments[department]];
    var count={};
    var Words=[];
    var c=0;
    for(const [key,values] of Object.entries(data)){
        if(key.slice(0,7) == y_m){
            for(i=0;i<100;i++){
                var words = data[key]["hot_words"][i];
                if(stoplist.indexOf(words[0]) == -1){
                    if(count[words[0]] != undefined){
                        count[words[0]]+=Math.sqrt(words[1]);c+=words[1];
                    }
                    else{
                        count[words[0]]=Math.sqrt(words[1]);c+=words[1]
                    }
                }
            }
        }
    }
    for(const [k,v] of Object.entries(count)){
        if(v>=c/10000){
            Words.push({word:k,size:v});
    }
    }
    draw_wordcloud(selector=selector,data=Words,marginTop=0,marginRight=0,marginBottom=0,marginLeft=0,width=width,height=height,padding=10,rotate=0,fontFamily="sans-serif",fontScale= fontsize,color=color,c_color="gray",rate=2);
}
bar_data=[{department:"奥特曼1",id:1,value:123},{department:"奥特曼2",id:2,value:123},{department:"奥特曼3",id:3,value:110},{department:"奥特曼4",id:4,value:123}]
function draw_bar(selector,data=bar_data,width = 640,height = 400,marginTop = 20,marginRight = 30, marginBottom = 80,marginLeft = 40,Margin=8,w_height=50,w_width=250,bar_width=20,t1="",t2="",t3="",t4="",fsize=15){
    // Declare the x (horizontal position) scale.
    const xScale = d3.scaleBand(data.map(d=>d.department), [marginLeft, width - marginRight]).paddingInner(1).paddingOuter(1);

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
    .attr("font-size",fsize)
    .call(g => g.append("text")
    .attr("x", marginLeft/2+width/2-marginRight/2)
    .attr("y", marginBottom-10)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text("分区"));

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
    .attr("class","y-a")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale).ticks(height / 40))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("x2", width - marginLeft - marginRight)
    .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
    .attr("x", -marginLeft+30)
    .attr("y", 80)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text("Hot Index"));

    // Append rect
    svg.selectAll('rect').data(data).join('rect').attr("onmouseover",d=>`show_bar(this,'d${d.id}')`).attr("onmouseout",d=>`hide_bar(this,'d${d.id}','rgb(38, 181, 243)')`)
    .attr("x",d=>`${xScale(d.department)-bar_width/2}px`).attr('y',d=>yScale(d.value))
    .attr('width',bar_width).attr('height',d=>`${height-marginBottom-yScale(d.value)}px`)
    .attr("fill",'rgb(38, 181, 243)')
    .attr("stroke",'black')
    .attr("data-departid", d=>`${d.id}`);
    
    //提示框
    var avg = d3.sum(data,d => d.value)/data.length;
    selector.selectAll('div').data(data).enter().append("div").attr("id",d=>`d${d.id}`).attr("class","window").text(d=>` 分区：${d.department}\n`+t2+` 热度：${d.value}`).style("left",d=>`${xScale(d.department)+Margin}px`).style("top",d=>`${yScale(d.value)-w_height+Margin}px`).style("display","none").style("width",`${w_width}px`).style("height",`${w_height}px`);
    d3.selectAll(".window").append("img").attr("src",function(d){if(d.value>=avg){return "./images/2233.png";}else{return "./images/3322.png"}}).attr("class","n2233").style("width",`${50*68/45}px`).style("height",`${50}px`).style("margin-left",`${w_width-50*68/45-8}px`);
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
function draw_bar_date(selector,date,bar_width=40,width=1200,height=600,marginTop=30,marginRight=30,marginBottom=70,marginLeft=40,w_height=50,w_width=250){
    departments = {'21':'日常区','22':'鬼畜区','27':'综合区','65':'网游区','71':'综艺区','95':'科技区','138':'搞笑区','201':'科普区','172':'手游区'};
    data=[];
    for(const [key,values] of Object.entries(dataset)){
        data.push({department:departments[key],id:key,value:values[date]['comment']+values[date]['danmu']});
    }
    data.sort(function(a,b){return b.value-a.value;})
    draw_bar(selector=selector,data=data,width = width,height = height,marginTop = marginTop,marginRight = marginRight, marginBottom = marginBottom,marginLeft = marginLeft,Margin=8,w_height=w_height,w_width=w_width,bar_width=bar_width,t1="",t2="",t3="",t4="",fsize=15)
}
function draw_bar_month(selector,y_m,bar_width=40,width=1200,height=600,marginTop=30,marginRight=30,marginBottom=70,marginLeft=40,w_height=50,w_width=250){
    departments = {'21':'日常区','22':'鬼畜区','27':'综合区','65':'网游区','71':'综艺区','95':'科技区','138':'搞笑区','201':'科普区','172':'手游区'};
    data=[];
    for(const [key,values] of Object.entries(dataset)){
        c=0;
        for(const [date,vs] of Object.entries(values)){
            if (y_m == date.slice(0,7)){
                c+=values[date]['comment']+values[date]['danmu'];
            }
        }
        data.push({department:departments[key],id:key,value:c});
    }
    console.log(data);
    data.sort(function(a,b){return b.value-a.value;});
    draw_bar(selector=selector,data=data,width = width,height = height,marginTop = marginTop,marginRight = marginRight, marginBottom = marginBottom,marginLeft = marginLeft,Margin=8,w_height=w_height,w_width=w_width,bar_width=bar_width,t1="",t2="",t3="",t4="",fsize=15)
}
function show_bar(object,id){document.getElementById(id).style.display='block';object.attributes.fill.value='rgb(209,230,247)';}
function hide_bar(object,id,color){document.getElementById(id).style.display='none';object.attributes.fill.value=color;}