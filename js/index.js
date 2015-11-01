 'use strick';

 document.body.addEventListener( "touchmove", function ( e ) {
     e.preventDefault();
 } );

 var BLOCK_WIDTH = 80,
     BLOCK_HEIGHT = 80,
     BLOCK_GAP = 20,
     BLOCK_RADIUS = 5,
     BOARD_WIDTH = 7,
     BOARD_HEIGHT = 8,
     WIDTH = BOARD_WIDTH * ( BLOCK_WIDTH + BLOCK_GAP ) + BLOCK_GAP,
     HEIGHT = BOARD_HEIGHT * ( BLOCK_HEIGHT + BLOCK_GAP ) + BLOCK_GAP,
     COLOR = [ {
         bg: "#807e4b",
         color: "#464800",
     }, {
         bg: "#801213",
         color: "#fff"
     }, {
         bg: "#007958",
         color: "#fff",
     }, {
         bg: "#174580",
         color: "#fff"
     }, {
         bg: "#6f527e",
         color: "#fff"
     }, {
         bg: "#1c7300",
         color: "#fff"
     }, {
         bg: "#806a5f",
         color: "#fff"
     }, {
         bg: "#500079",
         color: "#fff"
     }, {
         bg: "#7f5a01",
         color: "#fff"
     }, {
         bg: "#626061",
         color: "#fff"
     }, {
         bg: "#677d01",
         color: "#343f07"
     }, {
         bg: "#827e00",
         color: "#3e3f00"
     }, {
         bg: "#7d0f3e",
         color: "#fff"
     }, {
         bg: "#006a77",
         color: "#fff"
     }, {
         bg: "#404241",
         color: "#fff"
     }, {
         bg: "#121280",
         color: "#fff"
     }, {
         bg: "#7a2080",
         color: "#fff"
     }, {
         bg: "#321542",
         color: "#fff"
     }, {
         bg: "#817253",
         color: "#fff"
     }, {
         bg: "#843d29",
         color: "#fff"
     } ]

 var game = document.querySelector( "#game" ),
     _stage,
     _gameLevel = 3,
     _gameInitLine = 2,
     _blocks = [];

 function _init() {

     game.width = WIDTH;
     game.height = HEIGHT;

     _stage = new createjs.Stage( game );

     for ( var y = BOARD_HEIGHT - 1; y >= BOARD_HEIGHT - _gameInitLine; y-- ) {

         for ( var x = 0; x < BOARD_WIDTH; x++ ) {
             var value = Math.ceil( Math.random() * _gameLevel ),
                 blockX = BLOCK_GAP + x * ( BLOCK_WIDTH + BLOCK_GAP ),
                 blockY = BLOCK_GAP + y * ( BLOCK_HEIGHT + BLOCK_GAP ),
                 block = new Block( blockX, blockY, value );
             _blocks.push( block );
             _stage.addChild( block );
         }

     }

     createjs.Touch.enable( _stage );
     createjs.Ticker.setFPS( 60 );
     createjs.Ticker.addEventListener( "tick", tick );

 }


 function formatX( block ) {

     var newX = Math.floor( block.x / ( BLOCK_WIDTH + BLOCK_GAP ) ) * ( BLOCK_WIDTH + BLOCK_GAP ) + BLOCK_GAP;
     block.x = newX;
 }

 function fall() { //自由落体检测  
     var fallSpeed = 30;
     var totalCount = _blocks.length;
     for ( var i = 0; i < BOARD_WIDTH; i++ ) {

         for ( var j = BOARD_HEIGHT - 2; j >= 0; j-- ) { //从倒数第二行开始检测

             var centerX = BLOCK_GAP + ( BLOCK_WIDTH + BLOCK_GAP ) * i + BLOCK_WIDTH / 2,
                 centerY = BLOCK_GAP + ( BLOCK_HEIGHT + BLOCK_GAP ) * j + BLOCK_HEIGHT / 2;

             var result = _stage.getObjectUnderPoint( centerX, centerY, 1 );

             if ( result !== null && result.parent instanceof Block ) {
                 var block = result.parent;
                 if ( movingBlock ) {
                     if ( block.id == movingBlock.id ) {
                         continue;
                     }
                 }
                 var newY = centerY + fallSpeed;
                 var nextBlock = _stage.getObjectUnderPoint( centerX, newY + BLOCK_HEIGHT );
                 if ( nextBlock !== null && nextBlock.parent instanceof Block ) {
                     block.y = nextBlock.parent.y - BLOCK_HEIGHT - BLOCK_GAP;
                 } else {
                     block.y = block.y + fallSpeed;
                 }
             }
         }
     }

 }

 function tick() {

     fall();
     _stage.update();

 }

 var _draging = false,
     movingBlock,
     startX,
     startY;

 function _touchstart( e ) {

     _draging = true;
     startX = e.stageX;
     startY = e.stageY;
     movingBlock = e.currentTarget;
     _stage.setChildIndex( movingBlock, _stage.children.length - 1 );

 }

 function _touchmove( e ) {

     if ( _draging ) {

         var moveY = e.stageY - startY,
             moveX = e.stageX - startX;
         movingBlock.x = movingBlock.x + moveX;
         movingBlock.y = movingBlock.y + moveY;
         for ( var i = 0; i < _blocks.length; i++ ) {
             var block = _blocks[ i ];
             if ( block.id === movingBlock.id ) {
                 continue;
             }

             var result = block.hit( movingBlock );
             if ( result.isHit ) {
                 movingBlock.x = result.x;
                 movingBlock.y = result.y;
             }
         }
         startX = e.stageX;
         startY = e.stageY;
     }

 }

 function _touchend( e ) {

     _draging = false;
     formatX( movingBlock );
     movingBlock = null;

 }

 _init();