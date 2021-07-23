### ***D3 Research:***

### ***How D3 (Data Driven Documents) Works & Its capabilities:***
-D3 in general uses SVG to create the graphical elements (charts, graphs etc)\
-D3 utilizes CSS to style the SVG elements. SVG is basically an custom html tag (ex. <'svg'><'/svg>') where you can apply css on it to such as chart colours etc.\
-D3 uses Document Object Model (DOM) to place the elements in the document\
-D3 uses method chaining aka adding a bunch methods after each other as its syntax
>***-Example:*** const node = svg.append("g")\
      .attr("stroke", "#fff")\
      .attr("stroke-width", 1.5)\
    .selectAll("circle")\
    .data(nodes)\
    .join("circle")\
      .attr("r", 5)\
      .attr("fill", color)\
      .call(drag(simulation));

-D3 is not meant to do statistical analysis of the data, only visually represent data in a nutshell\
***NOTE:*** The learning curve for D3 might take a while due to the fact that while it has a lot of options, learning to figure out which methods and options will produce the visuals we want will take time

### ***How it relates to our project:***
-It will allow us to create interactive visual representations that 
will be compatible with a web app.\
-Is a basically a javascript framework we can use to create similar
representations that we saw with gephi but, this time we will have 
more customizability options

### ***How objects can be formatted to be used in d3.js:***
***Options:***\
-Data can be passed in through a csv type format: 
>-Example: <'script>\
    d3.csv("/data/employees.csv", function(data) {\
    for (var i = 0; i < data.length; i++) {\
        console.log(data[i].Name);\
        console.log(data[i].Age);\
    }\
});\
</script'>

-Data can also be passed in through a json file format:
>-Example: d3.json("/data/users.json", function(error, data) {\
    if (error) {\
        return console.warn(error);\
    }\
    d3.select("body")\
            .selectAll("p")\
            .data(data)\
            .enter()\
            .append("p")\
            .text(function(d) {\
                return d.name + ", " + d.location;\
            });\
    });

-Other options include using a .xml or .tsv file\
-Here is a link to more information on loading in data:
https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js

***Data Binding:***
-Data can be binded to a DOM in html as follows:
>-Example: 
    ```<'script>\
        var matrix = [
                        [1, 2, 3, 4],
                        [5, 6, 7, 8],
                        [9, 10, 11, 12],
                        [13, 14, 15, 16]
                    ];

        var tr = d3.select("body")
            .append("table")  // adds <table>
            .selectAll("tr")  // selects all <tr>
            .data(matrix)      // joins matrix array 
            .enter()           // create placeholders for each row in the array
            .append("tr");// create <tr> in each placeholder

        var td = tr.selectAll("td")
            .data(function (d) {    // joins inner array of each row
                console.log(d);
                return d;
            })
            .enter()    // create placeholders for each element in an inner array
            .append("td") // creates <td> in each placeholder
            .text(function (d) {
                console.log(d);
                return d; // add value of each inner array as a text in <td>
            });
    </script'>

Here is a link to more information on binding data to DOM:
https://www.tutorialsteacher.com/d3js/data-binding-in-d3js    


### ***Pre-requisites to learn or use d3.js:***
-Html\
-CSS\
-Javascript\
-DOM\
-SVG\
-Visualization and Design since there aren't templates provided by d3.js\
-D3 needs a browser that supports SVG. Most modern browsers have SVG support, but older, versions of browsers don't have it: (Ex. IE < 9.0, Chrome < Version 4, Firefox < Version 3)

### ***How to setup D3 infrastructure:***
-Run $npm install d3 or install from site: https://github.com/d3/d3/releases/tag/v6.5.0\
-Need to add a script tag to our html files as follows:
>-Example: <'script src="https://d3js.org/d3.v6.js"></script'>

-Here is a working example of how d3 is used in an html file: https://www.tutorialspoint.com/d3js/d3js_working_example.htm

### ***Types of Graphs to use which are similar to gephi:***
-Clustered Bubbles: https://observablehq.com/@d3/clustered-bubbles?collection=@d3/d3-force\
-Force Layout phyllotaxis arrangement:https://observablehq.com/@d3/force-layout-phyllotaxis?collection=@d3/d3-force\
-Disjointed Force Directed Graph: https://observablehq.com/@d3/disjoint-force-directed-graph

