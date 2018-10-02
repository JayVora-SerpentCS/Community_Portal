odoo.define('website_community_portal.website_community_portal', function (require) {
"use strict";
var ajax = require('web.ajax');
$(document).ready(function () {

	/*News Scroll Function*/
	jQuery.fn.liScroll = function(settings) {
		settings = jQuery.extend({
			travelocity: 0.03
			}, settings);		
			return this.each(function(){
					var $strip = jQuery(this);
					$strip.addClass("newsticker")
					var stripHeight = 1;
					$strip.find("li").each(function(i){
						stripHeight += jQuery(this, i).outerHeight(true); // thanks to Michael Haszprunar and Fabien Volpi
					});
					var $mask = $strip.wrap("<div class='mask'></div>");
					var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");								
					var containerHeight = $strip.parent().parent().height();	//a.k.a. 'mask' width 	
					$strip.height(stripHeight);			
					var totalTravel = stripHeight;
					var defTiming = totalTravel/settings.travelocity;	// thanks to Scott Waye		
					function scrollnews(spazio, tempo){
					$strip.animate({top: '-='+ spazio}, tempo, "linear", function(){$strip.css("top", containerHeight); scrollnews(totalTravel, defTiming);});
					}
					scrollnews(totalTravel, defTiming);				
					$strip.hover(function(){
					jQuery(this).stop();
					},
					function(){
					var offset = jQuery(this).offset();
					var residualSpace = offset.top + stripHeight;
					var residualTime = residualSpace/settings.travelocity;
					scrollnews(residualSpace, residualTime);
					});			
			});	
	};

	$(function(){
	    $("ul#ticker01").liScroll();
	});
	
    // =======================================================
    //
    // SIGN UP PAGE :
    //
    // =======================================================

    if(window.location.href.indexOf("/signup") > -1) {

        $('#dob').datepicker({
            format: 'mm/dd/yyyy',
        });

        $('#form_1').removeClass('hidden');
        $('#form_2').addClass('hidden');
        $('#btn_back').addClass('hidden');
        $('#signup_submit').addClass('hidden');
        $('#error_message').addClass('hidden');
        $('#error_password').addClass('hidden');
        $('#error_email').addClass('hidden');

        $('#btn_next').click(function () {
            var $form = $(this).parent().find('form');
            var $email = $('form input[name="email'); //change form to id or containment selector
            var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
            if ((! $form.find("#name").val()) || (! $form.find("#email").val()) || (! $form.find("#password").val())) {
                $('#error_message').removeClass('hidden');
            }
            else if ($email.val() == '' || !re.test($email.val())) {
                $('#error_email').removeClass('hidden');
                return false;
            }
            else if ($form.find("#password").val() == $form.find("#password_confirmation").val()) {
                $('#form_1').addClass('hidden');
                $('#form_2').removeClass('hidden');
                $('#btn_back').removeClass('hidden');
                $('#signup_submit').removeClass('hidden');
                $('#btn_next').addClass('hidden');
                $('#error_message').addClass('hidden');
                $('#error_password').addClass('hidden');
                $('#error_email').addClass('hidden');
            }
            else {
                $('#error_password').removeClass('hidden');
            }
        });

        $('#btn_back').click(function () {
            $('#form_2').addClass('hidden');
            $('#form_1').removeClass('hidden');
            $('#btn_next').removeClass('hidden');
            $('#btn_back').addClass('hidden');
            $('#signup_submit').addClass('hidden');
        });

        $("#mob_no").keypress( function(e) {
            var chr = String.fromCharCode(e.which);
            if ("1234567890".indexOf(chr) < 0)
                return false;
        });

        $('#signup_submit').click(function (e) {
            e.preventDefault();
            var $form = $(this).parent().parent().parent().find('form');
            if ((! $form.find("#dob").val()) || (! $form.find("#mob_no").val()) || (! $form.find("#city").val()) || (! $form.find("#state").val()) || (! $form.find("#country").val())) {
                $('#error_message').removeClass('hidden');
                
            }
            else {
                $('#error_message').addClass('hidden');
                ajax.jsonRpc("/check_user", 'call', {
                    'name': $form.find("#name").val(),
                    'email': $form.find("#email").val(),
                    'password': $form.find("#password").val(),
                    'dob': $form.find("#dob").val(),
                    'gender': $('#gender_block input:radio[name=gender]:checked').val() ? $('#gender_block input:radio[name=gender]:checked').val() : false,
                    'mob_no': $form.find("#mob_no").val(),
                    'city': $form.find("#city").val(),
                    'state': $form.find("#state").val(),
                    'country': $form.find("#country").val(),
                }).done(function(data){
                });
                window.location.href = "/web/login";
            }
            
        });
    };


    // =======================================================
    //
    // WEBSITE PORTAL - ACCOUNT DETAILS :
    //
    // =======================================================

    if(window.location.href.indexOf("/my/account") > -1) {
        $("#mobile").keypress( function(e) {
            var chr = String.fromCharCode(e.which);
            if ("1234567890".indexOf(chr) < 0)
                return false;
        });
        function no_of_children() {
            var children = document.getElementById("children");
            if (children.options[children.selectedIndex].value == "no") {
                $('.no_of_children').addClass('hidden');
            }
            else {
                $('.no_of_children').removeClass('hidden');
            }
        };
        function marital_children() {
            var marital = document.getElementById("marital");
            if (marital.options[marital.selectedIndex].value == "single") {
                $('.marital_children').addClass('hidden');
                $('.no_of_children').addClass('hidden');
            }
            else {
                $('.marital_children').removeClass('hidden');
                no_of_children();
                $('.have_children').change(function() {
                    no_of_children();
                });
            }
        };

        marital_children();

        $('.marital').change(function() {
            marital_children();
        });

        function father_status() {
            var father_status = document.getElementById('father_status');
            if (father_status.options[father_status.selectedIndex].value == "employed") {
                $('.father_with_as').removeClass('hidden');
                $('.father_nature_of_business').addClass('hidden');
            }
            else if (father_status.options[father_status.selectedIndex].value == "business") {
                $('.father_nature_of_business').removeClass('hidden');
                $('.father_with_as').addClass('hidden');
            }
            else {
            	$('.father_with_as').addClass('hidden');
            	$('.father_nature_of_business').addClass('hidden');
            }
        };

        father_status();

        $('.father_status').change(function () {
            father_status();
        });

        function mother_status() {
            var mother_status = document.getElementById('mother_status');
            if (mother_status.options[mother_status.selectedIndex].value == "employed") {
                $('.mother_with_as').removeClass('hidden');
                $('.mother_nature_of_business').addClass('hidden');
            }
            else if (mother_status.options[mother_status.selectedIndex].value == "business") {
                $('.mother_nature_of_business').removeClass('hidden');
                $('.mother_with_as').addClass('hidden');
            }
            else {
            	$('.mother_with_as').addClass('hidden');
            	$('.mother_nature_of_business').addClass('hidden');
            }
        };

        mother_status();

        $('.mother_status').change(function () {
            mother_status();
        });

        $('#dob').on('change', function () {
            var b_date = new Date($('#dob')[0].value);
            var today = new Date();
            var today_year = today.getFullYear();
            var bdate_year = b_date.getFullYear();
            var age = Math.abs(today_year - bdate_year);
            $('#age').val(age);
        });

    };


    // =======================================================
    //
    // USER ACCOUNT DETAILS :
    //
    // =======================================================

    if(window.location.href.indexOf("/my/home") > -1) {

        $('.f_with_as').addClass('hidden');
        $('.f_nature_of_business').addClass('hidden');
        $('.m_with_as').addClass('hidden');
        $('.m_nature_of_business').addClass('hidden');
        $('.have_children').removeClass('hidden');
        $('.no_of_children').removeClass('hidden');

        if ($('.f_status span').text() == 'Employed') {
            $('.f_with_as').removeClass('hidden');
        };

        if ($('.f_status span').text() == 'Business') {
            $('.f_nature_of_business').removeClass('hidden');
        };

        if ($('.m_status span').text() == 'Employed') {
            $('.m_with_as').removeClass('hidden');
        };

        if ($('.m_status span').text() == 'Business') {
            $('.m_nature_of_business').removeClass('hidden');
        };

        if ($('.marital_status span').text() == 'Single') {
            $('.have_children').addClass('hidden');
            $('.no_of_children').addClass('hidden');
        };

        if ($('.have_children span').text() == 'No') {
            $('.no_of_children').addClass('hidden');
        };

        $('#button_start').on('click', function(){
            $('.pie_progress').asPieProgress('start');
        });

    };

    if(window.location.href.indexOf("/partners") > -1) {

        $('.f_with_as').addClass('hidden');
        $('.f_nature_of_business').addClass('hidden');
        $('.m_with_as').addClass('hidden');
        $('.m_nature_of_business').addClass('hidden');
        $('.have_children').removeClass('hidden');
        $('.no_of_children').removeClass('hidden');

        if ($('.f_status span').text() == 'Employed') {
            $('.f_with_as').removeClass('hidden');
        };

        if ($('.f_status span').text() == 'Business') {
            $('.f_nature_of_business').removeClass('hidden');
        };

        if ($('.m_status span').text() == 'Employed') {
            $('.m_with_as').removeClass('hidden');
        };

        if ($('.m_status span').text() == 'Business') {
            $('.m_nature_of_business').removeClass('hidden');
        };

        if ($('.marital_status span').text() == 'Single') {
            $('.have_children').addClass('hidden');
            $('.no_of_children').addClass('hidden');
        };

        if ($('.have_children span').text() == 'No') {
            $('.no_of_children').addClass('hidden');
        };

    };

});
//=======================================================
//
//Spouse tree
//========================================================
//
//(function () {
//
//    d3.familyTree = {
//      rootGeneration: 0,
//      roundedCorner: 6,
//      svgCanvasMinimumWidth: 400,
//      generationWidth: 300,
//      normalNodeWidth: 240,
//      normalNodeHeight: 45,
//      gapBetweenParentChild: 350,
//      gapBetweenSpouses: 70,
//      margin: {top:0, right:20, bottom:0, left:20},
//      treeData:
//      {
//        "personId": "1000001",
//        "personFullName": "Father-0 (PMI)",
//        "personGenderId": 1,
//        "personLivingOrDiedId": 2,
//        "personSelected": true,
//        "personNickName": "(PMI Nickname)",
//        "personSpouses": [
//          {
//            "personId": "1000002",
//            "personFullName": "Mother-0 (MP)",
//            "personGenderId": 0,
//            "personSelected": false
//          }
//        ],
//        "personChildren": [
//          {
//            "personId": "1000003",
//            "personFullName": "Father 1 (YMP)",
//            "personGenderId": 1,
//            "personSelected": false,
//            "personSpouses": [
//              {
//                "personId": "1000004",
//                "personFullName": "Mother-1 (MY)",
//                "personGenderId": 0,
//                "personSelected": false
//              }
//            ],
//            "personChildren": [
//              {
//                "personId": "1000023",
//                "personFullName": "Father-2 (JMJ)",
//                "personGenderId": 1,
//                "personSelected": false,
//                "personNickName": "(JMJ Nickname)",
//                "personPictureFileName": "M1000002.jpg",
//                "personSpouses": [
//                  {
//                    "personId": "1000024",
//                    "personFullName": "Mother-2 (MAJ)",
//                    "personGenderId": 0,
//                    "personSelected": false,
//                    "personPictureFileName": "M1000003.jpg"
//                  }
//                ]
//              }
//            ]
//          },
//          {
//            "personId": "1000700",
//            "personFullName": "Father-1 (PMP)",
//            "personGenderId": 1,
//            "personSelected": false,
//            "personSpouses": [
//              {
//                "personId": "1000701",
//                "personFullName": "Mother-1 (CMP)",
//                "personGenderId": 0,
//                "personSelected": false
//              }
//            ],
//            "personChildren": [
//              {
//                "personId": "1000702",
//                "personFullName": "Father-2 (JJJ)",
//                "personGenderId": 1,
//                "personSelected": false,
//                "personSpouses": [
//                  {
//                    "personId": "1000703",
//                    "personFullName": "Mother-2 (MJJ)",
//                    "personGenderId": 0,
//                    "personSelected": false
//                  }
//                ]
//              }
//            ]
//          }
//        ]
//      },
//
//
//      updateTree: function () {
//
//        d3.select("svg").remove();
//
//        var svgCanvasWidth = d3.familyTree.svgCanvasMinimumWidth + (6 * d3.familyTree.generationWidth) + d3.familyTree.margin.left + d3.familyTree.margin.right;
//        var svgCanvasHeight = 1300 + d3.familyTree.margin.top + d3.familyTree.margin.bottom;
//
//        var treeFamily = d3.layout.tree()
//            .children(function(d) {return d.personChildren;})
//            .separation(function () {return 1;})
//            //.separation(function(a, b) {return a.parent === b.parent ? 1 : .5;})
//            .size([svgCanvasHeight, svgCanvasWidth]);
//
//        var svgTree = d3.select("#ft_svg_div")
//            .append("svg:svg")
//            .attr("width", svgCanvasWidth)
//            .attr("height", svgCanvasHeight)
//            .style("margin", "1em 0 1em " + (-d3.familyTree.margin.left) + "px");
//
//        var g = svgTree.selectAll("g")
//            .data([].concat(d3.familyTree.treeData ? {nodes: treeFamily.nodes(d3.familyTree.treeData)} : []))
//            .enter()
//            .append("svg:g").attr("transform", function (d) {
//              return "translate(" + (!!d.flipped * svgCanvasWidth + d3.familyTree.margin.left) + "," + (d3.familyTree.margin.top) + ")";
//            });
//
//        var link = g.append("svg:g").attr("class", "link").selectAll("path").data(function (d) {
//              return treeFamily.links(d.nodes);
//            }).enter().append("path").attr("class", d3.familyTree.linkType);
//
//        var node = g.append("svg:g").attr("class", "node").selectAll("g").data(function (d) {
//              return d.nodes;
//            }).enter().append("svg:g");
//            //.on("click", clickedNode);
//
//        node.append("svg:rect");
//
//        node.append("svg:text").attr("dy", ".35em").text(function (d) {
//          return d.personFullName;
//        }).each(function (d) {
//          d.width = Math.max(32, this.getComputedTextLength() + 12);
//        }).attr("x", function (d) {
//          return d.flipped ? 6 - d.width : 6;
//        });
//
//        node.append("svg:text").attr("dy", "1.5em").text(function (d) {
//          return d.personNickName;
//        }).attr("x", function (d) {
//          return d.flipped ? 6 - d.width : 6;
//        });
//
//        d3.familyTree.resetTree(svgTree);
//
//        d3.familyTree.updateSpouses(svgTree);
//
//      },
//
//
//      resetTree: function (svgTree) {
//
//        var node = svgTree.selectAll(".node g")
//        .attr("class", function (d) {
//          return d.personSelected ? "selected" : "normal";
//        }).attr("transform", function (d, i) {
//          d.spouseX = d.depth * d3.familyTree.gapBetweenParentChild;
//          d.spouseY = d.x;
//          return "translate(" + (d.depth * d3.familyTree.gapBetweenParentChild) + "," + (d.x) + ")";
//        });
//
//        node.select("rect").attr("ry", d3.familyTree.roundedCorner).attr("rx", d3.familyTree.roundedCorner)
//        .attr("y", function (d) {
//          return -10;
//        }).attr("height", function (d) {
//          return d3.familyTree.normalNodeHeight;
//        }).attr("width", d3.familyTree.normalNodeWidth)
//        .filter(function (d) {
//          return d.flipped;
//        }).attr("x", function (d) {
//          return -d.width;
//        });
//
//        svgTree.selectAll(".link path").attr("class", d3.familyTree.linkType).attr("d", d3.svg.diagonal().source(function (d) {
//          return {
//            y: d.source.depth * d3.familyTree.gapBetweenParentChild + (d.source.flipped ? -1 : +1) * d3.familyTree.normalNodeWidth,
//            x: d.source.x + 12.5
//          };
//        }).target(function (d) {
//          return {
//            y: d.target.depth * d3.familyTree.gapBetweenParentChild,
//            x: d.target.x + 12.5
//          };
//        }).projection(function (d) {
//          return [
//            d.y, d.x
//            //d.x, d.y
//          ];
//        }));
//      },
//
//
//      linkType: function (d) {
//        return d.target.personId.split(/\s+/).map(function (t) {
//          return "to-" + t;
//        }).concat(d.source.personId.split(/\s+/).map(function (t) {
//          return "from-" + t;
//        }));
//      },
//
//
//      updateSpouses: function (svgTree) {
//
//        var node = svgTree.selectAll(".node g")
//        .append("svg:g").attr("transform", function (d, i) {
//          if (i == d3.familyTree.rootGeneration)
//            return "translate(" + (d.spouseX) + "," + (d3.familyTree.gapBetweenSpouses) + ")";
//          else
//            return "translate(" + 0 + "," + (d3.familyTree.gapBetweenSpouses) + ")";
//        }).filter(function (d, i) {
//          if ("personSpouses" in d) {
//            return d.personSpouses;
//          }
//        })
////        .on("click", clickedNode);
//
//
//        node.append("svg:rect").attr("ry", d3.familyTree.roundedCorner).attr("rx", d3.familyTree.roundedCorner)
//        .attr("y", function (d) {
//          return -10;
//        }).attr("height", d3.familyTree.normalNodeHeight)
//        .attr("width", d3.familyTree.normalNodeWidth)
//        .filter(function (d) {
//          if ("personSpouses" in d) {
//            return d.personSpouses;
//          }
//        });
//
//        node.append("svg:text").attr("dy", ".35em").text(function (d) {
//          return d.personSpouses[0].personFullName;
//        }).each(function (d) {
//          d.width = Math.max(32, this.getComputedTextLength() + 12);
//        }).attr("x", function (d) {
//          return d.flipped ? 6 - d.width : 6;
//        }).filter(function (d) {
//          if ("personSpouses" in d) {
//            return d.personSpouses;
//          }
//        });
//      }
//    }
//
////    function clickedNode(d) {
////      resetNodePersonSelected(d3.familyTree.treeData);
////      setNodePersonSelected(d3.familyTree.treeData, d);
////      d3.familyTree.updateTree();
////    }
//
//    function resetNodePersonSelected(obj) {
//      if (obj.personSelected) {
//        obj.personSelected = false;
//        return;
//      }
//      if ("personChildren" in obj) {
//        for (var i=0; i<obj.personChildren.length; i++) {
//          resetNodePersonSelected(obj.personChildren[i]);
//        }
//      }
//    }
//
//    function setNodePersonSelected(obj, d) {
//      if (obj.personId === d.personId) {
//        obj.personSelected = true;
//        return;
//      }
//      if ("personChildren" in obj) {
//        for (var i=0; i<obj.personChildren.length; i++) {
//          result = setNodePersonSelected(obj.personChildren[i], d);
//        }
//      }
//    }
//
//    d3.familyTree.updateTree();
//      
//  })();
//




// =======================================================
//
// family tree :
//
// =======================================================
//
//var ancestorRoot, descendantRoot, siblingRoot, spouseRoot;
//var boxWidth = 220,
//    boxHeight = 80,
//    duration = 750; // duration of transitions in ms
//// Setup zoom and pan
//var zoom = d3.behavior.zoom()
//  .scaleExtent([.1,1])
//  .on('zoom', function(){
//    svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
//  })
//  // Offset so that first pan and zoom does not jump back to the origin
//  .translate([600, 250]);
//var svg = d3.select("#canvas").append("svg")
//  .attr('width', 1150)
//  .attr('height', 600)
//  .call(zoom)
//  .append('g')
//  
//  // Left padding of tree so that the whole root node is on the screen.
//  // TODO: find a better way
//  .attr("transform", "translate(600,300)");
//var ancestorsTree = d3.layout.tree()
//  
//  // Using nodeSize we are able to control
//  // the separation between nodes. If we used
//  // the size parameter instead then d3 would
//  // calculate the separation dynamically to fill
//  // the available space.
//  .nodeSize([100, 250])
//  
//  // By default, cousins are drawn further apart than siblings.
//  // By returning the same value in all cases, we draw cousins
//  // the same distance apart as siblings.
//  .separation(function(){
//    return 2.4;
//  })
//  
//  // Tell d3 what the child nodes are. Remember, we're drawing
//  // a tree so the ancestors are child nodes.
//  .children(function(person){
//    // If the person is collapsed then tell d3
//    // that they don't have any ancestors.
//    if(person.collapsed){
//      return;
//    } else {
//      return person._parents;
//    }
//  });
//
//// Use a separate tree to display the descendants
//var descendantsTree = d3.layout.tree()
//  .nodeSize([100, 250])
//  .separation(function(){
//    return 2.4;
//  })
//  .children(function(person){
//    if(person.collapsed){
//      return;
//    } else {
//      return person._children;
//    }
//  });
//
//var siblingTree = d3.layout.tree()
//    .nodeSize([100, 400])
//    .separation(function(){
//        return 0.9;
//    })
//    .children(function(person){
//        if(person.collapsed){
//          return;
//        } else {
//          return person._siblings;
//        }
//    });
//
//var spouseTree = d3.layout.tree()
//.nodeSize([100, 225])
//.separation(function(){
//    return 2.5;
//})
//.children(function(person){
//    if(person.collapsed){
//      return;
//    } else {
//      return person._spouse;
//    }
//});
//
//ajax.jsonRpc('/family_tree', 'call', {'partner_id':$("#canvas").data('partner_id')}).done(function(data){
//	console.log("---call---/family_tree--inside---",$("#canvas").data('partner_id'))
//    svg.data(data, function(error, json){
//        if(error) {
//          return console.error(error);
//        }
//        // D3 modifies the objects by setting properties such as
//        // coordinates, parent, and children. Thus the same node
//        // node can't exist in two trees. But we need the root to
//        // be in both so we create proxy nodes for the root only.
//        ancestorRoot = rootProxy(data);
//        descendantRoot = rootProxy(data);
//        siblingRoot = rootProxy(data);
//        spouseRoot = rootProxy(data);
//        // Start with only the first few generations showing
//        if (ancestorRoot._parents){
//            ancestorRoot._parents.forEach(collapse);
////            ancestorRoot._parents.forEach(function(parents){
////                 parents._parents.forEach(collapse);
////            });
//        }
//        
//        if (descendantRoot._children) {
//            descendantRoot._children.forEach(collapse);
//        }
//        
//        
//        drawSiblings(siblingRoot)
//        drawSpouse(spouseRoot)
//        drawAncestors(ancestorRoot);
//        drawDescendants(descendantRoot);
//            
//      });
//function rootProxy(root){
//  return {
//    name: root.name,
//    id: root.id,
//    x0: 0,
//    y0: 0,
//    _children: root._children,
//    _parents: root._parents,
//    age:root.age,
//    gender:root.gender,
//    image:root.image,
//    _siblings:root._siblings,
//    _spouse: root._spouse,
//    collapsed: false
//  };
//}
//
//function drawSpouse(source){
//    drawparallel(source, spouseTree, spouseRoot, 'spouse', 1);
//}
//function drawSiblings(source){
//    drawparallel(source, siblingTree, siblingRoot, 'siblings', -1);
//}
//function drawAncestors(source){
//  draw(source, ancestorsTree, ancestorRoot, 'ancestor', -1);
//}
//function drawDescendants(source){
//  draw(source, descendantsTree, descendantRoot, 'descendant', 1);
//}
//function draw(source, tree, root, displayClass, direction){
//  var nodes = tree.nodes(root),
//      links = tree.links(nodes);
//  // Update links
//  var link = svg.selectAll("path.link." + displayClass)
//  
//      // The function we are passing provides d3 with an id
//      // so that it can track when data is being added and removed.
//      // This is not necessary if the tree will only be drawn once
//      // as in the basic example.
//      .data(links, function(d){ return d.target.id; });
//  // Add new links   
//  // Transition new links from the source's
//  // old position to the links final position
//  link.enter().append("path")
//      .attr("class", "link " + displayClass)
//      .attr("d", function(d) {
//        var o = { y: direction * (source.y0 + boxWidth/2), x: source.x0};
//        return transitionElbow({source: o, target: o});
//      });
//    
//  // Update the old links positions
//  link.transition()
//      .duration(duration)
//      .attr("d", function(d){
//        return elbow(d, direction);
//      });
//  
//  // Remove any links we don't need anymore
//  // if part of the tree was collapsed
//  // Transition exit links from their current position
//  // to the source's new position
//  link.exit()
//      .transition()
//      .duration(duration)
//      .attr("d", function(d) {
//        var o = { y: direction * (source.y + boxWidth/2), x: source.x};
//        return transitionElbow({source: o, target: o});
//      })
//      .remove();
//  // Update nodes    
//  var node = svg.selectAll("g.person." + displayClass)
//      
//      // The function we are passing provides d3 with an id
//      // so that it can track when data is being added and removed.
//      // This is not necessary if the tree will only be drawn once
//      // as in the basic example.
//      .data(nodes, function(person){ return person.id; });
//      
//  // Add any new nodes
//  var nodeEnter = node.enter().append("g")
//      .attr("class", "person " + displayClass)
//      // Add new nodes at the right side of their child's box.
//      // They will be transitioned into their proper position.
//      .attr('transform', function(person){
//        return 'translate(' + source.x0 + ',' + (direction * (source.y0 + boxWidth/2)) + ')';
//      })
//      .on('click', togglePerson);
//  // Draw the rectangle person boxes.
//  // Start new boxes with 0 size so that
//  // we can transition them to their proper size.
//    nodeEnter.append("rect")
//      .attr({
//        x: 0,
//        y: 0,
//        width: 0,
//        height: 0
//     });
//    // Draw the person's name and position it inside the box
//    nodeEnter.append("svg:image")
//      .attr("width", "60px")
//      .attr("height", "75px")
//      .attr("x", -105)
//      .attr("y",-40)
//      .attr("xlink:href", function(d) {
//          var img = d.image
//          return "data:image/jpg;base64,"+ img
//    })
//    nodeEnter.append("text")
//      .attr("dx", -40)
//      .attr("dy", -20)
//      .attr("text-anchor", "start")
//      .attr('class', 'name')
//      .text(function(d) { 
//        return d.name 
//    })
//    nodeEnter.append("text")
//      .attr("dx", -40)
//      .attr("dy", 0)
//      .attr('class', 'gender')
//      .text(function(d){
//          return "Gender:"+d.gender
//    })
//    nodeEnter.append("text")
//      .attr("dx", -40)
//      .attr("dy", 20)
//      .attr('class', 'age')
//      .text(function(d){
//          return "Age:"+d.age
//    })
//
//  // Update the position of both old and new nodes
//  var nodeUpdate = node.transition()
//      .duration(duration)
//      .attr("transform", function(d) { 
//          return "translate(" + d.x + "," + (direction * d.y) + ")";
//      });
//
//  // Grow boxes to their proper size    
//  nodeUpdate.select('rect')
//      .attr({
//        x: -(boxWidth/2),
//        y: -(boxHeight/2),
//        width: boxWidth,
//        height: boxHeight
//      });
//
//  // Move text to it's proper position
//  nodeUpdate.select('text')
//      //.attr("dx", -(boxWidth/2) + 10)
//      .style('fill-opacity', 1);
//  
//  // Remove nodes we aren't showing anymore
//  var nodeExit = node.exit()
//      .transition()
//      .duration(duration)
//      
//      // Transition exit nodes to the source's position
//      .attr("transform", function(d) { return "translate(" + source.x + "," + (direction * (source.y + boxWidth/2)) + ")";})
//      .remove();
//  
//  // Shrink boxes as we remove them    
//  nodeExit.select('rect')
//      .attr({
//        x: 0,
//        y: 0,
//        width: 0,
//        height: 0
//      });
//      
//  // Fade out the text as we remove it
//  nodeExit.select('text')
//      .style('fill-opacity', 0)
//      .attr('dx', 0);
//  
//  // Stash the old positions for transition.
//  nodes.forEach(function(person) {
//    person.x0 = person.x;
//    person.y0 = person.y;
//  });
//}
//
////Draw siblings...
//
//function drawparallel(source, tree, root, displayClass, direction){
//    var nodes = tree.nodes(root),
//        links = tree.links(nodes);
//    // Update links
//    var link = svg.selectAll("path.link." + displayClass)
//    
//        // The function we are passing provides d3 with an id
//        // so that it can track when data is being added and removed.
//        // This is not necessary if the tree will only be drawn once
//        // as in the basic example.
//    
//        .data(links, function(d){ return d.target.id; });
//    
//    // Add new links   
//    // Transition new links from the source's
//    // old position to the links final position
//    link.enter().append("path")
//        .attr("class", "link " + displayClass)
//        .attr("d", function(d) {
//          var o = {x: source.x0, y: direction * (source.y0 + boxWidth/2)};
//          return transitionparallelElbow({source: o, target: o});
//        });
//      
//    // Update the old links positions
//    link.transition()
//        .duration(duration)
//        .attr("d", function(d){
//          return parallelelbow(d, direction);
//        });
//    
//    // Remove any links we don't need anymore
//    // if part of the tree was collapsed
//    // Transition exit links from their current position
//    // to the source's new position
//    link.exit()
//        .transition()
//        .duration(duration)
//        .attr("d", function(d) {
//          var o = {x: source.x, y: direction * (source.y + boxWidth/2)};
//          return transitionparallelElbow({source: o, target: o});
//        })
//        .remove();
//    // Update nodes    
//    var node = svg.selectAll("g.person." + displayClass)
//        
//        // The function we are passing provides d3 with an id
//        // so that it can track when data is being added and removed.
//        // This is not necessary if the tree will only be drawn once
//        // as in the basic example.
//        .data(nodes, function(person){ return person.id; });
//        
//    // Add any new nodes
//    var nodeEnter = node.enter().append("g")
//        .attr("class", "person " + displayClass)
//        // Add new nodes at the right side of their child's box.
//        // They will be transitioned into their proper position.
//        .attr('transform', function(person){
//          return 'translate(' + (direction * (source.y0 + boxWidth/2)) + ',' + source.x0 + ')';
//        })
//        .on('click', togglePerson);
//    // Draw the rectangle person boxes.
//    // Start new boxes with 0 size so that
//    // we can transition them to their proper size.
//    nodeEnter.append("rect")
//        .attr({
//          x: 0,
//          y: 0,
//          width: 0,
//          height: 0
//        });
//    // Draw the person's name and position it inside the box
//    nodeEnter.append("svg:image")
//        .attr("width", "60px")
//        .attr("height", "75px")
//        .attr("x", -105)
//        .attr("y",-40)
//        .attr("xlink:href", function(d) {
//            var img = d.image
//            return "data:image/jpg;base64,"+ img
//    })
//    
//    nodeEnter.append("text")
//        .attr("dx", -40)
//        .attr("dy", -20)
//        .attr("text-anchor", "start")
//        .attr('class', 'name')
//        .text(function(d) { 
//          return d.name 
//    })
//    nodeEnter.append("text")
//        .attr("dx", -40)
//        .attr("dy", 0)
//        .attr('class', 'gender')
//        .text(function(d){
//            return "Gender:"+d.gender
//    })
//    nodeEnter.append("text")
//        .attr("dx", -40)
//        .attr("dy", 20)
//        .attr('class', 'age')
//        .text(function(d){
//            return "Age:"+d.age
//    })
//
//    // Update the position of both old and new nodes
//    var nodeUpdate = node.transition()
//        .duration(duration)
//        .attr("transform", function(d) { return "translate(" + (direction * d.y) + "," + d.x + ")"; });
//        
//    // Grow boxes to their proper size
//    nodeUpdate.select('rect')
//        .attr({
//          x: -(boxWidth/2),
//          y: -(boxHeight/2),
//          width: boxWidth,
//          height: boxHeight
//        });
//    
//    // Move text to it's proper position
//    nodeUpdate.select('text')
//        //.attr("dx", -(boxWidth/2) + 10)
//        .style('fill-opacity', 1);
//    
//    // Remove nodes we aren't showing anymore
//    var nodeExit = node.exit()
//        .transition()
//        .duration(duration)
//        
//        // Transition exit nodes to the source's position
//        .attr("transform", function(d) { return "translate(" + (direction * (source.y + boxWidth/2)) + "," + source.x + ")"; })
//        .remove();
//    
//    // Shrink boxes as we remove them    
//    nodeExit.select('rect')
//        .attr({
//          x: 0,
//          y: 0,
//          width: 0,
//          height: 0
//        });
//        
//    // Fade out the text as we remove it
//    nodeExit.select('text')
//        .style('fill-opacity', 0)
//        .attr('dx', 0);
//    
//    // Stash the old positions for transition.
//    nodes.forEach(function(person) {
//      person.x0 = person.x;
//      person.y0 = person.y;
//    });
//  }
//
//  function parallelelbow(d, direction) {
//      var sourceX = d.source.x,
//          sourceY = d.source.y + (boxWidth / 2),
//          targetX = d.target.x,
//          targetY = d.target.y - (boxWidth / 2);
//          
//      return "M" + (direction * sourceY) + "," + sourceX
//        + "H" + (direction * (sourceY + (targetY-sourceY)/2))
//        + "V" + targetX 
//        + "H" + (direction * targetY);
//    }
//
//  function transitionparallelElbow(d){
//    return "M" + d.source.y + "," + d.source.x
//      + "H" + d.source.y
//      + "V" + d.source.x 
//      + "H" + d.source.y;
//  }
//
//  
///**
// * Update a person's state when they are clicked.
// */
//function togglePerson(person){
//  // Figure out of the root node was clicked. Remember
//  // we have two proxy root nodes so we have handle both.
//  if(person === ancestorRoot || person === descendantRoot || person === siblingRoot || person === spouseRoot){
//    if(ancestorRoot.collapsed){
//      ancestorRoot.collapsed = false;
//      descendantRoot.collapsed = false;
//      siblingRoot.collapsed = false;
//      spouseRoot.collapsed = false;
//    } else {
//      collapse(ancestorRoot);
//      collapse(descendantRoot);
//      collapse(siblingRoot);
//      collapse(spouseRoot);
//    }
//    drawDescendants(descendantRoot);
//    drawAncestors(ancestorRoot);
//    drawSiblings(siblingRoot);
//    drawSpouse(spouseRoot);
//  }
//  // Non-root nodes
//  else {
//  
//    if(person.collapsed){
//      person.collapsed = false;
//    } else {
//      collapse(person);
//    }
//    
//    // Figure out which tree the person belongs too.
//    // Don't need to redraw when leaf nodes are
//    // toggled because they don't expand or collapse,
//    // therefore we don't account for them.
//    if(person._children){
//      drawDescendants(person);
//    } else if(person._parents){
//      drawAncestors(person);
//    } else if(person._sblings){
//        drawSiblings(person);
//    } else if (person._spouse){
//        drawSpouse(person);
//    }
//  }
//}
///**
// * Collapse person (hide their ancestors). We recursively
// * collapse the ancestors so that when the person is
// * expanded it will only reveal one generation. If we don't
// * recursively collapse the ancestors then when
// * the person is clicked on again to expand, all ancestors
// * that were previously showing will be shown again.
// * If you want that behavior then just remove the recursion
// * by removing the if block.
// */
//function collapse(person){
//  person.collapsed = true;
//  if(person._parents){
//    person._parents.forEach(collapse);
//  }
//  if(person._children){
//    person._children.forEach(collapse);
//  }
//}
//    
///**
// * Custom path function that creates straight connecting
// * lines. Calculate start and end position of links.
// * Instead of drawing to the center of the node,
// * draw to the border of the person profile box.
// * That way drawing order doesn't matter. In other
// * words, if we draw to the center of the node
// * then we have to draw the links first and the
// * draw the boxes on top of them.
// */
//function elbow(d, direction) {
//  var sourceX = d.source.x,
//      sourceY = d.source.y + (boxWidth / 2),
//      targetX = d.target.x,
//      targetY = d.target.y - (boxWidth / 2);
//      
//  return "M" + sourceX + "," + (direction * sourceY)
//  + "V" + ((sourceY + (targetY-sourceY)/2) * direction)
//  + "H" + targetX 
//  + "V" + (direction * targetY);
//}
///**
// * Use a different elbow function for enter
// * and exit nodes. This is necessary because
// * the function above assumes that the nodes
// * are stationary along the x axis.
// */
//function transitionElbow(d){
//return "M" + d.source.x + "," + d.source.y
//+ "V" + d.source.y
//+ "H" + d.source.x 
//+ "V" + d.source.y;
//}
//});
});
