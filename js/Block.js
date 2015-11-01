'use strict';

function isHit( targetRect, moveRect ) {

	var horDistance = targetRect.x + targetRect.width / 2 - moveRect.x - moveRect.width / 2,
		verDistance = targetRect.y + targetRect.height / 2 - moveRect.y - moveRect.height / 2;

	var horThreshold = ( targetRect.width + moveRect.width ) / 2,
		verThreshold = ( targetRect.height + moveRect.height ) / 2;

	var horFlag = Math.abs( horDistance ) < horThreshold,
		verFlag = Math.abs( verDistance ) < verThreshold;

	var result = {
		x: moveRect.x,
		y: moveRect.y,
		isHit: horFlag && verFlag
	}

	if ( result.isHit ) {

		if ( Math.abs( horDistance ) >= Math.abs( verDistance ) ) { // 恢复到水平位置

			result.x = targetRect.x + ( horDistance > 0 ? -moveRect.width : targetRect.width );

		} else {

			result.y = targetRect.y + ( verDistance > 0 ? -moveRect.height : targetRect.height );

		}
	}

	return result;
}

var Block = ( function () {

	var block = function ( x, y, value ) {

		this.Container_constructor();

		var text = new createjs.Text( value, "28px Arial", COLOR[ value ].color );
		var b = text.getBounds();
		text.x = BLOCK_WIDTH / 2 - b.width / 2;
		text.y = BLOCK_HEIGHT / 2 - b.height / 2;

		var shape = new createjs.Shape();
		shape.graphics.f( COLOR[ value ].bg ).rr( 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_RADIUS ).ef();
		shape.x = 0;
		shape.y = 0;

		this.link = {
			top: null,
			bottom: null,
			left: null,
			right: null
		}
		this.x = x;
		this.y = y;
		this.width = BLOCK_WIDTH;
		this.height = BLOCK_HEIGHT;
		this.shape = shape;
		this.text = text;
		this.addChild( shape );
		this.addChild( text );

		this.addEventListener( "mousedown", _touchstart );
		this.addEventListener( "pressmove", _touchmove );
		this.addEventListener( "pressup", _touchend );
	};

	var p = createjs.extend( block, createjs.Container );

	p.hit = function ( rect ) {
		return isHit( this, rect );
	}
	p.format = function ( rect ) {

	}

	return createjs.promote( block, 'Container' );

} )();