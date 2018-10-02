odoo.define('website_community_portal1.website_community_portal1', function (require) {
"use strict";
var ajax = require('web.ajax');
$(document).ready(function () {
	
// =======================================================
//
// family tree :
//
// =======================================================

var ancestorRoot, descendantRoot, siblingRoot, spouseRoot;
var boxWidth = 220,
    boxHeight = 80,
    duration = 750; // duration of transitions in ms
// Setup zoom and pan
var zoom = d3.behavior.zoom()
  .scaleExtent([.1,1])
  .on('zoom', function(){
    svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
  })
  // Offset so that first pan and zoom does not jump back to the origin
  .translate([600, 250]);
var svg = d3.select("#canvas").append("svg")
  .attr('width', 1150)
  .attr('height', 600)
  .call(zoom)
  .append('g')
  
  // Left padding of tree so that the whole root node is on the screen.
  // TODO: find a better way
  .attr("transform", "translate(600,300)");
var ancestorsTree = d3.layout.tree()
  
  // Using nodeSize we are able to control
  // the separation between nodes. If we used
  // the size parameter instead then d3 would
  // calculate the separation dynamically to fill
  // the available space.
  .nodeSize([100, 250])
  
  // By default, cousins are drawn further apart than siblings.
  // By returning the same value in all cases, we draw cousins
  // the same distance apart as siblings.
  .separation(function(){
    return 2.4;
  })
  
  // Tell d3 what the child nodes are. Remember, we're drawing
  // a tree so the ancestors are child nodes.
  .children(function(person){
    // If the person is collapsed then tell d3
    // that they don't have any ancestors.
    if(person.collapsed){
      return;
    } else {
      return person._parents;
    }
  });

// Use a separate tree to display the descendants
var descendantsTree = d3.layout.tree()
  .nodeSize([100, 250])
  .separation(function(){
    return 2.4;
  })
  .children(function(person){
    if(person.collapsed){
      return;
    } else {
      return person._children;
    }
  });

var siblingTree = d3.layout.tree()
    .nodeSize([100, 400])
    .separation(function(){
        return 0.9;
    })
    .children(function(person){
        if(person.collapsed){
          return;
        } else {
          return person._siblings;
        }
    });

var spouseTree = d3.layout.tree()
.nodeSize([100, 225])
.separation(function(){
    return 2.5;
})
.children(function(person){
    if(person.collapsed){
      return;
    } else {
      return person._spouse;
    }
});

ajax.jsonRpc('/family_tree', 'call', {'partner_id':$("#canvas").data('partner_id')}).done(function(data){
    svg.data(data, function(error, json){

        if(error) {
          return console.error(error);
        }
        // D3 modifies the objects by setting properties such as
        // coordinates, parent, and children. Thus the same node
        // node can't exist in two trees. But we need the root to
        // be in both so we create proxy nodes for the root only.
        ancestorRoot = rootProxy(data);
        descendantRoot = rootProxy(data);
        siblingRoot = rootProxy(data);
        spouseRoot = rootProxy(data);
        // Start with only the first few generations showing
        if (ancestorRoot._parents){
            ancestorRoot._parents.forEach(collapse);
//            ancestorRoot._parents.forEach(function(parents){
//                 parents._parents.forEach(collapse);
//            });
        }
        
        if (descendantRoot._children) {
            descendantRoot._children.forEach(collapse);
        }
        
        
        drawSiblings(siblingRoot)
        drawSpouse(spouseRoot)
        drawAncestors(ancestorRoot);
        drawDescendants(descendantRoot);
            
      });

function rootProxy(root){
  return {
    name: root.name,
    id: root.id,
    x0: 0,
    y0: 0,
    _children: root._children,
    _parents: root._parents,
    age:root.age,
    gender:root.gender,
    image:root.image,
    _siblings:root._siblings,
    _spouse: root._spouse,
    collapsed: false
  };
}

function drawSpouse(source){
    drawparallel(source, spouseTree, spouseRoot, 'spouse', 1);
}
function drawSiblings(source){
    drawparallel(source, siblingTree, siblingRoot, 'siblings', -1);
}
function drawAncestors(source){
  draw(source, ancestorsTree, ancestorRoot, 'ancestor', -1);
}
function drawDescendants(source){
  draw(source, descendantsTree, descendantRoot, 'descendant', 1);
}
function draw(source, tree, root, displayClass, direction){
  var nodes = tree.nodes(root),
      links = tree.links(nodes);
  // Update links
  var link = svg.selectAll("path.link." + displayClass)
  
      // The function we are passing provides d3 with an id
      // so that it can track when data is being added and removed.
      // This is not necessary if the tree will only be drawn once
      // as in the basic example.
      .data(links, function(d){ return d.target.id; });
  // Add new links   
  // Transition new links from the source's
  // old position to the links final position
  link.enter().append("path")
      .attr("class", "link " + displayClass)
      .attr("d", function(d) {
        var o = { y: direction * (source.y0 + boxWidth/2), x: source.x0};
        return transitionElbow({source: o, target: o});
      });
    
  // Update the old links positions
  link.transition()
      .duration(duration)
      .attr("d", function(d){
        return elbow(d, direction);
      });
  
  // Remove any links we don't need anymore
  // if part of the tree was collapsed
  // Transition exit links from their current position
  // to the source's new position
  link.exit()
      .transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = { y: direction * (source.y + boxWidth/2), x: source.x};
        return transitionElbow({source: o, target: o});
      })
      .remove();
  // Update nodes    
  var node = svg.selectAll("g.person." + displayClass)
      
      // The function we are passing provides d3 with an id
      // so that it can track when data is being added and removed.
      // This is not necessary if the tree will only be drawn once
      // as in the basic example.
      .data(nodes, function(person){ return person.id; });
      
  // Add any new nodes
  var nodeEnter = node.enter().append("g")
      .attr("class", "person " + displayClass)
      // Add new nodes at the right side of their child's box.
      // They will be transitioned into their proper position.
      .attr('transform', function(person){
        return 'translate(' + source.x0 + ',' + (direction * (source.y0 + boxWidth/2)) + ')';
      })
      .on('click', togglePerson);
  // Draw the rectangle person boxes.
  // Start new boxes with 0 size so that
  // we can transition them to their proper size.
    nodeEnter.append("rect")
      .attr({
        x: 0,
        y: 0,
        width: 0,
        height: 0
     });
    // Draw the person's name and position it inside the box
    nodeEnter.append("svg:image")
      .attr("width", "60px")
      .attr("height", "75px")
      .attr("x", -105)
      .attr("y",-40)
      .attr("xlink:href", function(d) {
          var img = d.image
          return "data:image/jpg;base64,"+ img
    })
    nodeEnter.append("text")
      .attr("dx", -40)
      .attr("dy", -20)
      .attr("text-anchor", "start")
      .attr('class', 'name')
      .text(function(d) { 
        return d.name 
    })
    nodeEnter.append("text")
      .attr("dx", -40)
      .attr("dy", 0)
      .attr('class', 'gender')
      .text(function(d){
          return "Gender:"+d.gender
    })
    nodeEnter.append("text")
      .attr("dx", -40)
      .attr("dy", 20)
      .attr('class', 'age')
      .text(function(d){
          return "Age:"+d.age
    })

  // Update the position of both old and new nodes
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { 
          return "translate(" + d.x + "," + (direction * d.y) + ")";
      });

  // Grow boxes to their proper size    
  nodeUpdate.select('rect')
      .attr({
        x: -(boxWidth/2),
        y: -(boxHeight/2),
        width: boxWidth,
        height: boxHeight
      });

  // Move text to it's proper position
  nodeUpdate.select('text')
      //.attr("dx", -(boxWidth/2) + 10)
      .style('fill-opacity', 1);
  
  // Remove nodes we aren't showing anymore
  var nodeExit = node.exit()
      .transition()
      .duration(duration)
      
      // Transition exit nodes to the source's position
      .attr("transform", function(d) { return "translate(" + source.x + "," + (direction * (source.y + boxWidth/2)) + ")";})
      .remove();
  
  // Shrink boxes as we remove them    
  nodeExit.select('rect')
      .attr({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
      
  // Fade out the text as we remove it
  nodeExit.select('text')
      .style('fill-opacity', 0)
      .attr('dx', 0);
  
  // Stash the old positions for transition.
  nodes.forEach(function(person) {
    person.x0 = person.x;
    person.y0 = person.y;
  });
}

//Draw siblings...

function drawparallel(source, tree, root, displayClass, direction){
    var nodes = tree.nodes(root),
        links = tree.links(nodes);
    // Update links
    var link = svg.selectAll("path.link." + displayClass)
    
        // The function we are passing provides d3 with an id
        // so that it can track when data is being added and removed.
        // This is not necessary if the tree will only be drawn once
        // as in the basic example.
    
        .data(links, function(d){ return d.target.id; });
    
    // Add new links   
    // Transition new links from the source's
    // old position to the links final position
    link.enter().append("path")
        .attr("class", "link " + displayClass)
        .attr("d", function(d) {
          var o = {x: source.x0, y: direction * (source.y0 + boxWidth/2)};
          return transitionparallelElbow({source: o, target: o});
        });
      
    // Update the old links positions
    link.transition()
        .duration(duration)
        .attr("d", function(d){
          return parallelelbow(d, direction);
        });
    
    // Remove any links we don't need anymore
    // if part of the tree was collapsed
    // Transition exit links from their current position
    // to the source's new position
    link.exit()
        .transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: direction * (source.y + boxWidth/2)};
          return transitionparallelElbow({source: o, target: o});
        })
        .remove();
    // Update nodes    
    var node = svg.selectAll("g.person." + displayClass)
        
        // The function we are passing provides d3 with an id
        // so that it can track when data is being added and removed.
        // This is not necessary if the tree will only be drawn once
        // as in the basic example.
        .data(nodes, function(person){ return person.id; });
        
    // Add any new nodes
    var nodeEnter = node.enter().append("g")
        .attr("class", "person " + displayClass)
        // Add new nodes at the right side of their child's box.
        // They will be transitioned into their proper position.
        .attr('transform', function(person){
          return 'translate(' + (direction * (source.y0 + boxWidth/2)) + ',' + source.x0 + ')';
        })
        .on('click', togglePerson);
    // Draw the rectangle person boxes.
    // Start new boxes with 0 size so that
    // we can transition them to their proper size.
    nodeEnter.append("rect")
        .attr({
          x: 0,
          y: 0,
          width: 0,
          height: 0
        });
    // Draw the person's name and position it inside the box
    nodeEnter.append("svg:image")
        .attr("width", "60px")
        .attr("height", "75px")
        .attr("x", -105)
        .attr("y",-40)
        .attr("xlink:href", function(d) {
            var img = d.image
            return "data:image/jpg;base64,"+ img
    })
    
    nodeEnter.append("text")
        .attr("dx", -40)
        .attr("dy", -20)
        .attr("text-anchor", "start")
        .attr('class', 'name')
        .text(function(d) { 
          return d.name 
    })
    nodeEnter.append("text")
        .attr("dx", -40)
        .attr("dy", 0)
        .attr('class', 'gender')
        .text(function(d){
            return "Gender:"+d.gender
    })
    nodeEnter.append("text")
        .attr("dx", -40)
        .attr("dy", 20)
        .attr('class', 'age')
        .text(function(d){
            return "Age:"+d.age
    })

    // Update the position of both old and new nodes
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + (direction * d.y) + "," + d.x + ")"; });
        
    // Grow boxes to their proper size
    nodeUpdate.select('rect')
        .attr({
          x: -(boxWidth/2),
          y: -(boxHeight/2),
          width: boxWidth,
          height: boxHeight
        });
    
    // Move text to it's proper position
    nodeUpdate.select('text')
        //.attr("dx", -(boxWidth/2) + 10)
        .style('fill-opacity', 1);
    
    // Remove nodes we aren't showing anymore
    var nodeExit = node.exit()
        .transition()
        .duration(duration)
        
        // Transition exit nodes to the source's position
        .attr("transform", function(d) { return "translate(" + (direction * (source.y + boxWidth/2)) + "," + source.x + ")"; })
        .remove();
    
    // Shrink boxes as we remove them    
    nodeExit.select('rect')
        .attr({
          x: 0,
          y: 0,
          width: 0,
          height: 0
        });
        
    // Fade out the text as we remove it
    nodeExit.select('text')
        .style('fill-opacity', 0)
        .attr('dx', 0);
    
    // Stash the old positions for transition.
    nodes.forEach(function(person) {
      person.x0 = person.x;
      person.y0 = person.y;
    });
  }

  function parallelelbow(d, direction) {
      var sourceX = d.source.x,
          sourceY = d.source.y + (boxWidth / 2),
          targetX = d.target.x,
          targetY = d.target.y - (boxWidth / 2);
          
      return "M" + (direction * sourceY) + "," + sourceX
        + "H" + (direction * (sourceY + (targetY-sourceY)/2))
        + "V" + targetX 
        + "H" + (direction * targetY);
    }

  function transitionparallelElbow(d){
    return "M" + d.source.y + "," + d.source.x
      + "H" + d.source.y
      + "V" + d.source.x 
      + "H" + d.source.y;
  }

  
