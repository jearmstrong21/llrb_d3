window.clearOps = () => {
    document.getElementById("ops").innerHTML = "";
}

window.makeOp = op => {
    document.getElementById("ops").innerHTML += op.replace(/\n/g, "<br/>");
}


let simulation = d3.forceSimulation()
    .force("manyBody", d3.forceManyBody())
    .force("link", d3.forceLink().id(node => node.value).strength(0.1))
    // .force("center", d3.forceCenter(0, 0).strength(0.001))
    // .force("collision", d3.forceCollide(10))
    .force("x", d3.forceX(node => node.origX))
    .force("y", d3.forceY(node => node.origY))
    .on("tick", tick);
// TODO ADD CONFIGURATION TO THIS SO ITS NOT HARDCODED, CHANGE AT RUNTIME
// let width = window.innerWidth;
// let height = window.innerHeight - 200;

let scalar = 0.5;
let svg = d3.select("body").append("svg");
let width = svg.node().clientWidth * scalar;
let height = svg.node().clientHeight * scalar;
svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

let defs = svg.append("defs");
let arrowheadMarker = defs.append("marker")
    .attr("id", "arrowhead")
    .attr("markerWidth", 5)
    .attr("markerHeight", 3.5)
    .attr("refX", -8)
    .attr("refY", 1.75)
    .attr("orient", "auto")
    .attr("opacity", 0.4)
    .attr("fill", "#fff");
arrowheadMarker.append("polygon").attr("points", [0, 0, 5, 1.75, 0, 3.5])

let link = svg.append("g")
    .attr("stroke-opacity", "0.6")
    .selectAll("line");

let node = svg.append("g")
    .selectAll("g");

// let alphaDisplay = svg.append("rect").attr("x", 0).attr("y", height / 2 - 50).attr("width", 100).attr("height", 50);
let alphaDisplay = svg.append("text").attr("x", 0).attr("y", height / 2 - 50).attr("font-size", 50).attr("stroke", "#fff");

function tick() {
    // alphaDisplay.attr("fill", d3.interpolateWarm(simulation.alpha()))
    alphaDisplay.text(Math.floor(100.0 * simulation.alpha()) / 100.0);
    node.attr("transform", node => `translate(${node.x}, ${node.y})`);

    link.attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => link.target.x)
        .attr("y2", link => link.target.y);
}

// let tree = new BST();
let tree = new LLRB();

function seed() {
    d3.shuffle(Array.from(Array(10).keys())).forEach(x => tree.add(x * 5));
}

// seed();

window.clearOps();
{
    let a = null;
    let b = (x, r) => ({value: x, red: r, left: a, right: a});
    let c = (x, rr, l, r) => ({value: x, red: rr, left: l, right: r});
    let _3 = b(3, true);
    let _5 = c(5, false, _3, a);
    let _10 = b(10, true);
    let _15 = c(15, false, _10, a);
    let _9 = c(9, true, _5, _15);
    let _18 = b(18, false);
    let _17 = c(17, false, _9, _18);
    let _21 = b(21, true);
    let _23 = c(23, false, _21, a);
    let _30 = b(30, false);
    let _24 = c(24, true, _23, _30);
    let _50 = b(50, true);
    let _51 = c(51, false, _50, a);
    let _40 = c(40, false, _24, _51);
    let _20 = c(20, false, _17, _40);
    tree.root = _20;
    // tree.add(11);
}
// tree.add(20);
// tree.add(17);
// tree.add(40);
// tree.add(9);
// tree.add(18);
// tree.add(24);
// tree.add(51);

function update() {
    let old = [...node.data()];

    let nodes = tree.nodes(0, 10 - height / 2, 200, 50);
    // let nodes = tree.nodes(0, 0, 0, 0);
    let links = tree.links();

    nodes = nodes.map(newNode => {
        let find = old.find(x => x.value === newNode.value);
        if (find === undefined) {
            return newNode;
        }
        // newNode.x = find.x;
        // newNode.y = find.y;
        // newNode.vx = find.vx;
        // newNode.vy = find.vy;
        // newNode.fx = find.fx;
        // newNode.fy = find.fy;
        // return newNode
        delete newNode.x;
        delete newNode.y;
        Object.assign(find, newNode);
        return find;
        // return newNode;
    });

    node = node.data(nodes, n => n.value).join(enter => {
        let g = enter.append("g");
        g.append("text").text(n => n.value)
            .attr("text-anchor", "middle").attr("alignment-baseline", "middle").attr("fill", "#fff");
        g.append("circle").attr("r", 10).attr("stroke", node => node.red ? "#f00" : "#fff").attr("stroke-opacity", 0.0).attr("fill-opacity", 0.0)
            .call(d3.drag()
                .container(svg.node())
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(1.0).restart();
                    g.selectAll("circle").filter(d => d.value === event.subject.value)
                        .transition(d3.transition().duration(100).ease(d3.easeLinear))
                        .attr("stroke-opacity", 1.0);
                    d.fx = d.x;
                    d.fy = d.y;
                    event.on("drag", (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    }).on("end", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.0);
                        g.selectAll("circle").filter(d => d.value === event.subject.value)
                            .transition(d3.transition().duration(100).ease(d3.easeLinear))
                            .attr("stroke-opacity", 0.0);
                        d.fx = null;
                        d.fy = null;
                    })
                })
            );
        return g;
    }, update => update, exit => exit.remove());
    link = link.data(links, link => link).join(enter => enter.append("line")
        .attr("marker-start", `url(#${arrowheadMarker.attr("id")})`)
        .attr("stroke", link => {
            console.log("E", link);
            return nodes.find(n => n.value === link.target).red ? "#900" : "#999";
        })
        .attr("stroke-width", 2)
        .attr("shape-rendering", "optimizeQuality"), update => update.attr("stroke", link => {
        console.log("U", link);
        return nodes.find(n => n.value === link.target).red ? "#900" : "#999";
    }));

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1.0).restart();
}

update();

document.getElementById("add").addEventListener("click", () => {
    let x = parseInt(prompt("Enter number"));
    // let x = prompt("Enter value");
    if (!isNaN(x)) {
        if (tree.contains(x)) {
            alert("Already contains value");
        } else {
            tree.add(x);
            update();
        }
    }
});

window.timeouts = [];
window.clearTimeouts = () => window.timeouts.forEach(window.clearTimeout);

document.getElementById("start").addEventListener("click", () => {
    window.clearTimeouts();
    if (tree instanceof BST) {
        tree = new BST();
    } else if (tree instanceof LLRB) {
        tree = new LLRB();
    } else {
        alert("Unknown tree impl");
        return;
    }
    d3.shuffle(Array.from(Array(20).keys())).forEach((i, j) => {
        window.timeouts.push(setTimeout(() => {
            tree.add(i);
            update();
        }, j * 50));
    });
});
document.getElementById("rotleft").addEventListener("click", () => {
    window.clearTimeouts();
    tree.rotateLeft();
    update();
});
document.getElementById("rotright").addEventListener("click", () => {
    window.clearTimeouts();
    tree.rotateRight();
    update();
});
document.getElementById("newbst").addEventListener("click", () => {
    window.clearOps();
    window.clearTimeouts();
    tree = new BST();
    update();
});
document.getElementById("newllrb").addEventListener("click", () => {
    window.clearOps();
    window.clearTimeouts();
    tree = new LLRB();
    update();
})