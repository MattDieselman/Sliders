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

    WIDTH : 800, 

    HEIGHT: 600,

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

        SOLVED : 5,

        INITIALIZE: 6

    }),



    //more properties

    tiles: [],

    numDivs: 1,

    paused: false,

    animationID: 0,

    openTile: null, //variable for us to have a reference to the open tile space

    tileWidth: this.WIDTH/this.numDivs,

    tileHeight:this.HEIGHT/this.numDivs,

    //buttons

    btnPlay: null,

    btnAddDiv: null,

    btnSubDiv: null,

    

    //image to be used in our game

    img : null,
<<<<<<< HEAD

    //Vars to scale image appropriately
    imgXScale :0,
    imgYScale:0,
=======
    logo: null,
>>>>>>> 7c203cba97a1a9d4511e5a579953a242a5548a0a
    

    

    // MAIN METHODS =========================================================================================================

    init : function() {

        console.log("app.main.init() called");

        // initialize properties

        this.canvas = document.querySelector('canvas');

        this.canvas.width = this.WIDTH;

        this.canvas.height = this.HEIGHT;

        this.ctx = this.canvas.getContext('2d');



        this.gameState = this.GAME_STATE.MAIN; //initally start at the main menu

        

        //initalize image

        this.img = new Image();

        this.img.src = "https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/17796183_1518454294833543_3534951743252547946_n.jpg?oh=27b1de1c72bf019a0ffe8aca2aa8b793&oe=594E0C94";
<<<<<<< HEAD

=======
        
        this.logo = new Image();
        this.logo.src = "JavaScript/resources/slidersLogo.jpg";
        
>>>>>>> 7c203cba97a1a9d4511e5a579953a242a5548a0a
        //this.img.width=this.canvas.width/2;

        //this.img.height=this.canvas.height/2;

        //this.img.onload = this.img.resizeImg(this.img,this.canvas.width,this.canvas.height);

        //hook up events

        this.canvas.onmousedown = this.doMousedown;

        //set the scale for the image
        this.img.onload=function(){
            app.main.imgXScale=(app.main.WIDTH/this.width);
            app.main.imgYScale=(app.main.HEIGHT/this.height);
            console.log(this.width);
            console.log(app.main.WIDTH);
            console.log(app.main.imgXScale);

        };

        //create buttons

        this.btnPlay = this.makeButton(((this.WIDTH / 2) - 50), (this.HEIGHT / 2), 100, 40, "PLAY", this.nextGameState);

        

        this.btnAddDiv = this.makeButton(((this.WIDTH / 2) - 150), ((this.HEIGHT / 2) - 170), 300, 40, "Increase Divs", this.increaseDivs);

        this.btnSubDiv = this.makeButton(((this.WIDTH / 2) - 150), ((this.HEIGHT / 2) - 70), 300, 40, "Decrease Divs", this.decreaseDivs);



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

        //update based on gameState

        if(this.gameState == this.GAME_STATE.MAIN) //MAIN MENU

        {



        }

        else if(this.gameState == this.GAME_STATE.SETTINGS) //GAME SETTINGS MENU

        {

            

        }

        else

        {

            

        }



        // 5) DRAW  

        // i) draw background

        this.ctx.fillStyle = "black"; 

        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 

        

        //draw based on gameState

        if(this.gameState == this.GAME_STATE.MAIN) //MAIN MENU

        {

            //draw the main menu

            this.drawMainMenu(this.ctx);

        }

        else if(this.gameState == this.GAME_STATE.SETTINGS) //GAME SETTINGS MENU

        {

            this.drawSettingsMenu(this.ctx);

        }

        else //GAME ITSELF

        {

            // ii) draw tiles

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

    makeTiles: function(num)

    {

        //a func that will be used as a method

        var moveTile = function(direction)

        {

            //change xy based on direction

            switch(direction)

            {

                case "up":

                    this.y = this.y + 1;

                    break;

                case "down":

                    this.y = this.y - 1;

                    break;

                case "left":

                    this.x = this.x + 1;

                    break;

                case "right":

                    this.x = this.x - 1;

                    break;

            }

        };



        //a func that we will soon use as a methods

        var drawTile = function(ctx)

        {

            //draw only part of the image

            ctx.drawImage(

                app.main.img, //original image
              

                //crop

                this.originX * this.width, this.originY * this.height, this.width, this.height,
                //draw image

                this.x * this.width*app.main.imgXScale, this.y * this.height*app.main.imgYScale, this.width*app.main.imgXScale, this.height*app.main.imgYScale

            );



            //draw boarder around each tile to clearly show divs

            ctx.strokeStyle="green";

            ctx.rect(this.x * (this.width*app.main.imgXScale), this.y * this.height*app.main.imgYScale, this.width*app.main.imgXScale, this.height*app.main.imgYScale);

            ctx.stroke();

        };



        var array = [];

        //debugger;

        for(var x = 0; x <= num; x++)

        {

            for(var y = 0; y <= num; y++)

            {

                //make new objject literal

                var t = {};



                //add xy properties

                t.x = x;

                t.y = y;



                t.originX = x;

                t.originY = y;



                //length width properties

                t.width = app.main.img.width / (num + 1);

                t.height = app.main.img.height / (num + 1);



                //other proerties

                t.selected = false;



                //teach the circles their methods

                t.draw = drawTile;

                t.move = moveTile;



                //no more properties can be added

                Object.seal(t);

                array.push(t);  

            }

        }

        

        return array;

    },



    //draw circles

    drawTiles: function(ctx)

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

        

        //hook up clickable objects

        app.main.checkTileClicked(mouse);

        app.main.checkButtonClicked(mouse, app.main.btnPlay);

        app.main.checkButtonClicked(mouse, app.main.btnAddDiv);

        app.main.checkButtonClicked(mouse, app.main.btnSubDiv);

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

    },



    //draw main menu

    drawMainMenu: function(ctx)

    {

        ctx.save();

        

        //draw logo

        ctx.strokeStyle = "white";

        ctx.fillStyle = "white";
<<<<<<< HEAD

        ctx.strokeRect(100, 100, 600, 100); //box out where logo would go

=======
        ctx.drawImage(this.logo, 60, 100, 700, 125);
>>>>>>> 7c203cba97a1a9d4511e5a579953a242a5548a0a
        

        //draw play button

        app.main.btnPlay.draw(ctx);

        

        //draw names

        ctx.fillText("Matt Dieselman and Joel Shuart", (this.WIDTH / 2) - 70, 500);

        

        ctx.restore();

    },

    

    //check if a given button is clicked

    // [mouse is maouse data] [button is an object (x, y, width, height, function)]

    checkButtonClicked: function(mouse, button)

    {

        //AABB

        if(mouse.x >= button.x && mouse.x <= (button.x + button.width) && mouse.y >= button.y && mouse.y <= (button.y + button.height))

        {

            //run whatever function the button is supposed todo

            button.clicked();

        }

    },

    

    //makes a button with a specific function

    //[xy pos][width and height of button] [text on the button] [function for the button todo]

    makeButton: function(xPos, yPos, width, height, text, func)

    {

        //drawing function

        var drawButton = function(ctx)

        {

            ctx.save();

            

            //draw the button itself

            ctx.strokeRect(this.x, this.y, this.width, this.height);

            

            //draw text inside the button

            ctx.font = "24pt courier";

            ctx.fillText(this.text, (this.x + (this.width / 10)), (this.y + (this.height - (this.height / 4))), this.width);

            

            ctx.restore();

        }

        

        //create button obj

        var btn = {};

        

        //add proprties

        btn.x = xPos;

        btn.y = yPos;

        btn.width = width;

        btn.height = height;

        btn.text = text;

        

        //hook up draw button and function for what its supposed todo

        btn.draw = drawButton;

        btn.clicked = func;

        

        //no more properties can be added

        Object.seal(btn);

        

        //return the button we just made

        return btn;

    },

        

    nextGameState: function()

    {

        if(app.main.gameState == app.main.GAME_STATE.MAIN)

        {

            app.main.gameState = app.main.GAME_STATE.SETTINGS;

        }

        else if(app.main.gameState == app.main.GAME_STATE.SETTINGS)

        {

            //prep game

            app.main.tiles = app.main.makeTiles(app.main.numDivs); //create out tile set

            app.main.shuffleTiles(); //shuffle em up

            

            //chnage to the game itself

            app.main.gameState = app.main.GAME_STATE.PLAY;

        }

    },

    

    drawSettingsMenu: function(ctx)

    {

        ctx.save();

        

         //set fill and stroke

        ctx.strokeStyle = "white";

        ctx.fillStyle = "white";

        ctx.font = "24pt courier";

        

        //draw div incrementor

        this.btnAddDiv.draw(ctx);

        ctx.fillText(this.numDivs, (this.btnAddDiv.x + (this.btnAddDiv.width / 2) - 20), (this.btnAddDiv.y + (this.btnAddDiv.height * 2)),);

        this.btnSubDiv.draw(ctx);

        

        

        //draw play button

        this.btnPlay.draw(ctx);

        

        ctx.restore();

    },

    

    increaseDivs: function()

    {

        if(app.main.numDivs < 99)

        {

            //increment number of divs

            app.main.numDivs = app.main.numDivs + 1;

        }

    },

    

    decreaseDivs: function()

    {

        if(app.main.numDivs > 1)

        {

            //increment number of divs

            app.main.numDivs = app.main.numDivs - 1;

        }

    },

    

    shuffleTiles: function()

    {
        this.tiles.splice(this.tiles.length-1,1);

        //console.log("hit shuff");

        //loop through array of tiles and switch around the x,y cords.

        for(var j=0;j<this.tiles.length;j++){



            var rand = Math.floor(getRandom(0,this.tiles.length));



            var tempX = this.tiles[rand].x;

            var tempY = this.tiles[rand].y;



            this.tiles[rand].x=this.tiles[j].x;

            this.tiles[rand].y=this.tiles[j].y;

            this.tiles[j].x=tempX;

            this.tiles[j].y=tempY;

        }

               // return this.tiles;

    }

    

    

}; // end app.main