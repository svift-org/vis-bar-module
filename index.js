SVIFT.vis.barchart = (function (data, container) {
 
  var module = SVIFT.vis.base(data, container);
 
  module.d3config = {
    ease:d3.easeBounce, 
    xInterpolate:[],
    steps:data.data.data.length,
    showNumberLabels: data.data.showNumberLabels

  };

  module.setup = function () {

    module.d3config.barsContainer = module.vizContainer.selectAll("g")
      .data(data.data.data)
      .enter().append("g");

    module.d3config.bars = module.d3config.barsContainer.append('rect')
      .style('stroke','transparent')
      .attr('class', 'visFill')
      .style('opacity',0);


    module.d3config.barsText = module.d3config.barsContainer.append("text")
      .text(function(d) { 
        var numberText = "";
        if(module.d3config.showNumberLabels){
          numberText = " (" + d.data[0] + ")";
        }
        return d.label + numberText 
      })
      .attr('class', 'labelText bold') //bold
      .attr("font-size", "1em")
      .style('opacity',1);

    module.d3config.barsNumber = module.d3config.barsContainer.append("text")
      .text(function(d) { return d.data[0] })
      .attr('class', 'labelNumber')
      .attr("text-anchor", "middle")
      .style('opacity',0);


    module.timeline = {
      bars: {start:0, end:1500, func:module.barAnimation},
      text: {start:1500, end:3000, func:module.textAnimation},
    };



  };

  module.update = function(){
    module.d3config.barsContainer.data(data.data.data).enter();
    module.d3config.bars.datum(function(d){return d;});
    module.d3config.barsText.datum(function(d){return d;}).text(function(d) { return d.label });
  };

  module.resize = function () {

    var maxValue = d3.max(data.data.data, function(d){return d.data[0];})
    module.d3config.y = d3.scaleBand().padding(0.1).domain(data.data.data.map(function(d,i) {return i; }));
    module.d3config.x = d3.scaleLinear().domain([0, maxValue]);

    var windowHeight = module.vizSize.height + 20;
    var width = module.vizSize.width; //-vizTranslate;

    module.d3config.y.range([0,windowHeight]);
    module.d3config.x.range([width,0]);

    module.d3config.barsContainer
      .attr('transform','translate(0,'+ (module.d3config.y(0))+')');


    module.d3config.bars
      .attr('y', function(d,i){return module.d3config.y(i) })
      .attr("height", module.d3config.y.bandwidth())
      .attr("opacity", 0);

    data.data.data.forEach(function(d,i){
      module.d3config.xInterpolate[i] = d3.interpolate(0, width-module.d3config.x(d.data[0]));
    });


    var maxXsize = d3.interpolate(0, width-module.d3config.x(maxValue))(1);

    var textHeight = module.d3config.barsText._groups[0][0].getBoundingClientRect().height;

    module.d3config.barsText
      .attr("x", function(d,i){ 
        if(module.d3config.xInterpolate[i](1) <= maxXsize/2){
          return module.d3config.xInterpolate[i](1) + 10; 
        }else{
          return module.d3config.xInterpolate[i](1) - 10; 
        }
      })
      .classed('white',function(d,i){ 
        if(module.d3config.xInterpolate[i](1) <= maxXsize/2){
          return false; 
        }else{
          return true; 
        }
      })
      .attr("y",function(d,i){ return module.d3config.y(i) + (module.d3config.y.bandwidth() / 2) + textHeight/3})
      .attr("text-anchor", function(d,i){ 
        if(module.d3config.xInterpolate[i](1) <= maxXsize/2){
          return 'start'; 
        }else{
          return 'end'; 
        }
      })
      .style("opacity", 0);


    if(module.playHead == module.playTime){
        module.goTo(1);
        module.pause();
    }

  };


  module.barAnimation = function(t){

    module.d3config.bars.style('opacity', 1 );

    for (var i = 0; i < module.d3config.steps; i++) {
      d3.select(module.d3config.bars._groups[0][i])
        .attr('width', function(){ return module.d3config.xInterpolate[i](module.d3config.ease(t)); })

    }

  };


  module.textAnimation = function(t){

    if(t!==0){
      module.d3config.barsText.style('opacity', 1 );
    }

  };

  return module;

});