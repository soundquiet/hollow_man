const people = [{
    "name":"csj",
    "png": "images/zibaoziqi_r.png"
},{
    "name":"jkl",
    "png":"images/shenbuyouji_r.png"
},{
    "name":"ponda",
    "png":"images/jinxiaoshengwei_r.png"
}];
const period = ["9","12","15","18","21","24"];
const ticks = ["0","9","12","15","18","21","24"];
const person2app = {};

const lengthPerTime = 3.6;
const lineHeight = 200,
        blockWidth = 120,
        lineHeight_app = lineHeight / 2;

const overview2detailScale = 1.5;

let overview = function(){
    //clear
    authority_g.attr("opacity", 0);
    if(vis_g){
        vis_g.attr("opacity", 1);
        return;
    }
    
    vis_g = svg.append("g")
        .attr("transform", `translate(40,240)`)
        //.attr("transform", `rotate(90, 400 600) scale(1.3)`);;

    d3.csv("../data/app.csv", function(data){
        data.forEach(d => {
            d.authority = parseInt(d.authority);
            d.times = parseInt(d.times);
        });
        dataSet = data;

        people.forEach(p => {
            let origindata = data.filter(d => d.name === p.name);

            p["data"] = period.map(time => {
                return origindata.filter(d => d.time === time);
            });
            
            p["periodData"] = p["data"].map((d) => {
                let sizeTree = {
                    "name": "root",
                    "children": []
                }

                Authority.forEach((d) => {
                    sizeTree.children.push({
                        "name": d.name,
                        "children": []
                    });
                });

                let count = 0;
                d.forEach(l => {
                    count += l.times;
                    sizeTree.children[l.authority].children.push(l);
                });

                let treemap = d3.treemap()
                    .size([Math.sqrt(count) * lengthPerTime, Math.sqrt(count) * lengthPerTime])
                    .padding(1);
                
                let root = d3.hierarchy(sizeTree)
                let nodes = treemap(root
                        .sum(function(d) { return d.times; }))
                        .descendants();
                nodes.shift();
                return nodes;
            });

            let apps = Array.from(new Set(origindata.map(d => d.app)));
            person2app[p.name] = apps;
            p["appData"] = p["data"].map(d => {
                return apps.map(appName => {
                    let appnodes = d.filter(d0 => d0.app === appName);
                    let sizeTree = {
                        "name": "root",
                        "children": []
                    }

                    let count = 0;
                    appnodes.forEach((appnode) => {
                        count += appnode.times;
                        sizeTree.children.push(appnode);
                    });
                    
                    let treemap = d3.treemap()
                        .size([Math.sqrt(count) * lengthPerTime * overview2detailScale, Math.sqrt(count) * lengthPerTime * overview2detailScale])
                        .padding(1);

                    let root = d3.hierarchy(sizeTree)
                    let nodes = treemap(root
                            .sum(function(d) { return d.times; }))
                            .leaves();

                    return nodes;
                });
            });
        });

        //ticks
        let ticks_g = vis_g.append("g")
            .attr("transform", `translate(0,0)`)
            .selectAll("g")
            .data(ticks)
            .enter().append("g")
            .attr("class", "tick");

        ticks_g.append('text')
            .attr("x", (d, i) => i * blockWidth)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("font-size", 20)
            .text(d => d);

        ticks_g.append('circle')
            .attr("cx", (d, i) => i * blockWidth)
            .attr("cy", 40)
            .attr("r", 3);

        //treemap
        people_groups = vis_g.selectAll("people_groups")
            .data(people)
            .enter().append("g")
            .attr("class", "people_groups")
            .attr("transform", (d , i) => `translate(0 ,`+ (i * lineHeight + 40) +`)`);
        
        let back = people_groups.append("g").attr("class", "back");

        back.append("line")
            .attr("class", "decoration")
            .attr("x1", 0)
            .attr("x2", blockWidth * 6)
            .attr("y1", lineHeight / 2)
            .attr("y2", lineHeight / 2)
            .attr("stroke", "#333")
            .attr("stroke-width", '1');

        back.selectAll("circle")
            .data(ticks)
            .enter().append("circle")
            .attr("class", "decoration")
            .attr("cx", (d, i) => i * blockWidth)
            .attr("cy", lineHeight / 2)
            .attr("r", 3);

        back.append("svg:image")
            .attr("class", "decoration")
            .attr("xlink:href", d => d.png)
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", -25)
            .attr("y", lineHeight / 2 - 25);

        //每一个时间段的块
        let blocks = people_groups.selectAll(".block")
            .data(d => d.periodData, (d,i) => i)
            .enter().append("g")
            .attr("class","block")
            .attr("transform", (d , i) => {
                return `translate(`+ (i * blockWidth + (blockWidth - d[0].parent.x1 + d[0].parent.x0) / 2) +`,`+ (lineHeight - d[0].parent.y1 + d[0].parent.y0) / 2 +`)`
            });
        
        //backgroud
        blocks.append("rect")
            .attr("fill", "#fff")
            .attr("class", "decoration")
            .attr("x", d => d[0].parent.x0)
            .attr("y", d => d[0].parent.y0)
            .attr("width", d => d[0].parent.x1 - d[0].parent.x0)
            .attr("height", d => d[0].parent.y1 - d[0].parent.y0);

        blocks.selectAll(".node")
            .data(d => d.filter(d => d.depth === 2), d => d.data.app + d.data.time + d.data.authority)
            .enter().append("rect")
            .attr("class", "node")
            .attr("fill", d => {
                if(d.data.status === "allow") return Authority[d.data.authority].color;
                else return texturelist[Authority[d.data.authority].name].url();
            })
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);

        blocks.selectAll(".cluster")
            .data(d => d.filter(d => d.depth === 1))
            .enter().append("rect")
            .attr("class", "cluster")
            .attr("fill", (d,i) => {
                if(d.value)
                    return Authority[i].color;
            })
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);
    });
}

