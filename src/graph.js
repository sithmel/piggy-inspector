import { select, mouse } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { max, min } from 'd3-array';
import { line as lineGen } from 'd3-shape';
import { axisLeft, axisBottom } from 'd3-axis';
import { voronoi } from 'd3-voronoi';
import dateFormat from 'dateformat';

function getter(str) {
  return function (d) {
    return d[str];
  };
}

function formatTransactions(d) {
  var date = dateFormat(d.date, "dd/mm/yyyy");
  var head = '<div>' + date + ' - ' + d.balance + '</div><table><tr><th>Amount</th><th>Info</th></tr>';
  var foot = '</table>';
  var body = d.transactions.map(function (t) {
    return '<tr><td>' + t.amount + '</td><td>' + t.info + '</td></tr>'
  }).join('');
  return head + body + foot;
}

function Graph(opts) {
  opts = opts || {};
  var selector = opts.selector;
  var selectorInfo = opts.selectorInfo;
  this.paddingTop = opts.paddingTop || 40;
  this.paddingBottom = opts.paddingBottom || 40;
  this.paddingLeft = opts.paddingLeft || 40;
  this.paddingRight = opts.paddingRight || 40;
  this.vis = select(selector);
  this.info = select(selectorInfo);
  this.height = parseInt(this.vis.attr('height'), 10) - this.paddingTop - this.paddingBottom;
  this.width = parseInt(this.vis.attr('width'), 10) - this.paddingRight - this.paddingLeft;
}

Graph.prototype.plot = function (data) {
  var self = this;
  var maxdate = max(data, getter('date'));
  var mindate = min(data, getter('date'));

  var maxBalance = max(data, getter('balance'));
  var minBalance = min(data, getter('balance'));

  var scaleX = scaleTime()
    .range([this.paddingLeft, this.width])
    .domain([mindate, maxdate]);

  var scaleY = scaleLinear()
    .range([this.paddingTop + this.height, this.paddingTop])
    .domain([minBalance, maxBalance]);

  var axisX = axisLeft(scaleY);
  var axisY = axisBottom(scaleX);

  var line = lineGen()
    .x(function (d) {
      return scaleX(d.date);
    })
    .y(function (d) {
      return scaleY(d.balance);
    });

  var voronoiRadius = this.width / 6;
  var voronoiDiagram = voronoi()
    .x(function (d){ return scaleX(d.date); })
    .y(function (d){ return scaleY(d.balance); })
    .size([this.width, this.height])(data);

  // callback to highlight a point
  function highlight(d) {
    var hc = self.vis.select('.highlight-circle');
    // no point to highlight - hide the circle
    if (!d) {
      hc.style('display', 'none');
    // otherwise, show the highlight circle at the correct position
    } else {
      hc
        .style('display', '')
        .style('stroke', 'red')
        .attr('cx', scaleX(d.date))
        .attr('cy', scaleY(d.balance));
    }
  }

  var linegraph = this.vis
    .selectAll('path')
    .data([data]);

  linegraph
    .enter()
    .append('path')
    .merge(linegraph)
    .attr('class', 'line')
    .attr('d', function (d) {
      return line(d);
    });

  var xAxis = this.vis
    .selectAll('.xAxis')
    .data(['']);

  xAxis
    .enter()
      .append('g')
      .classed('xAxis', true)
      .attr("transform", "translate(" + this.paddingLeft + ",0)")
    .merge(xAxis)
      .call(axisX);

  var yAxis = this.vis
    .selectAll('.yAxis')
    .data(['']);

  yAxis
    .enter()
      .append('g')
      .classed('yAxis', true)
      .attr("transform", "translate(0," + (this.height + this.paddingTop) + ")")
    .merge(yAxis)
      .call(axisY);


    // add a circle for indicating the highlighted point
  var highlightCircle = this.vis
    .selectAll('.highlight-circle')
    .data(['']);

  highlightCircle
    .enter()
    // .append('g')
    .append('circle')
      .attr('class', 'highlight-circle')
      .attr('r', 8) // slightly larger than our points
      .style('fill', 'none')
      .style('display', 'none');

  // voronoi map
  var overlay = this.vis
    .selectAll('.overlay')
    .data(['']);

  overlay
    .enter()
    .append('rect')
    .attr('class', 'overlay')
    .attr('x', this.paddingLeft)
    .attr('y', this.paddingTop)
    .attr('width', this.width)
    .attr('height', this.height)
    .style('fill', '#f00')
    .style('opacity', 0)
    .merge(overlay)
    .on('mousemove', function () {
      // get the current mouse position
      var [mx, my] = mouse(this);

      // use the new diagram.find() function to find the Voronoi site
      // closest to the mouse, limited by max distance voronoiRadius
      var site = voronoiDiagram.find(mx, my, voronoiRadius);
      // console.log(site)
      highlight(site && site.data);
      if (site && site.data) {
        self.info.html(formatTransactions(site.data))
      } else {
        self.info.html('');
      }
    })
    .on('mouseleave', function (){
      // hide the highlight circle when the mouse leaves the chart
      highlight(null);
      self.info.html('');
    });
};

export default Graph;
