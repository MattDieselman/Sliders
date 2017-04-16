// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main = {
	//  properties
    WIDTH : 640, 
    HEIGHT: 480,
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: true,
	gameState: undefined,
	
	//constants
	TILE_STATE: Object.freeze({ //fake enumeration, actually an object literal
		NORMAL : 0,
		MOVING : 1,
		DONE: 2
	}),

	GAME_STATE: Object.freeze({ // another fake enumeration
		MAIN : 0,
        SETTINGS : 1,
        PLAY : 2,
        MOVING : 3,
		PAUSE : 4,
        SOLVED : 5
	}),

	//more properties
	tiles: [],
	numDivs: 2,
	paused: false,
	animationID: 0,
    openTile: null, //variable for us to have a reference to the open tile space

    
    
    // MAIN METHODS =========================================================================================================
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');

		//this.circles = this.makeCircles(this.numCircles);
		console.log("this.circles = " + this.circles);

		this.gameState = this.GAME_STATE.MAIN; //initally start at the main menu

		//hook up events
		this.canvas.onmousedown = this.doMousedown;
        
        //create tileset

		//scramble tiles
		this.reset();
		
		// start the game loop
		this.update();
	},
	
	update: function(){
		// 1) LOOP
		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// 2) PAUSED?
	 	// if so, bail out of loop
		 if(this.paused)
		 {
			 this.drawPauseScreen(this.ctx);
			 return;
		 }
	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
	 	// 4) UPDATE
	 	
        
        
        
	 	
		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
	
		// ii) draw circles
		this.ctx.globalAlpha = 0.9;
		this.drawTiles(this.ctx);
	
		// iii) draw HUD
		this.ctx.globalAlpha = 1.0;
		this.drawHUD(this.ctx);
		
		
		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText("dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
		
	},
	
	
	//HELPER METHODS ============================================================================================================================================
	fillText: function(string, x, y, css, color) {
		this.ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		this.ctx.font = css;
		this.ctx.fillStyle = color;
		this.ctx.fillText(string, x, y);
		this.ctx.restore();
	},
	
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	//create tiles
	makeTiles: function(xPos, yPos, num)
	{
		//a func that will be used as a method
		var moveTile = function(direction)
		{
			
		};

		//a func that we will soon use as a methods
		var drawTile = function(ctx)
		{
			//draw tile
		};

		var array = [];
		debugger;
		for(var i = 0; i < num; i++)
		{
			//make new objject literal
			var t = {};

			//add xy properties
			t.x = xPos;
			t.y = yPos;
            
            //length width properties
            t.length = ctx.length / (numDivs + 1);
            t.height = ctx.height / (numDivs + 1);
            
            //other proerties
            t.selected = false;
			
			//teach the circles their methods
			t.draw = circleDraw;
			t.move = moveTile;
            
			//no more properties can be added
			Object.seal(t);
			array.push(t);
		}
        
		return array;
	},

	//draw circles
	drawTiless: function(ctx)
	{
		//chekc if the round is over
		if(this.gameState == this.GAME_STATE.SOLVED)
		{
			this.ctx.globalAlpha = 0.25;
		}

		//if not, draw the tiles
		for(var i = 0; i < this.tiles.length; i++)
		{
			var t = this.tiles[i];
			t.draw(ctx);
		}
	},

	//draw our pause screen
	drawPauseScreen: function(ctx)
	{
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		this.fillText("... PAUSED ...", this.WIDTH / 2, this.HEIGHT / 2, "40pt courier", "white");
		ctx.restore();
	},

    //mouse click function
	doMousedown: function(e){
		var main = app.main;

		//unpaused on a click
		if(main.paused)
		{
			main.paused = false;
			main.update();
			return;
		};

		//you can only move one tile at a time
		if(main.gameState == main.GAME_STATE.MOVING) return;

		//click
		var mouse = getMouse(e);
		
		app.main.checkTileClicked(mouse);
	},

    //checks mouse pos against a tile
	checkTileClicked: function(mouse)
	{
		//looping through the circles array backwards, why?
		for(var i = this.tiles.length -1; i >= 0; i--)
		{
			var t = this.tiles[i];
            
			//AABB
            if(mouse.x >= t.x && mouse.x <= (t.x + t.width) && mouse.y >= t.y && mouse.y <= (t.y + t.height))
            {
                //check if its already selected
                if(t.selected)
                {
                    //set tile to not be selected
                    t.selected = false; 
                }
                else
                {
                    t.selected = true;
                }
                
                //check if the grey tile is selected
                if(openTile.selected)
                {
                     //its selected - switch tile spaces
                    
                }
            }   
		}
	},

	//scrambles tiles and resets timer
	reset: function()
	{
		
	},

    //draws all HUD elements
	drawHUD: function(ctx){
		ctx.save(); // NEW
		// draw score
      	// fillText(string, x, y, css, color)
		this.fillText("This Round: " + this.roundScore + " of " + this.numCircles, 20, 20, "14pt courier", "#ddd");
		this.fillText("Total Score: " + this.totalScore, this.WIDTH - 200, 20, "14pt courier", "#ddd");

		// NEW
		if(this.gameState == this.GAME_STATE.BEGIN){
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText("To begin, click a circle", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
		} // end if
	
		// NEW
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			ctx.save();
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText("Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			this.fillText("Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
			this.fillText("Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
		} // end if
		
		ctx.restore(); // NEW
	}
    
    
}; // end app.main