var addthis_config;
var addthis_config = {"data_track_addressbar":true};
var barTimeout;
var addthis_share = {"data_track_addressbar":true, email_template:"memorias",
                        email_vars: { descricao: "A customized value" , note:"Minhas notas"}
                    };

Meteor.startup(function() {
    console.log("Mini Page router started");   
    Session.set("displayMedia","");
    
});


Handlebars.registerHelper("navClassFor", function (nav, options) {
    return Meteor.router.navEquals(nav) ? "active" : "";
      //return Session.equals("nav",nav) ? "active" : "";
});

Handlebars.registerHelper("docsHandle", function (nav, options) {
    return Session.get("docs");
      //return Session.equals("nav",nav) ? "active" : "";
});

Handlebars.registerHelper("docnome", function (nav, options) {
    return Session.get("docnome");
      //return Session.equals("nav",nav) ? "active" : "";
});


routers = Meteor.pages({
    '/': { to: 'postsList', as: 'root', before: setLayout, nav: 'home' },
    //'/posts': { to: 'postIndex', as: 'postIndex', before: setLayout, nav: 'home' },
    '/memorias/:id/*/': { to: 'newsboard', as:'Documentos', before: [checkIfRedirect,setLayout,setPost,getDoc,isAuthorized], nav: 'docs' },
    '/memorias/reveal/': { to: 'docsSlideshow', as:'SlideShow', before: [mylayout,setPost,getDoc,isAuthorized], nav: 'slideshow' },
    '/memorias/pageTransitions/': { to: 'pageSlideshow', as:'PageSlideShow', before: [mylayout,isAuthorized], nav: 'docs' },
    '/secret': { to: 'secret', before: [setLayout, authorizeSecret], nav: 'secret' },
    '/401': { to: 'unauthorized', before: setLayout },
    '*': { to: 'notFound', before: setLayout }
});


function checkIfRedirect(obj){
    
    //console.log("obj ",obj.context);
    
    var querystring = obj.context.querystring;
    
    var page = querystring.match(/page=\d+/);//procura por page

    console.log("check redirect page %s querystring %s ", page,querystring);
    
    if (page){//se a querystring contiver page= então é para redirecionar 
       //getObjId(obj);
       this.redirect("/memorias/PageTransitions/?"+querystring, {orinQuerystring:obj.context.querystring,orinPath: obj.context.pathname, selected: undefined});
    }
    //if (querystring === "")
}
//routers.autoStart(); 

//obtém o caminho dos documentos pretendidos e o nome do tema ou rubrica pretendida
function getDoc(obj){
    var path = obj.context.pathname;
    var querystring = obj.context.querystring;
    
    console.log("context ", obj ? obj : "");
    Session.set("loggedin", true);
    Session.set("docs", obj? path + "?" + querystring : "");//caminho dos documentos pretendidos
    var lastname = _.compact(path.split("/"));
    //console.log("lastname ",_.unescape(_.last(lastname)));
    Session.set("docnome",unescape(_.last(lastname)));//nome da rubrica para este caminho
}

function isAuthorized (obj,page) {
    
    //if(!Session.get("loggedin"))
      //  Meteor.go("/");
    //Session.set("loggedin",true);
    //routers.start();
    //if(this.context)
        //this.redirect("/memorias/personalidades/socrates");
    
    //Session.set("loggedin", true);
    //if(obj)
        //routers.redirect(obj.context.path);
    //console.log("isAuthorized ", this ? this : "não há obj");
    return Session.get("loggedin");
  }

  function setPost (obj) {
    //var path = obj.context.path;
    
      
      //this.redirect("/memorias/PageTransitions/?page=2");
      
      //var objid = getObjId(path);
    
    //var objid = getObjId(obj);
    getObjId(obj);
      /*
    if(objid){
        Session.set("docid",objid._id);
        Session.set("tag",objid.tag);
    }*/
    
     //verifyInput(null, null);
      Session.set("displaySearch", true);
      
      resetSearch();
        //Session.set("post", Posts.find({id:objid._id}));
      
    //console.log("post ",Session.get("post"));
  }

