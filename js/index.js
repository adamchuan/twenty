 document.body.addEventListener("touchmove", function(e) { //防止页面抖动
     e.preventDefault();
 });



 var BLOCK_WIDTH = 80,
     BLOCK_HEIGHT = 80,
     BLOCK_GAP = 20,
     BLOCK_RADIUS = 5,
     BOARD_WIDTH = 7,
     BOARD_HEIGHT = 8,
     WIDTH = BOARD_WIDTH * (BLOCK_WIDTH + BLOCK_GAP) + BLOCK_GAP,
     HEIGHT = BOARD_HEIGHT * (BLOCK_HEIGHT + BLOCK_GAP) + BLOCK_GAP,

     COLOR = [{
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
     }]

 var _stage,
     _gameLevel = 3,
     _gameInitLine = 2,
     twees = new Set(),
     _blockData = [];


var Block = (function(){

    var blocks = [];

    for (var x = 0; x < BOARD_WIDTH; x++) {

        blocks[x] = [];

        for(var y = 0 ; y < BOARD_HEIGHT ; y ++ ){

            blocks[x][y] = null;

        }

    }

    return {

        create : function(x,y,value,link){

            if( blocks[x][y] == null ){

                 blocks[x][y] = {
                    x: x,
                    y: y,
                    value: value,
                    link : link ? link : {
                        top   : null,
                        right : null,
                        bottom: null,
                        left  : null
                    }
                }

            }else{

                console.log("in position (" , x , y , ")block allready exsit")

            }


            return blocks[x][y];
        },

        change : function(x,y,value){

            if( blocks[x][y] == null){

                create(x,y,value);

            }else{

                blocks[x][y].value = value;

            }


        },

        move : function(point1,point2){ // 将block从point1移动到point2

            var block1 = blocks[point1.x][point1.y],
                block2 = blocks[point2.x][point2.y];

            if(block1 == null){

                throw("there is no block in point1");
                return false;

            }

            if(block2 != null){

                throw("there has been a block in point2 ");
                return false;

            }

            blocks[point2.x][point2.y] = block1;
            blocks[point1.x][point1.y] = null;

            return true;
        },

        canmove : function(point){ // 返回一个方向表示 可移动的方向

            var move = {
                top : false,
                right : false,
                bottom : false,
                left : false
            }   

            if( point.y != 0 && blocks[point.x][point.y -1] == null){// 能够上移
                move.top = true;
            }  
            if( point.x + 1 != BOARD_WIDTH && blocks[point.x + 1][point.y] == null){
                move.right = true;
            }
            if( point.y + 1 != BOARD_HEIGHT && blocks[point.x][point.y+1] == null){
                move.bottom = true;
            }
            if( point.x != 0 && blocks[point.x-1][point.y] == null){
                move.left = true;
            }

            return move;

        },

        canmove2 : function(cos){

            var move = {
                top : false ,
                right : false,
                bottom : false,
                left : false
            }

            var nextblock ;
            var point = Block.convertToPoint(cos);

            if( point.y != 0){

                nextblock =  blocks[point.x][point.y -1];

                

                if(nextblock == null || cos.y > nextblock.y ){

                    move.top = true;

                }
            }

            if(point.x + 1 != BOARD_WIDTH ){

                nextblock = blocks[point.x + 1][point.y];

                if(nextblock == null || cos.x + BLOCK_WIDTH < nextblock.x ){

                    move.right = true;

                }

            }

            if(point.y + 1 != BOARD_HEIGHT){

                nextblock = blocks[point.x][point.y+1];

                if(nextblock == null || cos.y + BLOCK_HEIGHT < nextblock.y){

                    move.bottom = false;
                }

            }

            if(point.x != 0 ){

                nextblock = blocks[point.x-1][point.y];

                if( nextblock == null || cos.x > nextblock.x){

                    move.left = true;

                }

            }

            return move;

        },

        combine : function(potin1,point2){

            if(point.value !== point2.value){

                console.log("value is not eaqual");
                return false;

            }else{

                block[point1.x][point1.y] = null;
                block[point2.x][point2.y].value += block[point2.x][point2.y].value ;

                return true;
            }

        },

        formatCos : function(cos){

            var point = Block.convertToPoint( cos );

            return Block.convertToCos( point );

        },

        convertToCos : function(point){ // Cos 表示在Canvas中的坐标

            return {
                x : point.x  * (BLOCK_GAP + BLOCK_WIDTH) + BLOCK_GAP,
                y : point.y  * (BLOCK_GAP + BLOCK_HEIGHT) + BLOCK_GAP
            }

        },

        convertToPoint : function(cos){ // Point 表示在二维数组的角标

            // var xTemp1 = Math.floor(x / (BLOCK_WIDTH + BLOCK_GAP )),
            //     xTemp2 = Math.ceil (x / (BLOCK_WIDTH + BLOCK_GAP )),
            //     yTemp1 = Math.floor(y / (BLOCK_HEIGHT+ BLOCK_GAP )),
            //     yTemp2 = Math.ceil (y / (BLOCK_HEIGHT+ BLOCK_GAP ))

            // p1.x >= bounds.x1 && 
            // p1.y >= bounds.y1 && 
            // p2.x <= bounds.x2 && 
            // p3.y <= bounds.y2
            // 
            var bounds = {};

            var result = {
                x : null,
                y : null
            }
            for(var x = 0 ; x < BOARD_WIDTH ; x ++){

                bounds.x1 = x * [BLOCK_WIDTH + BLOCK_GAP] ,
                bounds.x2 = bounds.x1 + BLOCK_WIDTH + BLOCK_GAP * 2;

                if( cos.x >= bounds.x1 && cos.x + BLOCK_WIDTH / 2 <= bounds.x2 ){//在一个标准的框内,// 跨越两个框但并未达到下个框的宽度一半的位置

                    result.x = x;

                    break;

                }
                else if(cos.x >= bounds.x1 + BLOCK_GAP && cos.x  <= bounds.x2 + BLOCK_WIDTH ){ 

                    result.x = x + 1;

                    break;

                } 
                   
            }

            for(var y  = 0 ; y < BOARD_HEIGHT ; y++){

                bounds.y1 = y * [BLOCK_HEIGHT + BLOCK_GAP],
                bounds.y2 = bounds.y1 + BLOCK_HEIGHT + BLOCK_GAP * 2;

                if( cos.y >= bounds.y1 && cos.y + BLOCK_HEIGHT/2 <= bounds.y2){

                    result.y = y;

                }else if( cos.y >= bounds.y1 + BLOCK_GAP && cos.y <= bounds.y2 + BLOCK_HEIGHT ){

                    result.y = y + 1;

                    break;
                }

            }

            if(result.x == null || result.y == null){

                console.log("convertToPoint error");

                console.log(cos);

            }

            return result;

        },

        get : function(x,y){

            return blocks;

        }


    }

})();

