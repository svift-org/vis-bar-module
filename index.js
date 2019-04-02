SVIFT.vis.barchart = (function (data, container) {
 
  var module = SVIFT.vis.base(data, container);
 
  module.d3config = {
    ease:d3.easeBounceOut, 
    xInterpolate:[],
    steps:data.data.data.length,
    animation:{
      duration: 3000,
      barPartPercent: .8
    }
  };

  module.setup = function () {

    module.d3config.barsContainer = module.vizContainer.append('g').attr('class', 'bars-container').selectAll("g")
      .data(data.data.data)
      .enter().append("g");

    module.d3config.bars = module.d3config.barsContainer.append('rect')
      .style('stroke','transparent')
      .attr('class', 'visFill')
      .style('opacity',0);

    module.d3config.barsText = module.d3config.barsContainer.append("text")
      .text(function(d) { return d.label })
      .attr('class', 'labelText') //bold
      .attr("text-anchor", "middle")
      .style('opacity',0);

    module.d3config.barsNumber = module.d3config.barsContainer.append("text")
      .text(function(d) { return d.data[0] })
      .attr('class', 'labelNumber')
      .attr("text-anchor", "middle")
      .style('opacity',0);


    module.timeline = {
      bars: {start:0, end:3000, func:module.barAnimation}
    };



  };

  module.update = function(){
    module.d3config.barsContainer.data(data.data.data).enter();
    module.d3config.bars.datum(function(d){return d;});
    module.d3config.barsText.datum(function(d){return d;}).text(function(d) { return d.label });
    module.d3config.barsNumber.datum(function(d){return d;}).text(function(d) { return d.data[0] });
  };

  module.resize = function () {

    module.d3config.y = d3.scaleBand().padding(0.1).domain(data.data.data.map(function(d,i) {return i; }));
    module.d3config.x = d3.scaleLinear().domain([0, d3.max(data.data.data, function(d){return d.data[0];})]);
    
    var barsNumberHeigth = module.d3config.barsNumber._groups[0][0].getBBox().width;
    // var barsTextHeigth = module.d3config.barsText._groups[0][0].getBBox().height;
    var textPadding = 60;
    var vizTranslate = barsNumberHeigth + textPadding;


    var windowHeight = module.vizSize.height + 15;
    var width = module.vizSize.width; //-vizTranslate;

    module.d3config.y.range([0,windowHeight]);
    // console.log(module.d3config.y.range(1))
    module.d3config.x.range([width,0]);

    d3.select('.bars-container')
      .attr('transform','translate(0,'+ (module.d3config.y(0))+')');


    module.d3config.bars
      .attr('y', function(d,i){return module.d3config.y(i) })
      .attr("height", module.d3config.y.bandwidth())
      .attr("opacity", 0);

    // module.vizContainer.append('rect')
    //   .attr('width', module.vizSize.width)
    //   .attr('height', module.vizSize.height)


    // module.d3config.barsText
    //   .attr("x", function(d,i){ return module.d3config.x(i) + (module.d3config.y.bandwidth() / 2) })
    //   .attr("y",function(d){ return this.getBBox().height + width + textPadding})
    //   .attr("font-size", "1em")
    //   // .attr("opacity", 0);

    // module.d3config.barsNumber
    //   .attr("x", function(d,i){ return module.d3config.x(i) + (module.d3config.y.bandwidth() / 2) })
    //   .attr("y", function(d){ return module.d3config.y(d.data[0]) - textPadding }) 
    //   .attr("font-size", "1em")
    //   // .attr("opacity", 0);


    data.data.data.forEach(function(d,i){
      // module.d3config.yInterpolate[i] = d3.interpolate(width, module.d3config.x(d.data[0]));
      module.d3config.xInterpolate[i] = d3.interpolate(0, width-module.d3config.x(d.data[0]));
      // module.d3config.oInterpolate[i] = d3.interpolate(0, 1);
    });

    if(module.playHead == module.playTime){
        module.goTo(1);
        module.pause();
    }

  };




  module.barAnimation = function(t){

    // var interpolation = Math.round(module.d3config.interpolate(module.d3config.ease(t)));
    // module.d3config.count
    //   .text(interpolation)
    //   .attr("opacity",1);
    module.d3config.bars.style('opacity', 1 );

    for (var i = 0; i < module.d3config.steps; i++) {


      d3.select(module.d3config.bars._groups[0][i])
        // .attr('y',      function(){ return module.d3config.yInterpolate[index](module.d3config.ease(t)); })
        .attr('width', function(){ return module.d3config.xInterpolate[i](module.d3config.ease(t)); })

    }

  };

  module.timeline = {
    bars: {start:0, end:3000, func:module.barAnimation}
  };

  return module;

});