function mylayout(obj){
    
    var context = obj.context;
    //var objid = getObjId(obj);
    
    //verifica se é um pedido legitimo de página. Ou é vindo de twitter ou outros ou da própria página
    if (!context.state.orinPath || !context.querystring)
        this.redirect("/");
    else{  
        console.log("context em mylayout %o docid %o ", context, Session.get("docid"));
        
        
        
        /*if(context.state._id){
            Session.set("currentDocId",context.state._id);
            //console.log("context em mylayout id ",context.state._id._str);
        }*/
        
        this.layout('layoutReveal');
        
        context.pathname = context.state.orinPath;
        context.querystring = context.state.orinQuerystring;
        
        var page = context.querystring.match(/page=\d+/);//procura por page
        //var pagenum;
        //console.log("page = ", page);
        //if(page)
        var pagenum = page[0].match(/\d+/);
        
        //console.log("pagenum = ", pagenum[0]);
        Session.set("currentDocId", pagenum[0]);
        
        //console.log("obj mylayout ",obj);
        
        getObjId(obj);
        getDoc(obj);
    }
}

  function setLayout (context) {
    if (isAuthorized())
      this.layout('loggedInLayout');
    else
        this.layout('layout');
      
  }

  function authorizeSecret (context, page) {
    if (!Session.get("secret")) {
      context.redirect(Meteor.unauthorizedPath());
    }
  }

Template.mediaSub.helpers({
    displayMedia: function () {
        //console.log("chamado displayMedia ", this);
        
        return Session.equals("displayMedia",this.tag) || Session.equals("displayMedia", "")  ? "" : "none";
        
        //return Session.get("post");
        //return postsData;
    }
  });

 Template.mediaNews.helpers({
    post: function () {
        //console.log("chamado post ",Session.get("post"));
        //return Posts.find({id:Session.get("docid")});
        return Posts.find();
        //return Session.get("post");
        //return postsData;
    }
  });

 Template.tablesNews.helpers({
    post: function () {
        //console.log("chamado post ",Session.get("post"));
        //return Posts.find({id:Session.get("docid")});
        return Posts.find();
        //return Session.get("post");
        //return postsData;
    },
    profile: function(){return Session.get("profile");},
    
  });

Template.searchBox.helpers({
     displaySearch: function(){
        return Session.get("displaySearch");
     },
    search: function(){
            var arrtags = [];
            var arrObjs = [];
        
             //Posts.find({id:Session.get("docid")}).forEach(function(obj){
             Posts.find().forEach(function(obj){
                    console.log("ids %s tag %s ",obj._id._str, obj.tag);
                 
                    arrObjs.push({tag:obj.tag, id:obj._id._str});// garda o objecto para relacionar a pesquisa com o tag
                    arrtags.push(obj.tag);//guarda as tags para o dropdown
             });
            Session.set("tagids", arrObjs);
            console.log("tags ", EJSON.stringify(arrtags));
            return EJSON.stringify(arrtags);//arrtags;//Session.get("tag");
    }
});

Template.loggedInLayout.events({
        'click .close': function(event, tmpl) {
            $(".containers").slideUp(function(){
                //$(".btnSocial").slideDown('slow'); 
                $(".btnSocial").show('slow'); 
           });
            
            Meteor.clearTimeout(barTimeout);
        },
    
        'click .vertButton': function(event, tmpl) {
            $(".btnSocial").hide('fast',function(){
               
                $(".containers").slideDown('slow', function(){
                    barTimeout = Meteor.setTimeout(stopTopBar,1000*5); 
                 });
                
           });
            
        },
    
        'mouseenter .containers': function(event, tmpl) {
            console.log("mouseenter ");
            Meteor.clearTimeout(barTimeout);
        },
    
        'mouseleave .containers': function(event, tmpl) {
            console.log("mouseleave ");
            barTimeout = Meteor.setTimeout(stopTopBar,1000*5);
        }
    
});

Template.mediaNews.rendered = function(){
        
    var htmlModal = Meteor.render(function () {
        //console.log("dentro de render ");
        return Template.modalNews(Session.get("modal"));    
    });
        
    if($("#myModal").length == 0)
        $("#myTabContent").append(htmlModal);  
        
        $('#myModal').on('hidden', function () {
          // do something…
           //console.log("inside modal hidden event ", this);
           //$(this).remove();
        });
};

Template.mediaNews.destroyed = function(){
   
}

Template.mediaSub.events({
   'click a[href="#myModal"]' : function(event){
       var id = $(event.target).attr("ids");
       console.log("click myModal %o id: %s", new Meteor.Collection.ObjectID(id), id);
       //var htmlModal = Template.modalNews(Posts.findOne({_id:(new Meteor.Collection.ObjectID(id))}));
       //console.log("htmlModal ", htmlModal);
       Session.set("modal",Posts.findOne({_id:(new Meteor.Collection.ObjectID(id))}));
       //$(event.target).append(htmlModal);
       //$(event.target).parents('div:eq(0)').append(htmlModal);  
       
       //$("#myTabContent").append(htmlModal);  
       
       
       //event.preventDefault();
   },
    'click #btnsSlideShow' : function(event){
        console.log("this? ",routers.path());
        var path = routers.path();
         //Meteor.go("/memorias/PageTransitions/" ,this);
        var idx = path.lastIndexOf("/");//procura pela / antes do nome ou do from
        var querystring = path.substr(idx+2);
        var pathname = path.substring(0, idx+1);//tira as / do inicio e do fim;
        console.log("qs %s pathname %s ", querystring, pathname);
        //routers.redirect("/memorias/PageTransitions/?"+querystring, {orinQuerystring:querystring,orinPath: pathname});
        querystring = (querystring !== "" ?  querystring + "&" + "page=" + 3 : "page=" + 3);
        Meteor.go("/memorias/PageTransitions/?" + querystring, {orinQuerystring:querystring,orinPath: pathname, selected: this});
    }
});
    

