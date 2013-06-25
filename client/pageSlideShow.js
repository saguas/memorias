var pageTrans;
var fullScreenState = false;

Template.pageSlideshow.rendered = function(){

      if(!this.started){
        pageTrans = PageTransitions();
        pageTrans.init();
        this.started = true;
          
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(){
        
            fullScreenState = !fullScreenState;
            if(!fullScreenState){
                //$(".pt-page").width('70%');
                //$(".pt-page").height("70%");
                $(".pt-page").animate({
                    left: '0',//'15%',
                    height: "100%",
                    width:'100%'
                  }, 800,"swing", function() {//easeOutBounce
                    // Animation complete.
                });//css({top: 0, left: "15%"});
                //console.log("fullscreen change");
            }
        });
      }
}

Template.pageSlideshow.helpers({
   teste: function(){
        return "teste"; 
   }
});

Template.pageSlideshow.events({
   
    'click #pt-main': function(event, tmpl) {
            
            pageTrans.nextPage(1);     
     },
    'click #fullscreen': function(event, tmpl) {
            //console.log("this ", this);
            //if (event.keyCode == 13) {
                //console.log("this ", );
            toggleFullScreen($("#pt-main")[0]);
            $(".pt-page").width('100%');
            $(".pt-page").height("100%");
            $(".pt-page").css({top: 0, left: 0});
            pageTrans.nextPage(2);
         
            //console.log("this ", $(".pt-page"));
            //}
     }
     
    
});