/**
 * Update a person's state when they are clicked.
 */
function togglePerson(person){
  // Figure out of the root node was clicked. Remember
  // we have two proxy root nodes so we have handle both.
  if(person === ancestorRoot || person === descendantRoot || person === siblingRoot || person === spouseRoot){
    if(ancestorRoot.collapsed){
      ancestorRoot.collapsed = false;
      descendantRoot.collapsed = false;
      siblingRoot.collapsed = false;
      spouseRoot.collapsed = false;
    } else {
      collapse(ancestorRoot);
      collapse(descendantRoot);
      collapse(siblingRoot);
      collapse(spouseRoot);
    }
    drawDescendants(descendantRoot);
    drawAncestors(ancestorRoot);
    drawSiblings(siblingRoot);
    drawSpouse(spouseRoot);
  }
  // Non-root nodes
  else {
  
    if(person.collapsed){
      person.collapsed = false;
    } else {
      collapse(person);
    }
    
    // Figure out which tree the person belongs too.
    // Don't need to redraw when leaf nodes are
    // toggled because they don't expand or collapse,
    // therefore we don't account for them.
    if(person._children){
      drawDescendants(person);
    } else if(person._parents){
      drawAncestors(person);
    } else if(person._sblings){
        drawSiblings(person);
    } else if (person._spouse){
        drawSpouse(person);
    }
  }
}
/**
 * Collapse person (hide their ancestors). We recursively
 * collapse the ancestors so that when the person is
 * expanded it will only reveal one generation. If we don't
 * recursively collapse the ancestors then when
 * the person is clicked on again to expand, all ancestors
 * that were previously showing will be shown again.
 * If you want that behavior then just remove the recursion
 * by removing the if block.
 */