Template.loggedInLayout.rendered = function(){
    //$(".btnSocial").hide();
    //$(".btnSocial").slideUp();
    
}

Template.searchBox.events({
    
        'click #btnsearch': function(event, tmpl) {
        
        //var txtsearch = $(tmpl.find("#search")).val();
        var txtsearch =  getInput();
        Session.set("displayMedia",txtsearch);
        
        //Session.get("tagids") contém objectos do tipo {tag:tag, id: id} para facilitar a pesquisa em dropdown
        var objid = _.find(Session.get("tagids"), function(obj){
                
            if(obj.tag === txtsearch ){
                return true;
            }
        });
        
        if(objid)
            $('#myTab a[href="#'+ (objid ? objid.id : "" )+'"]').tab('show');//selecciona o tab com este id
        else{
            Session.set("displayMedia","none");
            $('#myTab a:first').tab('show');//selecciona o primero tab . home - caso não exista o tag da pesquisa.
            
        }
        //console.log("what search ",Session.get("tagids")[0].id);
        //console.log("search btn %o tmpl %o ", $(event.currentTarget) , tmpl);
        
     },
    'keyup #search': function(event, tmpl) {
        
        resetSearch();
        
    }
});

Template.tablesNews.events({
    
});

function getInput(){
        
    //var txtsearch = $.trim($(tmpl.find("#search")).val());
    var txtsearch = $.trim($("#search").val());
    
    return txtsearch;
}

function resetSearch(){
    var txtsearch =  getInput();
        
    if(txtsearch === ""){
        Session.set("displayMedia","");
        $('#myTab a:first').tab('show');
    }
}


Template.tablesNews.rendered = function () {
    
    
        $('a[data-toggle="tab"]').on('shown', function (e) {//ver jquery colocar listeners mesmo sem elementos
        
           // if($.trim($(e.target).text()) === "#Home")
            
            console.log("activated tab ", $(e.target).attr("href")); // activated tab
           
            
            if($(e.target).attr("href") !== "#home"){
                Session.set("displaySearch", false);
                //$(".slidedown").slideUp();
                 
            }else{
                Session.set("displaySearch", true);
                
               // $(".containers").slideDown();
            }
                //Session.set("displayMedia","none");
            
            Session.set("displayMedia","");
            
            //Session.set("displaySearch", true);
            //console.log("previous tab ", e.relatedTarget); // previous tab
        });
} 

Template.tablesNews.destroyed = function () {
  //this.handle && this.handle.stop();
}    

Template.carouselNews.rendered = function(){

    //toggleFullScreen($(".myfotoboard"));
}

Template.carouselNews.events({
    'click #myCarousel':function(){
     
           toggleFullScreen($(this));
        /*
        var
          //el = document.documentElement
            el = $(this)
            , rfs =
                   el.requestFullScreen
                || el.webkitRequestFullScreen
                || el.mozRequestFullScreen
        ;
        rfs.call(el);
        */
 }
});


Template.newsboard.rendered = function(){

    var self = this
    
        
        //addthis.bar.hide();
        //addThisBar();
        //console.log("addthis bar ", addthis.bar);
        //$('.containers').prependTo("body");
    if(!self.handle){
            //console.log("newsboard handle ");
            
            self.handle = Deps.autorun(function (c) {
                
                if(Session.equals("from","facebook")){
                    $(".containers").slideDown();   
                   // $(".btnSocial").slideUp(); 
                    c.stop();
                    barTimeout = Meteor.setTimeout(stopTopBar,1000*5);
                }else if(Session.equals("from","twitter")){
                    $(".containers").slideDown();   
                    //$(".btnSocial").slideUp(); 
                    c.stop();
                    barTimeout = Meteor.setTimeout(stopTopBar,1000*5);
                }else if(Session.equals("from","googleplus")){
                    $(".containers").slideDown();   
                    //$(".btnSocial").slideUp(); 
                    c.stop();
                    barTimeout = Meteor.setTimeout(stopTopBar,1000*5);
                }
                
                
            });   
        }
    
        if (document.referrer && document.referrer != "")
            console.log('Thanks for visiting this site from ' + document.referrer);
    
        //console.log("origem ", $(location).attr('<property>'));
       // $(window).scroll(function() {
            //$('.containers').css('top', $(this).scrollTop() + "px");
              // $('.containers').stop()
                //.animate({"marginTop": ($(window).scrollTop() ) + 30 + "px"}, "fast" );
        //});
        addthis.toolbox(".addthis_toolbox");
}

