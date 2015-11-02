//
//  main.js
//
//  A project template for using arbor.js
//

(function($){

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem

    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        }) 

    particleSystem.eachNode (function (node, pt)
    {
        var w = 10;
        ctx.fillStyle = node.data.color;
        ctx.fillRect (pt.x-w/2, pt.y-w/2, w,w);
        ctx.fillStyle = "black";
        ctx.font = 'italic 13px sans-serif';
        ctx.fillText (node.data.label, pt.x+8, pt.y+8);
    })
  			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
              if(dragged.node.data.link!=null)
              {
                window.location = dragged.node.data.link;
              }
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    

  $(document).ready(function(){
    var sys = arbor.ParticleSystem(1000, 600, 5) // create the system with sensible repulsion/stiffness/friction
    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    // add some nodes to the graph and watch it go...
    sys.addNode('Ahmed',{label:'I want to...','color':'#9b59b6'})
      sys.addNode('Play',{label:'Play with Ahmed',color:'#f1c40f'})
        sys.addNode('Play-Challenge',{label:'I want to challenge Ahmed',color:'#f1c40f'})
          sys.addNode('Play-Challenge-Smackdown',{label:'Send a challenge to Ahmed via Smackdown.club',color:'#f1c40f'})
            sys.addNode('Play-Challenge-Smackdown-Click',{label:'click here',color:'#f1c40f',link:'http://www.smackdown.club'})
        sys.addNode('Play-Casual',{label:'I want to play casual games with Ahmed',color:'#f1c40f'})
          sys.addNode('Play-Casual-Steam',{label:'Contact Ahmed via Steam',color:'#f1c40f'})
            sys.addNode('Play-Casual-Steam-Click',{label:'click here',color:'#f1c40f',link:"http://steamcommunity.com/id/turupawn"})
      sys.addNode('Help',{label:'Technical help from Ahmed',color:'#3498db'})
        sys.addNode('Help-Tips',{label:'Tips',color:'#3498db'})
        sys.addNode('Help-Tips-1',{label:'Ask him the question directly',color:'#3498db'})
        sys.addNode('Help-Tips-2',{label:'Use Pastebin.com with the correct highlight',color:'#3498db'})
        sys.addNode('Help-Tips-3',{label:'Send screenshots to help him understand the issue',color:'#3498db'})
        sys.addNode('Help-Tips-4',{label:'Don\'t say hi if possible',color:'#3498db'})
        sys.addNode('Help-Facebook',{label:'Ask a technical question to Ahmed via facebook.com/Turupawn',color:'#3498db'})
          sys.addNode('Help-Facebook-Click',{label:'click here',color:'#3498db', link:"www.fb.com/turupawn"})
      sys.addNode('WorkWith',{label:'Work with Ahmed',color:'#2ecc71'})
        sys.addNode('WorkWith-NotReady',{label:'I think or feel like I don\'t have enough knowledge or experience',color:'#2ecc71'})
          sys.addNode('WorkWith-NotReady-Cusuco',{label:'Take my courses at cusuco.rosalilastudio.com',color:'#2ecc71'})
            sys.addNode('WorkWith-NotReady-Cusuco-Click',{label:'click here',color:'#2ecc71',link:'http://cusuco.rosalilastudio.com'})
        sys.addNode('WorkWith-Ready',{label:'I\'m ready to work in...',color:'#2ecc71'})
          sys.addNode('WorkWith-Ready-FreeSoftware',{label:'Free Software',color:'#2ecc71'})
          sys.addNode('WorkWith-Ready-FreeGames',{label:'Free as in freedom games',color:'#2ecc71'})
          sys.addNode('WorkWith-Ready-DIY',{label:'DIY',color:'#2ecc71'})
          sys.addNode('WorkWith-Ready-Webapps',{label:'Web apps',color:'#2ecc71'})
          sys.addNode('WorkWith-Ready-Technology',{label:'Technology',color:'#2ecc71'})
          sys.addNode('WorkWith-Ready-Other',{label:'Other',color:'#2ecc71'})
            sys.addNode('WorkWith-Ready-Step1',{label:'Contact Ahmed via www.fb.com/Turupawn',color:'#2ecc71'})
            sys.addNode('WorkWith-Ready-Step2',{label:'Create a Gallina and add me at www.gallina.moe',color:'#2ecc71'})
            sys.addNode('WorkWith-Ready-Step3',{label:'Link me the github project',color:'#2ecc71'})
            sys.addNode('WorkWith-Ready-Step4',{label:'Start working',color:'#2ecc71'})
            sys.addNode('WorkWith-Ready-Ask',{label:'Just ask, Ahmed will probably say yes',color:'#2ecc71'})
      sys.addNode('WorkFor',{label:'Work For Ahmed',color:'#e74c3c'})
      sys.addNode('WorkFor2',{label:'Ahmed work for me',color:'#e74c3c'})
      sys.addNode('Talk',{label:'Talk to Ahmed',color:'#e74c3c'})
        sys.addNode('No',{label:'No',color:'#e74c3c'})
          sys.addNode('No-Opening',{label:'I really think or feel Ahmed should hear this',color:'#e74c3c'})
          sys.addNode('No-Opening-Quick',{label:'Ok, but be quick',color:'#e74c3c'})

    sys.addEdge('Ahmed','Play')
      sys.addEdge('Play','Play-Challenge')
        sys.addEdge('Play-Challenge','Play-Challenge-Smackdown')
          sys.addEdge('Play-Challenge-Smackdown','Play-Challenge-Smackdown-Click')
      sys.addEdge('Play','Play-Casual')
        sys.addEdge('Play-Casual','Play-Casual-Steam')
          sys.addEdge('Play-Casual-Steam','Play-Casual-Steam-Click')
    sys.addEdge('Ahmed','Help')
      sys.addEdge('Help','Help-Tips')
        sys.addEdge('Help-Tips','Help-Tips-1')
        sys.addEdge('Help-Tips','Help-Tips-2')
        sys.addEdge('Help-Tips','Help-Tips-3')
        sys.addEdge('Help-Tips','Help-Tips-4')
      sys.addEdge('Help','Help-Facebook')
        sys.addEdge('Help-Facebook','Help-Facebook-Click')
    sys.addEdge('Ahmed','WorkWith')
      sys.addEdge('WorkWith','WorkWith-NotReady')
        sys.addEdge('WorkWith-NotReady','WorkWith-NotReady-Cusuco')
          sys.addEdge('WorkWith-NotReady-Cusuco','WorkWith-NotReady-Cusuco-Click')
          sys.addEdge('WorkWith-NotReady-Cusuco-Click','WorkWith-Ready')
      sys.addEdge('WorkWith','WorkWith-Ready')
        sys.addEdge('WorkWith-Ready','WorkWith-Ready-FreeSoftware')
        sys.addEdge('WorkWith-Ready','WorkWith-Ready-FreeGames')
        sys.addEdge('WorkWith-Ready','WorkWith-Ready-DIY')
        sys.addEdge('WorkWith-Ready','WorkWith-Ready-Webapps')
        sys.addEdge('WorkWith-Ready','WorkWith-Ready-Technology')
        sys.addEdge('WorkWith-Ready','WorkWith-Ready-Other')
        sys.addEdge('WorkWith-Ready-FreeSoftware','WorkWith-Ready-Step1')
        sys.addEdge('WorkWith-Ready-FreeGames','WorkWith-Ready-Step1')
        sys.addEdge('WorkWith-Ready-DIY','WorkWith-Ready-Step1')
        sys.addEdge('WorkWith-Ready-Webapps','WorkWith-Ready-Step1')
        sys.addEdge('WorkWith-Ready-Technology','WorkWith-Ready-Step1')
        sys.addEdge('WorkWith-Ready-Step1','WorkWith-Ready-Step2')
        sys.addEdge('WorkWith-Ready-Step2','WorkWith-Ready-Step3')
        sys.addEdge('WorkWith-Ready-Step3','WorkWith-Ready-Step4')
        sys.addEdge('WorkWith-Ready-Other','WorkWith-Ready-Ask')
    sys.addEdge('Ahmed','WorkFor')
    sys.addEdge('Ahmed','WorkFor2')
    sys.addEdge('Ahmed','Talk')
      sys.addEdge('WorkFor','No')
      sys.addEdge('WorkFor2','No')
      sys.addEdge('Talk','No')
        sys.addEdge('No','No-Opening')
          sys.addEdge('No-Opening','No-Opening-Quick')

    // or, equivalently:
    //
    // sys.graft({
    //   nodes:{
    //     f:{alone:true, mass:.25}
    //   }, 
    //   edges:{
    //     a:{ b:{},
    //         c:{},
    //         d:{},
    //         e:{}
    //     }
    //   }
    // })
    
  })

})(this.jQuery)
