import { useLayout, useElement, useEffect } from "@nebula.js/stardust";
import properties from "./object-properties";
import data from "./data";
import * as d3 from "d3";
import { useSelections } from "@nebula.js/stardust";

export default function supernova() {
  return {
    qae: {
      properties,
      data,
    },
    component() {
      const element = useElement();
      const layout = useLayout();
      const selections = useSelections();
      console.log(layout);
      //getting data array from QS object layout
      useEffect(() => {
        var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
        console.log(qMatrix);

        //array to get measure labels
        var measureLabels = layout.qHyperCube.qMeasureInfo.map(function (d) {
          return d.qFallbackTitle;
        });

        console.log(measureLabels);

        //an array that invokes each row of qMatrix from layout:
        var data = qMatrix.map(function (d) {
          return {
            PetalLength: d[0].qText,
            PetalWidth: d[1].qText,
            SepalLength: d[2].qText,
            SepalWidth: d[3].qText,
            Species: d[4].qText,
          };
        });

        var width = 1000;
        var height = 400;

        var id = "container_" + layout.qInfo.qId;
        console.log(id);

        // if not created, use id and size to create
        const elem_new = `<div id=${id}></div>`;
        element.innerHTML = elem_new;

        viz(data, width, height, id);
      }, [element, layout]);

      /*
      useEffect(() => {
        const onClick = () => {
          selections.begin('/qHyperCubeDef');
        };
        element.addEventListener('click', onClick);
        return () => {
          element.removeEventListener('click', onClick);
        };
      }, []);
      */

      //Function to use D3.js and build the Scatter-Pie plot:

      function viz(data, width, height, id) {
        var margin = { top: 30, right: 50, bottom: 10, left: 50 },
          width = width - margin.left - margin.right,
          height = height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3
          .select("#" + id)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // Parse the Data

        //  console.log(data)

        // Color scale: give me a specie name, I return a color
        var color = d3
          .scaleOrdinal()
          .domain(["setosa", "versicolor", "virginica"])
          .range(["#440154ff", "#21908dff", "#fde725ff"]);

        var dimensions = Object.keys(data[0]).filter(function (d) {
          return d != "Species";
        });

        // For each dimension, I build a linear scale. I store all in a y object
        var y = {};
        for (var i in dimensions) {
          var name_new = dimensions[i];
          y[name_new] = d3.scaleLinear().domain([0, 8]).range([height, 0]);
        }

        var x = d3.scalePoint().range([0, width]).domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
          return d3.line()(
            dimensions.map(function (p) {
              return [x(p), y[p](d[p])];
            })
          );
        }

        // Draw the lines
        svg
          .selectAll("myPath")
          .data(data)
          .enter()
          .append("path")
          .attr("class", function (d) {
            return "line " + d.Species;
          })
          .attr("d", path)
          .style("fill", "none")
          .style("stroke", function (d) {
            return color(d.Species);
          })
          .style("opacity", 0.5);

        // Draw the axis:
        svg
          .selectAll("myAxis")
          .data(dimensions)
          .enter()
          .append("g")
          .attr("class", "axis")
          .attr("transform", function (d) {
            return "translate(" + x(d) + ")";
          })
          .each(function (d) {
            d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));
          })
          .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function (d) {
            return d;
          })
          .style("fill", "black");
      }
    },
  };
}