function _ShowBlock(){

    var blocks = Block.get();

    for(var x = 0 ; x < blocks.length ; x ++){

        for(var y = 0; y < blocks[x].length ; y ++){

            var block = blocks[x][y];

            if( block != null){
             
                 _createBlock({
                    x : x ,
                    y : y,
                    value : block.value
                 })

            }

        }

    }
};

 function _init() {

     game.width = WIDTH;
     game.height = HEIGHT;

     _stage = new createjs.Stage("game");

     for (var y = BOARD_HEIGHT - 1 ; y >= BOARD_HEIGHT - _gameInitLine; y--) {

         for (var x = 0; x < BOARD_WIDTH; x++) {

             var value = Math.ceil(Math.random() * _gameLevel);
     
             Block.create(x,y,value);

         }

     }

     createjs.Touch.enable(_stage);

     createjs.Ticker.setFPS(60);

     createjs.Ticker.addEventListener("tick", function(e) {

         twees.forEach(function(func) {
             func();
         });

         _stage.update();

     });

     _ShowBlock();

     createjs.Ticker.addEventListener("tick", _stage);


 }

 var _draging = false,
     startX,
     startY,
     movingBlock = 0;
 
 

 function _check() {

     var point = Block.formatCos({
         x : movingBlock.x, 
         y : movingBlock.y
     });

     movingBlock.x = point.x;

     movingBlock.y = point.y;

     // _falldown(movingBlock);
     /*
     createjs.Tween.get(movingBlock, {
         override:true
     }).to({ y : HEIGHT - BLOCK_GAP - BLOCK_HEIGHT},500,createjs.Ease.cubicIn ).addEventListener("change", function(event){

         console.log(event);

         var nextX = movingBlock.x + BLOCK_WIDTH + BLOCK_GAP,
             nextY = movingBlock.y + BLOCK_HEIGHT + BLOCK_GAP;

          if( _stage.getObjectsUnderPoint(nextX,nextY).length > 1 ){ //检查到下个位置有block

            
             movingBlock.x = formatPoint.x;
             movingBlock.y = formatPoint.y;
             createjs.Tween.removeTweens(movingBlock);
          }

     });
     */
 }

 function _inRect() {

 }

 function _falldown(falldownBlock) {

     var g = 9.80665;
     var startTime = new Date().getTime(),
         startX = falldownBlock.x,
         startY = falldownBlock.y,
         id = "falldown" + startTime;

     twees.add(action);

     function action() {

         var newX = startX,
             newY = startY + Math.pow((new Date().getTime() - startTime) / 100, 2) * g;

         var tempPoint = Block.formatCos({
                x : newX,
                y : newY
             });


         //     var point = _formatPoint(falldownBlock.x,falldownBlock.y);
         //     falldownBlock.x = point.x;
         //     falldownBlock.y = point.y;
         //     twees.delete(action);

         // }else{

         //     falldownBlock.y = newY;

         // }

     };

 }

 function _touchstart(e) {


     _draging = true;
     movingBlock = e.currentTarget;
     startX = e.stageX;
     startY = e.stageY;

     _stage.setChildIndex(movingBlock, 1);
 }

 function _touchmove(e) {

     if (_draging) {


        var moveY = e.stageY - startY,
            moveX = e.stageX - startX,
            newX  =  movingBlock.x + moveX,
            newY  =  movingBlock.y + moveY;


        var newPoint = Block.convertToPoint({
            x : newX,
            y : newY
        });


        if(newPoint.x == movingBlock.point.x && newPoint.y == movingBlock.point.y){

            movingBlock.x = newX;
            movingBlock.y = newY;

        }else{

            var move = Block.canmove2(newPoint);

            if(moveY < 0  && !move.top ){
                moveY = 0 ;
            }
            if(moveY > 0 && !move.bottom){
                moveY = 0 ;
            }
            if(moveX < 0 && !move.left){
                moveX = 0; 

            }
            if(moveX >0 && !move.right){
                moveX = 0;
            }


            if(moveX != 0 && moveY != 0){

                Block.move(movingBlock.point,newPoint)
                movingBlock.point = newPoint;
                
            }

            movingBlock.x += moveX;
            movingBlock.y += moveY;

        }

        startX = e.stageX;
        startY = e.stageY;

     }

 }

 function _touchend(e) {

     _draging = false;

     _stage.setChildIndex(movingBlock, 0);

     _check();

     movingBlock = null;

 }

 function _createBlock(options) {

     var container   = new createjs.Container();
     container.point = { 
        x : options.x,
        y : options.y
     };
     var cos         = Block.convertToCos(container.point);
     container.x     = cos.x;
     container.y     = cos.y;
     container.value = options.value;
     container.id    = "block" + new Date().getTime();



     var shape = new createjs.Shape();
     shape.graphics.f(COLOR[options.value].bg).rr(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_RADIUS).ef();

     var text = new createjs.Text(options.value, "28px Arial", COLOR[options.value].color);
     var b = text.getBounds();
     text.x = BLOCK_WIDTH / 2 - b.width / 2 ;
     text.y = BLOCK_HEIGHT / 2 - b.height / 2 ;

     container.addChild(shape);
     container.addChild(text);


     container.addEventListener("mousedown", _touchstart);
     container.addEventListener("pressmove", _touchmove);
     container.addEventListener("pressup", _touchend);

     _stage.setChildIndex(container, 0);
     _stage.addChild(container);

     return container;

 }

 _init();