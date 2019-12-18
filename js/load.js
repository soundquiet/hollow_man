 //TODO change gif and cover
// TODO 自适应 标题 和字号
// TODO 两个封面
const width = window.innerWidth;
const height = window.innerHeight;
console.log(width, height)
let singleText = 20;

let treemap = d3.treemap()
    .size([width, height])
    // .padding(2);

let root = d3.hierarchy(data);

let nodes = treemap(root.sum(function (d) { return d.size }))
    .leaves();

// 修改rect大小 随机
nodes.forEach(node => {
    let dx = node.x1 - node.x0;
    let dy = node.y1 - node.y0
    node.x0 = Math.max(0, node.x0 + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random()*20+1));
    node.y0 = Math.max(0, node.y0 + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random()*20+1));
    // node.x1 = Math.min(width, node.x1 + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random()*20+1));
    // node.y1 = Math.min(height, node.y1 + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random()*20+1));
    node.x1 = node.x0 + dx;
    node.y1 = node.y0 + dy;
    return node
});

const svg_load = d3.selectAll('.cover').append("svg")
    .attr("viewBox", [0, 0, width, height]);

svg_load.append("svg:image")
    .attr('x', width / 2 - 20)
    .attr('y', height / 2 - 20)
    .attr("width", width * 0.2)
    .attr("height", width * 0.2 * 290 / 360) // TODO 
    .attr("xlink:href", "images/tenor.gif")

const leaf = svg_load.selectAll("g")
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('opacity', 0)
    .attr("transform", d => `translate(${width / 2},${height / 2})`);


leaf.append("rect")
    // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
    .attr("fill", 'white')
    .attr("stroke", 'black')
    .attr("width", d => d.x1 - d.x0) 
    .attr("height", d => d.y1 - d.y0);

leaf.append("text")
    // .attr('x', 52)
    .attr('y', 0)
    .attr('font-size', 18)
    .selectAll("tspan")
    .data(d => {
        let temp = [];
        let wrapWidth = d.x1 - d.x0 - 20 >= 20 ? d.x1 - d.x0 - 20 : d.x1 - d.x0;
        const perLine = Math.floor(wrapWidth / singleText); // 每行能放多少个
        // console.log(wrapWidth, singleText, perLine, d.data)
        for(let index=0; index<d['data']['size'] ; index+=perLine ){
            // console.log(index)
            temp.push(d['data']['text'].slice(index,index+perLine));
        }   
        return temp;
    })
    .enter()
    .append('tspan')
    .attr('x', 0)
    .attr("dy", 20)
    .attr("fill", "black")
    .text(d => d);

leaf.selectAll('text')
    .attr('transform', function(d) {
        let bbox = d3.select(this).node().getBBox()
        return "translate(" + (d.x1 - d.x0 - bbox.width) / 2  + "," + (d.y1 - d.y0 - bbox.height) / 2 + ")";
    })

leaf.transition()
    .delay((d,i) => 200 * (i%15))
    .duration(1000)
    .attr('opacity', 1)
    .attr("transform", d => `translate(${d.x0},${d.y0})`);


setTimeout(function(){
    if (width > height) {
        var img = svg_load.append("svg:image")
            .attr("xlink:href", "images/cover.png")
            .attr("width", width * 0.6) // 700
            .attr("height", width * 0.6 * 420 / 700) // 420
            .attr("x", (width - width * 0.6) / 2)
            .attr("y",(height - width * 0.6 * 420 / 700 ) / 2);
    }
    else {
        var img = svg_load.append("svg:image")
        .attr("xlink:href", "images/cover.png")
        .attr("width", width * 0.8) // 700
        .attr("height", width * 0.8 * 420 / 700) // 420
        .attr("x", (width - width * 0.8) / 2)
        .attr("y",(height - width * 0.8 * 420 / 700 ) / 2);
    }
    
}, 200*16)