function collapse(person){
  person.collapsed = true;
  if(person._parents){
    person._parents.forEach(collapse);
  }
  if(person._children){
    person._children.forEach(collapse);
  }
}
    
/**
 * Custom path function that creates straight connecting
 * lines. Calculate start and end position of links.
 * Instead of drawing to the center of the node,
 * draw to the border of the person profile box.
 * That way drawing order doesn't matter. In other
 * words, if we draw to the center of the node
 * then we have to draw the links first and the
 * draw the boxes on top of them.
 */
function elbow(d, direction) {
  var sourceX = d.source.x,
      sourceY = d.source.y + (boxWidth / 2),
      targetX = d.target.x,
      targetY = d.target.y - (boxWidth / 2);
      
  return "M" + sourceX + "," + (direction * sourceY)
  + "V" + ((sourceY + (targetY-sourceY)/2) * direction)
  + "H" + targetX 
  + "V" + (direction * targetY);
}
/**
 * Use a different elbow function for enter
 * and exit nodes. This is necessary because
 * the function above assumes that the nodes
 * are stationary along the x axis.
 */
function transitionElbow(d){
return "M" + d.source.x + "," + d.source.y
+ "V" + d.source.y
+ "H" + d.source.x 
+ "V" + d.source.y;
}

});



})   })