let overview_back = function(){
    authority_g.attr("opacity", 1);
    vis_g.attr("opacity", 0);
}

let detail = function(name){
    let person;
    people_groups.each(function(d){
        if(d.name === name){
            //clear
            vis_g.selectAll(".app_decoration").remove();

            vis_g.attr("transform", (d , i) => `translate(40 ,`+ (0) +`)`);
            person = d3.select(this)
                .attr("opacity", 1)
                .attr("transform", (d , i) => `translate(0 ,`+ (20) +`)`);
            person.selectAll(".decoration")
                .transition()
                .delay(0)
                .duration(600)
                .attr("opacity", 0);
            
            person.selectAll(".cluster")
                .transition()
                .delay(0)
                .duration(600)
                .attr("opacity", 0);

            let blocks = person.selectAll(".block")
                .data(d => d.appData, (d,i) => i)
                .transition()
                .delay(300)
                .duration(1000)
                .attr("transform", (d , i) => {
                    return `translate(`+ 0 +`,`+ 0 +`)`//
                });

            blocks.nodes().forEach(function(block, i_time){
                block = d3.select(block);
                let blockData = block.data()[0];
                blockData.forEach((appBlockData, i_app)=> {
                    block.selectAll(".node")
                        .data(appBlockData.filter(d => d.depth !== 0), d => d.data.app + d.data.time + d.data.authority)
                        .transition()
                        .delay(300)
                        .duration(1000)
                        .attr("x", d => d.x0 + i_time * blockWidth + (blockWidth - d.parent.x1 + d.parent.x0) / 2)
                        .attr("y", d => d.y0 + (i_app + 0)* lineHeight_app + 50 + (lineHeight_app - d.parent.y1 + d.parent.y0) / 2)
                        .attr("width", d => d.x1 - d.x0)
                        .attr("height", d => d.y1 - d.y0);
                });
            });

            let back = people_groups.select('.back');
            person2app[name].forEach(function(appName, i){
                back.append("line")
                    .attr("class", "app_decoration")
                    .attr("x1", 0)
                    .attr("x2", blockWidth * 0)
                    .attr("y1", lineHeight_app / 2 + (i + 0)* lineHeight_app + 50)
                    .attr("y2", lineHeight_app / 2 + (i + 0)* lineHeight_app + 50)
                    .attr("stroke", "#333")
                    .attr("stroke-width", '1')
                    .transition()
                    .delay(1300)
                    .duration(600)
                    .attr("x2", blockWidth * 6);

                back.selectAll(".circle")
                    .data(ticks, d => appName)
                    .enter().append("circle")
                    .attr("class", "app_decoration")
                    .attr("cx", (d, i) => i * blockWidth)
                    .attr("cy", lineHeight_app / 2 + (i + 0)* lineHeight_app + 50)
                    .attr("r", 3)
                    .attr("opacity", 0)
                    .transition()
                    .delay(1900)
                    .duration(300)
                    .attr("opacity", 1);   
            });
        }else{
            d3.select(this)
                .attr("opacity", 1)
                .transition()
                .delay(0)
                .duration(400)
                .attr("opacity", 0);
        }
    });

    person.selectAll('.nodes');
}

let detail1 = function(){
    detail("jkl");
}

let detail1_back = function(){
    vis_g.remove();
    vis_g = null;
    overview();
}

let detail2 = function(){
    detail("lp");
}
