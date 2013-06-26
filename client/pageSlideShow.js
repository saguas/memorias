var pageTrans;
var barTimeout;
var nextPage = 0;
//var fullScreenState = false;

Template.layoutReveal.rendered = function(){
    
    var self = this;
    $("body").css({overflow: "hidden"});

    if(!self.handle){
            
        self.handle = startSocialTopBar(self);  
    }
    
}

Template.layoutReveal.destroyed = function () {
  //this.bar;
  this.handle && this.handle.stop();
  $("body").css({overflow: "auto"});
}

Template.layoutReveal.events({
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


Template.pageSlideshow.rendered = function(){

        //nextPage = 0;
      
        console.log("pageSlideshow.rendered ");
        if(!self.handle){
            pageTrans = PageTransitions();
            
            self.handle = Deps.autorun(function (c) {
                //console.log("antes de iniciar ", Session.get("docid"));
                if(Session.get("postready"))
                    pageTrans.init( Session.get("currentDocId"));
                    /*Posts.find().forEach(function(post){
                        console.log("post ", post);
                    });*/
                //console.log("currentDocId ",Posts.find());
                
            });
        }    
            
        //pageTrans.init( Session.get("currentDocId"));
             /* 
                $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(){
                
                    
                });
            */
    
}

Template.pageSlideshow.destroyed = function () {
    this.handle && this.handle.stop();
}



Template.pages.helpers({
   teste: function(){
        return "teste"; 
   }
});

Template.pageSlideshow.helpers({
    newPageNum: function(){
        nextPage++;
        //console.log("countPages ", countPages);
        return nextPage; 
    },
    docs: function(){
        console.log("dentro de docs ", Posts.find());
        return Posts.find(); 
   }
});

Template.pageSlideshow.events({
    /*'click #pt-main': function(event, tmpl) {
            
            pageTrans.nextPage(1,1);     
     }*/
});

Template.pages.events({
   
    
    'click #nextSlide': function(event, tmpl) {
            
            pageTrans.nextPage(1,1);     
     },
    'click #previoSlide': function(event, tmpl) {
            
            pageTrans.nextPage(2,-1);     
     },
    'click #fullScreen': function(event, tmpl) {
            //console.log("this ", this);
            //if (event.keyCode == 13) {
                //console.log("this ", );
        var elem = $("#pt-main")[0];
        console.log("elem ",elem);
        //if(!fullScreenState){
        if(!document.webkitIsFullScreen && !document.mozIsFullScreen && !document.IsFullScreen){
            console.log("entrar no fullscreen");
            toggleFullScreen(elem);
            $(".pt-page").width('100%');
            $(".pt-page").height("100%");
            $(".pt-page").css({top: 0, left: 0});
            
        }else{
            console.log("sair do fullscreen");
            toggleFullScreen(document);
            //document.webkitCancelFullScreen();
            //elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            
           // pageTrans.nextPage(2);
         
            //console.log("this ", $(".pt-page"));
            //}
        }
    }     
    
});



