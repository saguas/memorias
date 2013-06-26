
var sub = Meteor.subscribe("maptree");

//var sub = Meteor.subscribe("flare");
Session.set("maptree ready",false);
Session.set("zoom", true);
Session.set("refresh", true);
//Session.set("social", false);



Deps.autorun(function () {

    var subpost = Meteor.subscribe("posts", Session.get("docid"));
    
    if(subpost.ready())
        Session.set("postready",true);
    
        if (sub.ready() ) {//pronto apenas quando estiver todos os dados no cliente
            // Now do something every time the subscription is marked as ready
            //console.log("maptree ready");
            Session.set("maptree ready",true);
        }

    });

/*
Template.tablesNews.rendered = function () {

	$("a").tooltip();
}*/


Template.postsList.rendered = function () {
  var self = this;
  //self.node = self.find(".label");


  	//$(self.node).tooltip();

  	if (! self.handle) {


		//self.lastobj = {id: -1,name:"", children:[]};  		
		mapTree(self);

		if(Session.equals("maptree ready", true))
			self.timeInterval = Meteor.setInterval(function(){
	   							Session.set("refresh", !Session.equals("refresh",true));
	   					}, 1000*10);
		    
	}
};

Template.postsList.destroyed = function () {
  this.handle && this.handle.stop();
  Meteor.clearInterval(this.timeInterval);
  Session.set("refresh", true);
};

//Template.newsboard.rendered = function () {

//var self = this;

//console.log("facebook before ", document);

//twitter

	//if(!self.social){
    /*
		self.social = true;

        
		(function(d,s,id)
		{
			var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
			if(!d.getElementById(id))
			{
				js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';
				fjs.parentNode.insertBefore(js,fjs);
			}
		}(document, 'script', 'twitter-wjs'));

		//facebook

		(function(d, s, id) {

			  //console.log("facebook enter ", document);
			  var js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return;
			  js = d.createElement(s); js.id = id;
			  js.src = "//connect.facebook.net/pt_PT/all.js#xfbml=1&appId=367953603288735";
			  fjs.parentNode.insertBefore(js, fjs);
			  //Session.set("social", true);

			}(document, 'script', 'facebook-jssdk'));
            
            
*/
	//}


//}
/*
Template.newsboard.destroyed = function () {
  this.social=false;
};
*/

Template.newsboard.social = function(){ 
		//console.log("Session.get(social) ", Session.get("social"));
		return Session.get("social");
};

/*
Handlebars.registerHelper('pageactuals', function() {

		var tmpl = Session.get("pageActual");
		//console.log("Session.get(pageActual) ", Session.get("pageActual"));
		if (Template[tmpl]){ //verifica se há um template com o node dado por this.pag            
            return Template[tmpl]();//chama o template registado com o nome de this.page
        }
});
*/

/*
Template.pageactual.page = function(){
	
	var tmpl = Session.get("pageActual");
		//console.log("Session.get(pageActual) ", Session.get("pageActual"));
		if (Template[tmpl]){ //verifica se há um template com o node dado por this.page            
	        return Template[tmpl]();//chama o template registado com o nome de this.page
	    }
}*/

Template.loggedInLayout.events({
    'click #myhomess': function(event) {

            /*
            var curtxt = $(event.currentTarget).text();
    		console.log("click home ", curtxt);
            if(curtxt == "Home" ){
                Session.set("loggedin",false);
                Meteor.go("/");
            }*/
        
            Session.set("loggedin",false);
            Meteor.go("/");
    		//event.preventDefault();
     },
    
    'click .brand': function(event) {

            event.preventDefault();
    		
     }
    
  });

Template.votacoes.events({
    'click #btnfacebooks': function(event) {

    		//Facebook Feed
    		   		
			//FB.init({appId: "367953603288735", status: true, cookie: true});

			// calling the API ...
		    var obj = {
		      method: 'feed',
		      //redirect_uri: 'http://localhost:3000/' + "memorias/personalidades/socrates",
		      //link: 'http://handlebarsjs.com',
		      picture: 'http://fbrell.com/f8.jpg',
		      name: 'Memórias Page',
		      caption: 'Memórias Page Rock',
		      description: 'Using Dialogs to interact with people.'
		    };

		    function callback(response) {
		      //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
		    }

		    FB.ui(obj, callback);  
		    
		}
    });

