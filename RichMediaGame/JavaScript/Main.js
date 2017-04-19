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
 This object literal has its own properties and methods (functions
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
        MOVING: 2,
        PLAY : 3,
        PAUSE : 4,
        SOLVED : 5,
        INITIALIZE: 6,
        FIREWORKS:7
    }),

    //more properties
    tiles: [],
    sortedTiles:[],
    emitters:[],
    blackTile:0,
    numDivs: 1,
    paused: false,
    animationID: 0,
    openTile: null, //variable for us to have a reference to the open tile space
    tileWidth: this.WIDTH/this.numDivs,
    tileHeight:this.HEIGHT/this.numDivs,

    //audio stuff

    particleCounter:0,
    particleCounterMax:0,
    //buttons
    btnPlay: null,
    btnAddDiv: null,
    btnSubDiv: null,

    //image to be used in our game
    img : null,
    logo: null,
    
    // MAIN METHODS =========================================================================================================
    init : function() {
        console.log("app.main.init() called");

        document.addEventListener("keydown",this.keyPress,false);
        document.addEventListener("keydown",this.keyPress,false);
        var audioElement = document.querySelector('audio');

        //create the sounds
            audioElement.src = "JavaScript/resources/Upbeat Forever.mp3";
            audioElement.play();
            audioElement.volume = 0.2;
            console.log(audioElement.src)
        
        // initialize properties
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        this.gameState = this.GAME_STATE.SOLVED; //initally start at the main menu
        this.genParticles();
        //clear canvas once before we get started
        this.ctx.fillStyle = "black"; 
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);

        //initalize image
        this.img = new Image();
        this.img.src = "https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/17796183_1518454294833543_3534951743252547946_n.jpg?oh=27b1de1c72bf019a0ffe8aca2aa8b793&oe=594E0C94";
        
        this.logo = new Image();
        this.logo.src = "JavaScript/resources/slidersLogo.jpg";

        //hook up events
        this.canvas.onmousedown = this.doMousedown;

        //create buttons
        this.btnPlay = this.makeButton(((this.WIDTH / 2) - 50), (this.HEIGHT / 2), 100, 40, "PLAY", this.nextGameState);
        this.btnAddDiv = this.makeButton(((this.WIDTH / 2) - 150), ((this.HEIGHT / 2) - 170), 300, 40, "Increase Divs", this.increaseDivs);
        this.btnSubDiv = this.makeButton(((this.WIDTH / 2) - 150), ((this.HEIGHT / 2) - 70), 300, 40, "Decrease Divs", this.decreaseDivs);

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
        else if(this.gameState == this.GAME_STATE.MOVING)
        {
            
        }
        else
        {
        }

        // 5) DRAW  
        //draw based on gameState
        if(this.gameState == this.GAME_STATE.MAIN) //MAIN MENU
        {
            this.clear(this.ctx);
            
            //draw the main menu
            this.drawMainMenu(this.ctx);
        }
        else if(this.gameState == this.GAME_STATE.SETTINGS) //GAME SETTINGS MENU
        {
            this.clear(this.ctx);
            this.drawSettingsMenu(this.ctx);
        }
        else if(this.gameState == this.GAME_STATE.MOVING)
        {
            this.clear(this.ctx);
            
            // ii) draw tiles
            this.ctx.globalAlpha = 0.9;
            this.drawTiles(this.ctx);

            // iii) draw HUD
            this.ctx.globalAlpha = 1.0;
            this.drawHUD(this.ctx);
            
            //update gamestate
            this.nextGameState();
        }
        else if(this.gameState == this.GAME_STATE.SOLVED)
        {
            for(var i = 0; i < this.emitters.length; i++){
                var e = this.emitters[i];
                e.draw(this.ctx);
            }
            //console.log(this.particleCounter+"/"+this.particleCounterMax);
            if(this.particleCounterMax==this.particleCounter){
                this.ctx.fillStyle="black"
                this.ctx.rect(0,0,this.WIDTH,this.HEIGHT);   
                this.ctx.fill();
                this.gameState=this.GAME_STATE.MAIN;
            }
        }
    },

    //HELPER METHODS ============================================================================================================================================\

