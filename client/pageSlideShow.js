var pageTrans;
//var fullScreenState = false;

Template.pageSlideshow.rendered = function(){

      if(!this.started){
        pageTrans = PageTransitions();
        pageTrans.init();
        this.started = true;
        //Session.set("maxpages", 6);
          
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(){
        
            //fullScreenState = !fullScreenState;
            //if(fullScreenState){
                //$(".pt-page").width('70%');
                //$(".pt-page").height("70%");
                /*$(".pt-page").animate({
                    left: '0',//'15%',
                    height: "100%",
                    width:'100%'
                  }, 800,"swing", function() {//easeOutBounce
                    // Animation complete.
                });*///css({top: 0, left: "15%"});
                //console.log("fullscreen change");
            //}
        });
      }
}

Template.pages.helpers({
   teste: function(){
        return "teste"; 
   }
});

Template.pageSlideshow.helpers({
    newPageNum: function(){
        return 1; 
    }
});

Template.pageSlideshow.events({
    'click #pt-main': function(event, tmpl) {
            
            pageTrans.nextPage(1,1);     
     }
});

Template.pages.events({
   
    
    'click #nextSlide': function(event, tmpl) {
            
            pageTrans.nextPage(1,1);     
     },
    'click #previoSlide': function(event, tmpl) {
            
            pageTrans.nextPage(1,-1);     
     },
    'click #fullScreen': function(event, tmpl) {
            //console.log("this ", this);
            //if (event.keyCode == 13) {
                //console.log("this ", );
        var elem = $("#pt-main")[0];
        console.log("elem ",elem);
        //if(!fullScreenState){
        if(!document.webkitIsFullScreen){
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



