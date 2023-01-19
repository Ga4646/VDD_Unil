const width = window.innerWidth;
const height = window.innerHeight;

var margin2 = {top: 50, right: 60, bottom: 100, left: 60},
    width2 = 460 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

d3.csv('manga.csv', function (d){
    return {
        nom : d.Manga,
        volumes : +d.Volumes,
        ventes : +d.VentesMillions,
        statut : d.Publication,
        parution : +d.Parution,
    }

}).then(donnees =>{

    //Première visualisaton 

    //création d'un espace svg qu'on lie avec le div #visualisation. 
    let caneva = d3.select("#visualisation")
    .append("svg")
        .attr("width", width)
        .attr("height", 550)


    //cération d'une infobulle
     const tooltip = d3.select("#visualisation").append("div")
         .style("opacity", 0)
         .attr("class", "tooltip")
         .style("background-color", "#92796D")
         .style("border", "solid")
         .style("border-width", "1px")
         .style("border-radius", "10px")
         .style("padding", "5px")
         .style("position", "absolute")


        // pour qu'une infobulle apparaisse 
         const mouseover = function(){
            tooltip.transition().
            duration(500)
            style("opacity", 1)
        }
        //fonction pour mettre les données liées aux cercles
        const mousemove = function(event,d) {
            tooltip
              .html("Manga : " +d.nom + '<br>' +"Nombre de tomes vendu : " + d.ventes/1000000 +"million" + '<br>' + "Statut de publication : " +d.statut)
              .style("left", (event.x) + "px")
              .style("top", (event.y) + "px")
              .style("opacity", 1)
          }
        
        //fonction pour faire disparaitre l'infobulle.
        const mouseleave = function (d) {
            tooltip.transition().
            duration(500)
            .style("opacity", 0)
        }  
    
    //création de groupe afin de lui attribuer un cercle.
    let group = caneva.selectAll('g')
        .data(donnees)
        .enter()
        .append('g')

    // Création d'un dégradé de couleur en bleu pour l'affecter à chaque cercle.
    var color = d3.scaleOrdinal(d3.schemeBlues[5]);
    //affectation des cercles dans les groupes.
    let node = group
        .append('circle')
            .attr("class", "node")
            .attr('cx', width)
            .attr('cy', height)
            .attr('r', d => d.ventes /10000000) 
            .attr('stroke', 'black')
            .style('fill', function(d,i){
                return color(i)
            })
            .on("mousover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

            //animation pour placer les cercles dans la page html
            let simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(width/2).y(height/3)) // mettres les cercles au centre vers la gauche de la page
            .force("charge", d3.forceManyBody().strength(-3)) // utilisation d'une force de 5 pour que les cercles soient séparés les uns des autres. 
            .force("collide", d3.forceCollide().strength(.05).radius(45).iterations(1)) // utilisation de forcecollide pour que les cercles ne s'emboitent pas. 

            //fonction qui permet de suivre les positions x et y des cercles. 
            simulation.nodes(donnees)
            .on("tick", function(){
                node.attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
                
            });
    
    //Deuxième visualisation.

    //créatioon du deuxième espace de svg qui va être lié avec le div dans la page html. 
    barSvg = d3.select("#visu2")
    .append("svg")
        .attr("width", width + margin2.left + margin2.right)
        .attr("height", height + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin2.left + "," + margin2.top + ")");

    const tooltip2 = d3.select("#visu2").append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "10px")
        .style("padding", "5px")
        .style("position", "absolute")


    const mouseover2 = function(){
        tooltip2.transition().
        duration(2000)
        style("opacity", 1)
    }
    //fonction pour mettre les données liées aux cercles
    const mousemove2 = function(event,d) {
        tooltip2
        .html("Temps de parution : " +d.parution +" ans" + '<br>' + "Nombre de volumes : "  + d.volumes)
        .style("left", (event.x) + "px")
        .style("top", (event.y + 800) + "px")
        .style("opacity", 5)

    }

    //fonction pour faire disparaitre l'infobulle.
    const mouseleave2 = function (d) {
        tooltip2.transition().
        duration(500)
        .style("opacity", 0)
    }

    const x =  d3.scaleBand()
        .domain(donnees.map(d => d.nom))
        .range([0, width])
        .padding(0.1);
            
    const y = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0])
    barSvg.append("g").call(d3.axisLeft(y))
    barSvg.append("g")
        .attr("transform", "translate(0," +height+")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")

    barSvg.selectAll("bar")
        .data(donnees)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.nom))
            .attr("y", d => y(d.parution))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.parution))
            .attr("fill", "#0291F7")
        .on("mousover", mouseover2)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave2)

    barSvg.selectAll("rect")
        .transition()
        .duration(1000)
        


})