//keyboard input
    keyPress:function(e){
        if(app.main.gameState == app.main.GAME_STATE.PLAY){
            console.log(app.main.blackTile);
        //console.log(e);
            if(e.char=="a"){
                if(app.main.blackTile%app.main.numDivs>0){
                    app.main.switchTiles(-1,0);
                    app.main.blackTile--;
                }
            }
            if(e.char=="d"){
                if(app.main.sortedTiles[app.main.blackTile].x<app.main.numDivs){
                    app.main.switchTiles(1,0);
                    app.main.blackTile++;
                }
            }            
            if(e.char=="w"){
                if(app.main.sortedTiles[app.main.blackTile].y>0){
                    app.main.switchTiles(-app.main.numDivs,1);
                    app.main.blackTile-=app.main.numDivs;
                }
            }            
            if(e.char=="s"){
                if(app.main.sortedTiles[app.main.blackTile].y<app.main.numDivs){
                    app.main.switchTiles(app.main.numDivs,1);
                    app.main.blackTile+=app.main.numDivs;
                }                
            }
        }
    },

    switchTiles:function(newSpot,dir){
        console.log("switch");
        if(dir==0){
            var temp = app.main.sortedTiles[app.main.blackTile+newSpot].x;
            app.main.sortedTiles[app.main.blackTile+newSpot].x = app.main.sortedTiles[app.main.blackTile].x;
            app.main.sortedTiles[app.main.blackTile].x=temp;
            app.main.gamestate=app.main.GAME_STATE.MOVING;
        }
        else if(dir==1){
            var temp = app.main.sortedTiles[app.main.blackTile+newSpot].y;
            app.main.sortedTiles[app.main.blackTile+newSpot].y = app.main.sortedTiles[app.main.blackTile].y;
            app.main.sortedTiles[app.main.blackTile].y=temp;
            app.main.gamestate=app.main.GAME_STATE.MOVING;
        }
    },

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
            ctx.save();
            
            //draw only part of the image
            ctx.drawImage(
                this.img, //original image
              
                //crop
                this.originX * this.width, this.originY * this.height, this.width, this.height,
                
                //draw image
                this.x * this.width*this.imgXScale, 
                this.y * this.height*this.imgYScale, 
                
                this.width*this.imgXScale, 
                this.height*this.imgYScale
            );

            //draw boarder around each tile to clearly show divs
            if(this.selected)
            {
                ctx.strokeStyle="red";  
            }
            else
            {
                ctx.strokeStyle="green";
            }
            ctx.rect(this.x * (this.width*this.imgXScale), this.y * this.height*this.imgYScale, this.width*this.imgXScale, this.height*this.imgYScale);

            ctx.stroke();
            
            ctx.restore();
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
                
                //img properties
                t.img = app.main.img;
                t.imgXScale = (app.main.WIDTH / t.img.width);
                t.imgYScale = (app.main.HEIGHT / t.img.height);

                //length width properties
                t.width = app.main.img.width / (num + 1);
                t.height = app.main.img.height / (num + 1);

                //other proerties
                t.selected = false;

                //teach the circles their methods
                t.draw = drawTile;
                t.move = moveTile;
                t.isLast=false;
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
            var t = this.sortedTiles[i];
            if(!t.isLast)t.draw(ctx);
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
                //chnage gameState to moving so we'll update
                app.main.gameState = this.GAME_STATE.MOVING;
                
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
                
                //chnage gameState to moving
                app.main.gameState = app.main.GAME_STATE.MOVING;
            }   
        }
    },

    //clears the screen
    clear: function(ctx)
    {
        // i) draw background
        ctx.fillStyle = "black"; 
        ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
    },

    //draws all HUD elements
    drawHUD: function(ctx){
        ctx.save(); // NEW

        ctx.restore(); // NEW

    },

    //draw main menu
    drawMainMenu: function(ctx)
    {
        ctx.save();
        
        //draw logo
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.drawImage(this.logo, 60, 100, 700, 125);

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
            
            //chaneg state to oving so we only update once
            app.main.gameState = app.main.GAME_STATE.MOVING;
        }
        else if(app.main.gameState == app.main.GAME_STATE.MOVING)
        {
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
        ctx.fillText(this.numDivs, (this.btnAddDiv.x + (this.btnAddDiv.width / 2) - 20), (this.btnAddDiv.y + (this.btnAddDiv.height * 2)));
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
        //this.tiles.splice(this.tiles.length-1,1);
        this.tiles[this.tiles.length-1].isLast=true;
        app.main.blackTile=this.tiles.length-1;

        //console.log("hit shuff");
        //loop through array of tiles and switch around the x,y cords.
        for(var j=0;j<this.tiles.length-1;j++){
            var rand = Math.floor(getRandom(0,this.tiles.length-1));

            var tempX = this.tiles[rand].x;
            var tempY = this.tiles[rand].y;

            this.tiles[rand].x=this.tiles[j].x;
            this.tiles[rand].y=this.tiles[j].y;
            this.tiles[j].x=tempX;
            this.tiles[j].y=tempY;
        }
        this.sortedTiles=this.tiles.slice(0,this.tiles.length);

        var sort = true;
        //shorthand for section
        var st=this.sortedTiles;
        while(sort){
            for(var j=0;j<st.length;j++){
                for(var i=0;i<st.length;i++){
                    if(i==j) break;
                    if((st[j].x>st[i].x)&&(st[j].y==st[i].y)){
                        sort=false;
                    }
                    else if((st[j].x<st[i].x)&&(st[j].y==st[i].y)){
                        var temp = st[i].x;
                        st[i].x=st[j].x;
                        st[j].x=temp;
                        sort=true;
                    }
                    else if((st[j].y<st[i].y)&&(st[j].x==st[i].x)){
                        var temp = st[i].y;
                        st[i].y=st[j].y;
                        st[j].y=temp;
                        sort=true;
                    }
                    else if((st[j].y<st[i].y)&&(st[j].x<st[i].x)){
                        var temp = st[i].y;
                        st[i].y=st[j].y;
                        st[j].y=temp;
                        var temp = st[i].x;
                        st[i].x=st[j].x;
                        st[j].x=temp;
                        sort=true;
                    }
                }
            }
        }
        console.log(this.sortedTiles);
        //sort new array for movement

    },
    genChildParticles:function(x,y){
        var drawChild = function(ctx){
            if(this.life<=0&&!this.isDead){
                app.main.particleCounter++;
                this.isDead=true;
            }
            else if(this.isDead);
            else{
                ctx.save()
                this.x+=(this.destX-this.x)/this.speed;
                this.y+=(this.destY-this.y)/this.speed;

                ctx.fillStyle=this.color;
                ctx.beginPath();
                ctx.arc(this.x,this.y,3,0,Math.PI,false);
                ctx.fill();
                ctx.restore();
                this.life--;
            }
        };
        for(var i=0;i<getRandom(3,5);i++){
            app.main.particleCounterMax++;

            var temp = {};
            temp.x=x;
            temp.y=y;
            temp.color = getRandomColor();
            temp.destX = Math.floor(getRandom(x-100,x+100));
            temp.destY = Math.floor(getRandom(y-100,y+100));
            temp.speed=getRandom(100,300);
            temp.draw=drawChild;
            temp.life = getRandom(300,500);
            temp.isDead=false;
            Object.seal(temp);
            app.main.emitters.push(temp); 
        }
    },
    genParticles:function(){
        var drawSpawner = function(ctx){
            if(this.isDead);
            else if(this.life<=-10&&!this.isDead){
            app.main.particleCounter++;
                this.isDead=true;

            }
            else if(this.life<=0&&this.life>-10){
                app.main.genChildParticles(this.x,this.y);
                this.life--;
            }
            else{
                ctx.save()
                this.x+=(this.destX-this.x)/this.speed;
                this.y+=(this.destY-this.y)/this.speed;

                ctx.fillStyle=this.color;
                ctx.beginPath();
                ctx.arc(this.x,this.y,3,0,Math.PI,false);
                ctx.fill();
                ctx.restore();
                this.life--;
            }
            //if(this.x+2>this.destX&&this.x-2<this.destX&&this.y+2>this.destY&&this.y-2<this.destY){

            //}
        };
        for(var i=0;i<10;i++){
            app.main.particleCounterMax++;
            var temp = {};
            temp.x=Math.floor(getRandom(0,app.main.WIDTH));
            temp.y=app.main.HEIGHT;
            temp.color = getRandomColor();
            temp.destX = Math.floor(getRandom(0,app.main.WIDTH));
            temp.destY = Math.floor(getRandom(0,app.main.HEIGHT));
            temp.speed=getRandom(100,300);
            temp.isDead=false;
            temp.draw=drawSpawner;
            temp.life = getRandom(300,500);
            Object.seal(temp);
            app.main.emitters.push(temp); 
        }

    }
}; // end app.main