Template.newsboard.destroyed = function () {
  //this.bar;
  this.handle && this.handle.stop();
}

Template.newsboard.events({
    
    'click #myCarousel':function(){
     
           toggleFullScreen($("#myCarousel")[0]);
        /*
        var
          //el = document.documentElement
            el = $(this)
            , rfs =
                   el.requestFullScreen
                || el.webkitRequestFullScreen
                || el.mozRequestFullScreen
        ;
        rfs.call(el);
        */
 }
     
});


Template.footerLayout.rendered = function () {    
    //console.log("addthis ", addthis);
}


//obtém o documento na base de dados referente ao caminho indicado
function getObjId(obj){

    var path = obj.context.pathname;
    var querystring = obj.context.querystring;
    
    var idx = 0;
    var idx2 = 0;
    var from;
    
    Session.set("from","");
    var subpath = path.substring(1,path.length - 1);//tira as / do inicio e do fim
    idx = subpath.lastIndexOf("/");//procura pela / antes do nome ou do from
    var nome = subpath.substr(idx+1);
    console.log("nome ", nome);
    if(querystring !== ""){
        
        //var querypath = querystring.substr(1);//tira o from ignorando o ?
        var fromfacebookarr = querystring.match(/facebook/);//procura pela / antes do nome
        var fromtwitterarr = querystring.match(/twitter/);//procura pela / antes do nome
        var fromgooleplusarr = querystring.match(/googleplus/);//procura pela / antes do nome

        console.log("from ", fromfacebookarr);
        console.log("from ", fromtwitterarr);
        console.log("from ", fromgooleplusarr);
        if(fromfacebookarr)
            Session.set("from", fromfacebookarr[0]);
        else if(fromtwitterarr)
            Session.set("from", fromtwitterarr[0]);
        else if (fromgooleplusarr)
            Session.set("from", fromgooleplusarr[0]);
    }
    idx2 = subpath.indexOf("/");//procura pela / depois de memorias

    var mypath = subpath.slice(idx2 + 1,idx);
    
    //os documentos referentes a esta rubrica mypath/nome tem como campo id o id desta rubrica
    var obj = MapTree.findOne({path:unescape(mypath),nome:nome});
    //if(obj)
    Session.set("profile",obj ? obj.profile : "");
    
    if(obj){
        Session.set("docid",obj._id);
        Session.set("tag",obj.tag);
    }
    
    //console.log("real path %s id %o ", unescape(mypath), obj);//necessário fazer unescape
    
    return obj;
    
}

function stopTopBar(){

    $(".containers").slideUp(function(){
        //$(".btnSocial").slideDown("slow");   
        $(".btnSocial").show();
   });
    //$(".btnSocial").slideDown(); 
    console.log(".btnSocial", $(".btnSocial"));
    
    
}

/*
document.addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    documentToggleFullScreen(document);
  }
}, false);
*/

function documentToggleFullScreen(elem) {
  if (!elem.fullscreenElement &&    // alternative standard method
      !elem.mozFullScreenElement && !elem.webkitFullscreenElement) {  // current working methods
    if (elem.documentElement.requestFullscreen) {
      elem.documentElement.requestFullscreen();
    } else if (elem.documentElement.mozRequestFullScreen) {
      elem.documentElement.mozRequestFullScreen();
    } else if (elem.documentElement.webkitRequestFullscreen) {
      elem.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (elem.cancelFullScreen) {
      elem.cancelFullScreen();
    } else if (elem.mozCancelFullScreen) {
      elem.mozCancelFullScreen();
    } else if (elem.webkitCancelFullScreen) {
      elem.webkitCancelFullScreen();
    }
  }
}

toggleFullScreen = function (elem) {
  if (!elem.fullscreenElement &&    // alternative standard method
      !elem.mozFullScreenElement && !elem.webkitFullscreenElement) {  // current working methods
      console.log("start fullscreeen!!! ", elem);
    if (elem.requestFullscreen) {
        console.log("elem start fullscreeen!!!");
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        console.log("mopzilla start fullscreeen!!!");
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        console.log("webkit start fullscreeen!!!");
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    console.log("canceling fullscreeen!!!");
    if (elem.cancelFullScreen) {
      elem.cancelFullScreen();
    } else if (elem.mozCancelFullScreen) {
      elem.mozCancelFullScreen();
    } else if (elem.webkitCancelFullScreen) {
      elem.webkitCancelFullScreen();
    }
  }
}
