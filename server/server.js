
Meteor.publish("posts", function (postid) {
  //check(postid, String);
  return Posts.find({id:postid});
});


Posts.allow({
   insert: function(userId, doc){
         return !!userId;
   }
});

News.allow({
   insert: function(userId, doc){
         return !!userId;
   }
});

MapTree.allow({
   insert: function(userId, doc){
         return !!userId;
   }
});

Meteor.publish("news", function () {

  return News.find({});
});

Meteor.publish("maptree", function () {

  return MapTree.find({});
});

Meteor.publish("flare", function () {

  return Flare.find({});
});

Meteor.startup(function() {



});


/*

dep = {nodes:[
{"categoria": "inicio","nome":"Início","grupo":1,"foto":"https://github.com/favicon.ico","texto":"","fonte":""},
{"categoria": "personalidades","nome":"Personalidades","grupo":1,"foto":"depenados.jpg","texto":"","fonte":""},{"categoria": "personalidades","nome":"Merkel",
"grupo":1,"foto":"merkel-caricatura.jpg","texto":"","fonte":""},{"categoria": "personalidades","nome":"Passos Coelho","grupo":1,
"foto":"socrates.jpg","texto":"","fonte":""},{"categoria": "personalidades","nome":"Socrates","grupo":1,"foto":"socrates-caricatura.jpg","texto":"","fonte":""}],
"links":[{"source":1,"target":0,"value":1},{"source":2,"target":1,"value":8},{"source":3,"target":1,"value":10},{"source":4,"target":1,"value":10}
]}
*/

/*

{"tipo":"node","categoria": "root","pos":"root","nome":"Início","grupo":1,"foto":"https://github.com/favicon.ico","texto":"","fonte":"","target":""","size": 3938}
{"tipo":"node","categoria": "personalidades","pos":"root","nome":"Personalidades","grupo":1,"foto":"depenados.jpg","texto":"","fonte":"","target":"","size": 3938}
{"id":1,"tipo":"node","categoria": "personalidades","pos":"child","nome":"Merkel","grupo":1,"foto":"merkel-caricatura.jpg","texto":"","fonte":"","target":"root","size": 3938}
{"id":2,"tipo":"node","categoria": "personalidades","pos":"child","nome":"Passos Coelho","grupo":1,"foto":"socrates.jpg","texto":"","fonte":"","target":"root","size": 3938}
{"id":3,"tipo":"node","categoria": "personalidades","pos":"child","nome":"Socrates","grupo":1,"foto":"socrates-caricatura.jpg","texto":"","fonte":"","target":"root","size": 3938}

novo:
{"categoria": "personalidades","parent":"memorias","nome":"Socrates","votos":1,"foto":"depenados.jpg","size": 3938}

{path:"personalidades", nome:"socrates", size:3938}


{"categoria": "personalidades","parent":"memorias","nome":"Socrates","votos":1,"foto":"depenados.jpg","size": 3938}
*/



/*

    {
     "name": "personalidade",
     "children": [
      {"name": "AgglomerativeCluster", "size": 3938}
     ]
    }


*/