function makeMapTree(arrnodes, self){

		var myid = 1;
		//var links = [];
		var myobj = {id:myid,name:"Memórias", children:[]};
		var i = 0;
		var tmparr = [];
		var depth = 0;
		var maxVotos = 0;

		//console.log("arrnodes ",arrnodes);
		//_.each(arrnodes,function(obj, idx){
			arrnodes.forEach(function(obj){
				//coloca a path em forma de array e retorna todos os elementos do array excepto o último que corresponde ao artigo
				var path = obj.path.split("/");//_.initial(obj.path.split(":"));
				//console.log("path ",path);
				var childtmp = myobj.children;//aponta para a children raíz
				
				
				//console.log("childtmp1 ", childtmp);
				_.each(path,function(val,idx){

							var where = _.findWhere(childtmp,{name:val});
							
							//_.each(myobj.children, function(obj,idx){
							if(where){//verifica se já existe essa categoria
								//console.log("where ", where);
								childtmp = where.children;								
							}else{//caso não exista, cria uma nova categoria
								myid++;
								depth++;
								childtmp.push({id: myid,name:val, children:[]});//retorna o children agora criado


								childtmp = _.last(childtmp).children;

								//console.log("childtmp2 ", childtmp);
							}

							//	});
						
				});

				//Verifica qual o mais votado
				var maxVotosTmp = obj.votos;
				var newobj = {_id:obj._id,id:obj._id._str,name: obj.nome,votos:obj.votos,size:obj.size,path:obj.path + "/" +obj.nome};

				if(maxVotos < maxVotosTmp){
					self.arrVotos = newobj;//childtmp;
					maxVotos = maxVotosTmp;
				}

				childtmp.push(newobj);
				
			});

		//console.log("depth ", depth);
		myid++;

		//getDeepChildrens(myobj,depth, myid, self);


		if(true)
		{
			Session.get("refresh"); 
			myid = shuffle_V2(myobj,depth, myid, self);
			shuffle_votos(myobj,maxVotos, myid, self);			
		}
		
		/*
		if(!Session.equals("refresh",true)){
			myobj.children.push(self.lastobj);
			console.log("refresh ", self.lastobj);
		}
		else{
			shuffle_V2(myobj,depth, myid, self);
			console.log("refresh ", true);
		}*/

		self.changeDocs = false;

		return myobj;
}

//escolhe um dos elementos aleatoriamente
function shuffle_V2(myobj,depth, nextid, self){
	
	var idxdepth;
	var objfirst;
	var myobjfirst;
	var arrObjs;
	var lastname;
	var len = 0;


	//verifica se os documentos foram alterados. Caso sim, guarda os elementos com children em self
	//Caso não, obtém os elementos com childrem do self e escolhe um desses elementos aleatoriamente para fazer parate do root
	//Isto para tornar eficiente o programa e não estar sempre a ordenar os elementos. 
	if(!self.arrObjs || self.changeDocs){
		arrObjs = getDeepChildrens(myobj, nextid, self);
		self.arrObjs = deepCopy(arrObjs);
		//console.log("arrObjs não existe ainda no self ", self.arrObjs);
	}else{
		arrObjs = self.arrObjs;
		//console.log("arrObjs já existe no self ");
	}

	len = arrObjs.length;
	
	//do{
		idxdepth = _.random(2,len-1);//Math.floor(Math.random()*len);

		objfirst = arrObjs[idxdepth];
		
		//if(objfirst.depth < 1)
			//continue;

		lastname = objfirst.obj.name;
		objfirst = objfirst.obj.children;		
		//break;

	//}while(true);

	nextid++;
	myobjfirst = deepCopy(objfirst);
	
	changeField(myobjfirst, nextid);
	nextid++;
	
	//console.log("newObj ", myobjfirst);
	myobj.children.push({id: nextid,name:lastname, children:myobjfirst});

	return nextid;
	//self.lastobj = {id: nextid,name:lastname, children:myobjfirst};

}

//escolhe o elemento mais votado
function shuffle_votos(myobj,maxVotos, nextid, self){
	
	var objfirst;
	var myobjfirst;
	var arrVotos;
	//var lastname;


	
	arrVotos = self.arrVotos;
	
	//console.log("o mais votado é: ", arrVotos);

	/*objfirst = _.find(arrVotos,function(obj){					
					return obj.votos == maxVotos;
				});
	*/
	objfirst = arrVotos;
	//myobjfirst = objfirst;
	
	//lastname = objfirst.name;
	//objfirst = objfirst.obj.children;		
	//break;

	nextid++;
	myobjfirst = _.clone(objfirst);//deepCopy(objfirst);
	
	//changeField(myobjfirst, nextid);
	myobjfirst.id = objfirst.id + nextid;//nextid;
	myobjfirst.size = myobjfirst.size*3;
	nextid++;

	//console.log("mais votado ", myobjfirst);
	
	myobj.children.push({id: myobjfirst.id + nextid,name:"+ votado: " + objfirst.votos, children:[myobjfirst]});
	//console.log("newObj ", myobj);
	//self.lastobj = {id: nextid,name:lastname, children:myobjfirst};

}

//obtém todos os elementos com childrens
function getDeepChildrens(myobj, nextid, self){
		
		var objfirst = myobj.children;
		var arrObjs = new Array();
		var i = -1;
		var len = 1;
		//var ciclo = true;


		do{
			
				_.each(objfirst, function(obj, idx){
						

						if (_.has(obj,"children")){
							
							len = arrObjs.push({depth: i + 1,obj:obj});//regista o depth para saber quais apresentar por estarem escondidos
							//console.log("arrObjs in each ", arrObjs.length);
																
						}

				});

				i++;

				if(i < len){	
					objfirst = arrObjs[i].obj.children;
				}else
					break;//ciclo = false;

				//console.log("objfirst children ", objfirst);


		}while(true);

		//console.log("Todos os childrens %o len %d", arrObjs,len);

		//self.arrObjs = arrObjs;

		return arrObjs;

}

deepCopy = function(objfirst){

	var myobjfirst = new Array();

	_.each(objfirst, function(obj){
			var newObj = {};
			jQuery.extend(true, newObj, obj);
			myobjfirst.push(newObj);
		});

	return myobjfirst;
}

//altera o id do novo objecto 
changeField = function (objfirst, nextid){

			console.log("recursion!!");

			_.each(objfirst,function(obj){
					if(_.has(obj,"children")){

						//console.log("haschildrens");
						//console.log("obj id changeField ",obj.id);
						obj.id = obj.id + nextid;
						nextid++;
						changeField(obj.children, nextid);
					}else{						
						obj.id = obj.id + nextid;	
						nextid++;
					}
					
				});
}


function removeForce(svg){

	d3.selectAll("svg").remove();
	//d3.selectAll("svg").remove();
	//d3.selectAll(".link").remove();
	//d3.selectAll(".node").remove();

}


function mapTree(self){

			self.node = self.find("div.chart");
			var containerW = self.node.offsetWidth;
		    var containerH = self.node.offsetHeight;

		    var chartWidth = containerW-containerW*20/100;//document.width;//780 - 80;
		    var chartHeight = containerH-containerH*20/100;//800 - 180;
		    var xscale = d3.scale.linear().range([0, chartWidth]);
		    var yscale = d3.scale.linear().range([0, chartHeight]);
		    var color = d3.scale.category10();
		    var headerHeight = 20;
		    var headerColor = "#555555";
		    var transitionDuration = 500;
		    var root;
		    var node;


		self.docs = 0;
		self.changeDocs = false;
		  
		self.handle = Deps.autorun(function (mydeps) {



		    if(Session.get("zoom")){
		    //if(inzoom){
		    		

		    	//console.log("Session maptree ready ", Session.get("maptree ready"));

		    	if(Session.get("maptree ready")){

	    			var svgs = d3.select(self.node);
		    		removeForce(svgs);

		    			
		    			maptr = MapTree.find({});
		    			//maptr = Flare.find({});
		    			//makeMapTree2();
		    			var counts = maptr.count();

		    			if(self.docs != counts){
		    				self.docs = counts;
		    				self.changeDocs = true;
		    			
		    			}else{
		    				self.changeDocs = false;
		    			}
		    			//console.log("count docs ", self.counts);
		    			//makeMapTree2(maptr);
                   //maptr = maptr.fetch();
                        //console.log("maptr ", maptr);
		    			node = root = makeMapTree(maptr, self);

				    	var treemap = d3.layout.treemap()
				            .round(false)
				            .size([chartWidth, chartHeight])
				            .sticky(true)
				            .mode("squarify")
				            .padding([headerHeight + 1, 1, 1, 1])
				            .value(function(d) {
				            	//console.log("init ",d.size);
				                return d.size;
				            });

			        var chart = d3.select(self.node)
				            .append("svg:svg")
				            .attr("width", chartWidth)
				            .attr("height", chartHeight);
				         
		    		   		
		    		   	//maptr = MapTree.find({}).fetch();
		    			//console.log("nodes maptree ",maptr);

		    			//console.log("self.node ",self.node);		    	
		    			
			            chart.append("svg:g");
					
			    		//console.log("chart ",chart);
			    		//var chart = svgs.append("svg:g").attr("transform", "translate(.5,.5)");

		    			//console.log("nodes maptree ",maptr);
		    			
		    			//node = root = makeMap(maptr);
		    			
		    			//node = root = makeMapTree(maptr);
		    			
		    			//console.log("node and root maptree ",node);

		    			var nodes = treemap.nodes(root);

		    			var children = nodes.filter(function(d) {
				            return !d.children;
				        });
				        var parents = nodes.filter(function(d) {
				            return d.children;
				        });

				        // create parent cells
				        var parentCells = chart.selectAll("g.cell.parent")
				                .data(parents, function(d) {
				                    return "p-" + d.id;
				                });
				        var parentEnterTransition = parentCells.enter()
				                .append("g")
				                .attr("class", "cell parent")
				                .on("click", function(d) {
				                	Session.set("zoom", false);
				                	//inzoom = false;
				                	//console.log("parentEnterTransition");
				                    zoom(d);
				                });
				        parentEnterTransition.append("rect")
				                .attr("width", function(d) {
				                    return Math.max(0.01, d.dx - 1);
				                })
				                .attr("height", headerHeight)
				                .style("fill", headerColor);
				        parentEnterTransition.append('text')
				                .attr("class", "label")
				                .attr("transform", "translate(3, 13)")
				                .attr("width", function(d) {
				                    return Math.max(0.01, d.dx - 1);
				                })
				                .attr("height", headerHeight)
				                .text(function(d) {
				                	//console.log("nome dos childrens ",d.name);
				                    return d.name;
				                });
				        // update transition
				        var parentUpdateTransition = parentCells.transition().duration(transitionDuration);
				        parentUpdateTransition.select(".cell")
				                .attr("transform", function(d) {
				                    return "translate(" + d.dx + "," + d.y + ")";
				                });
				        parentUpdateTransition.select("rect")
				                .attr("width", function(d) {
				                    return Math.max(0.01, d.dx - 1);
				                })
				                .attr("height", headerHeight)
				                .style("fill", headerColor);
				        parentUpdateTransition.select(".label")
				                .attr("transform", "translate(3, 13)")
				                .attr("width", function(d) {
				                    return Math.max(0.01, d.dx - 1);
				                })
				                .attr("height", headerHeight)
				                .text(function(d) {
				                	//console.log("nome dos childrens ",d.name);
				                    return d.name;
				                });
				        // remove transition
				        parentCells.exit()
				                .remove();

				        // create children cells
				        var childrenCells = chart.selectAll("g.cell.child")
				                .data(children, function(d) {
				                    return "c-" + d.id;
				                });
				        // enter transition
				        var childEnterTransition = childrenCells.enter()
				                .append("g")
				                .attr("class", "cell child")
				                .on("click", function(d) {
				                	//Session.set("zoom", !Session.get("zoom"));
				                	//inzoom = !inzoom;
				                	//inzoom = false;
				                	if (node === d.parent){
				                	 	//inzoom = true;
				                	 	Session.set("zoom",true);
				                	 }else{
				                	 	//inzoom = false;
				                	 	Session.set("zoom",false);
				                	 }

				                	 //$('.tooltip').tooltip();
				                	//console.log("inzoom ", inzoom);

				                	//console.log("Deps.currentComputation ");
				                    zoom(node === d.parent ? root : d.parent);
				                    //Deps.flush();
				                });
				                
				        childEnterTransition.append("rect")
				                .classed("background", true)
				                .style("fill", function(d) {
				                    return color(d.parent.name);
				                });
				        childEnterTransition.append('text')
				                .attr("class", "label")
				                .attr('x', function(d) {
				                    return d.dx / 2;
				                })
				                .attr('y', function(d) {
				                    return d.dy / 2;
				                })
				                .attr("dy", ".35em")
				                .attr("text-anchor", "middle")
				                //.attr("rel","tooltip")
				                .style("display", "none")
				                .text(function(d) {
				                    return d.name;
				                    //return "<a href='#' rel='tooltip' title='first tooltip'>" + d.name + "</a>";
				                }).on("click", function(d) {
				                	console.log("dblclick name ", this);
				                	//router.changePage("memorias/" + d.parent.name+"/"+d.name);
				            //router.changePage("memorias/" + d.path);
                                    Session.set("loggedin", true);
                                    //Session.set("objid",d._id);
                                    Meteor.go("/memorias/" + d.path +"/",{_id:d._id});
                                    
				                }).on("mouseover", function(d) {
				                	console.log("dblclick name ",$(this) );

				                	//$('text').tooltip();
				                	//console.log(".label ", $(".label").tooltip());
				                });/*
				                .style("opacity", function(d) {
				                    d.w = this.getComputedTextLength();
				                    return d.dx > d.w ? 1 : 0;
				                });*/
				        // update transition
				        var childUpdateTransition = childrenCells.transition().duration(transitionDuration);
				        childUpdateTransition.select(".cell")
				                .attr("transform", function(d) {
				                    return "translate(" + d.x  + "," + d.y + ")";
				                });
				        childUpdateTransition.select("rect")
				                .attr("width", function(d) {
				                    return Math.max(0.01, d.dx - 1);
				                })
				                .attr("height", function(d) {
				                    return (d.dy - 1);
				                })
				                .style("fill", function(d) {
				                    return color(d.parent.name);
				                });
				        childUpdateTransition.select(".label")
				                .attr('x', function(d) {
				                    return d.dx / 2;
				                })
				                .attr('y', function(d) {
				                    return d.dy / 2;
				                })
				                .attr("dy", ".35em")
				                .attr("text-anchor", "middle")
				                //.style("display", "none")
				                .text(function(d) {
				                    return d.name;
				                    //return "<a href='#' rel='tooltip' title='first tooltip'>" + d.name + "</a>";
				                });/*
				                .style("opacity", function(d) {
				                    d.w = this.getComputedTextLength();
				                    return d.dx > d.w ? 1 : 0;
				                });*/

				        // exit transition
				        childrenCells.exit()
				                .remove();

				        d3.select("select").on("change", function() {
				            console.log("select zoom(node)");
				            treemap.value(this.value == "size" ? size : count)
				                    .nodes(root);
				            zoom(node);
				        });

                        //console.log("zoom(node) ", node);
                
				        //zoom(node);
		    			

		    			function size(d) {
					        return d.size;
					    }


					    function count(d) {
					        return 1;
					    }


					    //and another one
					    function textHeight(d) {
					        var ky = chartHeight / d.dy;
					        yscale.domain([d.y, d.y + d.dy]);
					        return (ky * d.dy) / headerHeight;
					    }

					    function getRGBComponents (color) {
					        var r = color.substring(1, 3);
					        var g = color.substring(3, 5);
					        var b = color.substring(5, 7);
					        return {
					            R: parseInt(r, 16),
					            G: parseInt(g, 16),
					            B: parseInt(b, 16)
					        };
					    }


					    function idealTextColor (bgColor) {
					        var nThreshold = 105;
					        var components = getRGBComponents(bgColor);
					        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
					        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
					    }


					    function zoom(d) {
                            
					        treemap
					                .padding([headerHeight/(chartHeight/d.dy), 0, 0, 0])
					                .nodes(d);

					        // moving the next two lines above treemap layout messes up padding of zoom result
					        var kx = chartWidth  / d.dx;
					        var ky = chartHeight / d.dy;
					        var level = d;

					        xscale.domain([d.x, d.x + d.dx]);
					        yscale.domain([d.y, d.y + d.dy]);

					        if (node != level) {
					            chart.selectAll(".cell.child .label").style("display", "none");
					        }

					        var zoomTransition = chart.selectAll("g.cell").transition().duration(transitionDuration)
					                .attr("transform", function(d) {
					                    return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")";
					                })
					                .each("start", function() {
					                	//console.log("this ",d3.select(this));
					                    d3.select(this).select("label")
					                            .style("display", "none");

					                    
					                    //console.log("start ");
					                })
					                .each("end", function(d, i) {
					                    if (!i && (level !== root/*self.root*/)) {

					                        chart.selectAll(".cell.child")
					                            .filter(function(d) {
					                            	//console.log("end trans ",d.parent === node);
					                                return d.parent === node/*self.node*/; // only get the children for selected group
					                            })
					                            .select(".label")
					                            .style("display", "")
					                            .style("fill", function(d) {
					                            	//console.log("helloooo ",d);
					                            	//console.log("idealTextColor(color(d.parent.name) ",idealTextColor(color(d.parent.name)));
					                                return idealTextColor(color(d.parent.name));
					                            });
					                          //console.log("this ",$(this));
					                         //$(this).tooltip();
					                    }
					                });

					        zoomTransition.select(".label")
					                .attr("width", function(d) {
					                    return Math.max(0.01, (kx * d.dx - 1));
					                })
					                .attr("height", function(d) {
					                    return d.children ? headerHeight: Math.max(0.01, (ky * d.dy - 1));
					                })
					                //.attr("rel","tooltip")
					                .text(function(d) {
					                	//console.log("text em zoom ",d.name);
					                    return d.name;//este é que coloca o nome!!!
					                    //return "<a href='#' rel='tooltip' title='first tooltip'>" + d.name + "</a>";
					                });

					        zoomTransition.select(".child .label")
					                .attr("x", function(d) {
					                    return kx * d.dx / 2;
					                })
					                .attr("y", function(d) {
					                    return ky * d.dy / 2;
					                });

					        // update the width/height of the rects
					        zoomTransition.select("rect")
					                .attr("width", function(d) {
					                    return Math.max(0.01, (kx * d.dx - 1));
					                })
					                .attr("height", function(d) {
					                    return d.children ? headerHeight : Math.max(0.01, (ky * d.dy - 1));
					                })
					                .style("fill", function(d) {
					                    return d.children ? headerColor : color(d.parent.name);
					                });

					        node = d;

					        if (d3.event) {
					            d3.event.stopPropagation();
					        }
					    }
                    
                    zoom(node);

					  	//cell.on("dblclick", function(d) { console.log("dblclick ",d.name); });		
				}	
			}
		});

}


