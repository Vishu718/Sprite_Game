//BY VISHAL AGRAHARI....
//Player code start..

//PlayerStates code start..
//particles code start...
class Particle {
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
    }
    update(){
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5) this.markedForDeletion = true;
    }
}

class Dust extends Particle{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = 'rgba(0,0,0,0.2)';
    };
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Splash extends Particle{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 100 + 100;
        this.x = x - this.size * 0.4;
        this.y = y - this.size * 0.5;
        this.speedX = Math.random() * 6 - 4;
        this.speedY = Math.random() * 2 + 1;
        this.gravity = 0;
        this.image = document.getElementById('fire');

    }
    update(){
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
    }
    draw(context){
        context.drawImage(this.image , this.x, this.y, this.size, this.size);
    }
}

class Fire extends Particle{
    constructor(game, x, y){
        super(game);
        this.image = document.getElementById('fire');
        this.size = Math.random() * 100 + 100;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }
    update(){
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5);
    }
    draw(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image,  -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();
    }
}
//particles code end..
    const states = {
        SITTING: 0,
        RUNNING: 1,
        JUMPING: 2,
        FALLING: 3,
        ROLLING: 4,
        DIVING: 5,
        HIT: 6,
    }

    class States {
        constructor(states, game){
            this.state = this.state;
            this.game = game;
        }
    }

    class Sitting extends States {
        constructor(game){
            super('SITTING', game);
            //game.this.player = player;
        }
        enter(){
            this.game.player.frameX = 0;
            this.game.player.maxFrame = 4;
            this.game.player.frameY = 5;
            
        }
        handleInput(input){
            if(input.includes('ArrowLeft') || input.includes('ArrowRight')){
                this.game.player.setState(states.RUNNING, 1);
            }
            else if(input.includes('Enter')){
                this.game.player.setState(states.ROLLING, 2);
            }
        }
    }

    class Running extends States {
        constructor(game){
            super('RUNNING', game);
            //this.player = player;
        }
        enter(){
            this.game.player.frameX = 0;
            this.game.player.maxFrame = 8;
            this.game.player.frameY = 3;
        }
        handleInput(input){
            this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.6, this.game.player.y + this.game.player.height));
            if(input.includes('ArrowDown') ){
                this.game.player.setState(states.SITTING, 0);
            }
            else if(input.includes('ArrowUp')){
                this.game.player.setState(states.JUMPING, 1);
            }
            else if(input.includes('Enter')){
                this.game.player.setState(states.ROLLING, 2);
            }
        }
    }

    class Jumping extends States {
        constructor(game){
            super('JUMPING', game);
            //game.this.player = player;
        }
        enter(){
            if (this.game.player.onGround()) this.game.player.vy -= 27;
            this.game.player.frameX = 0;
            this.game.player.maxFrame = 6;
            this.game.player.frameY = 1;
        }
        handleInput(input){
            if(this.game.player.vy > this.game.player.weight){
                this.game.player.setState(states.FALLING, 1);
            }
            else if(input.includes('Enter')){
                this.game.player.setState(states.ROLLING, 2);
            }
            else if(input.includes('ArrowDown')){
                this.game.player.setState(states.DIVING, 0);
            }
        }
    }

    class Falling extends States {
        constructor(game){
            super('FALLING', game);
            //game.this.player = player;
        }
        enter(){
            this.game.player.frameX = 0;
            this.game.player.maxFrame = 6;
            this.game.player.frameY = 2;
        }
        handleInput(input){
            if(this.game.player.onGround()){
                this.game.player.setState(states.RUNNING, 1);
            }
            else if(input.includes('ArrowDown')){
                this.game.player.setState(states.DIVING, 0);
            }
        }
    }

class Rolling extends States {
        constructor(game){
            super('ROLLING', game);
            //this.player = player;
        }
        enter(){
            this.game.player.frameX = 0;
            this.game.player.maxFrame = 6;
            this.game.player.frameY = 6;
        }
        handleInput(input){
            this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
            if(!input.includes('Enter') && this.game.player.onGround()){
                this.game.player.setState(states.RUNNING, 1);
            }
            else if(!input.includes('Enter') && !this.game.player.onGround()){
                this.game.player.setState(states.FALLING, 1);
            }
            else if(input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()){
                this.game.player.vy -= 27;
            }
            else if(input.includes('ArrowDown')  && !this.game.player.onGround()){
                this.game.player.setState(states.DIVING, 0);
            }
        }    
}

class Diving extends States {
    constructor(game){
        super('DIVING', game);
        //this.player = player;
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.vy = 15;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if(this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 30; i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width *0.5, this.game.player.y + this.game.player.height));
            }
        }
        else if(!input.includes('Enter') && this.game.player.onGround()){
            this.game.player.setState(states.ROLLING, 2);
        }
       
    }

    
}

class Hit extends States {
    constructor(game){
        super('HIT', game);
        //this.player = player;
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
        //this.game.player.vy = 15;
    }
    handleInput(input){
        //this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if(this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
           //for (let i = 0; i < 30; i++){
           //     this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width *0.5, this.game.player.y + this.game.player.height));
           // }
        }
        else if(this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
        }
       
    }

    
}
//PlayerStates code end..

//collisionAnimation code start...
class CollisionAnimation {
    constructor(game, x, y){
        this.game = game;
        this.image = document.getElementById('collisionAnimation');
        this.spriteWidth = 100;
        this.spriteHeight = 90;
        this.sizeModifier = Math.random() + 0.5;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.frameX = 0;
        this.maxFrame = 4;
        this.markedForDeletion = false;
        this.fps = Math.random() * 10 + 5;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

    }
    update(deltaTime){
        this.x -= this.game.speed;
        if(this.frameTimer > this.frameInterval){
            this.frameX++;
            this.frameTimer = 0;
        }
        else{
            this.frameTimer += deltaTime;
        }
        
        if (this.frameX > this.maxFrame) this.markedForDeletion = true;

    }
}
//collisionAnimation code end...

//floatingMessage code start....
class FloatingMessage{
    constructor(value, x, y, targetX, targetY){
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markedForDeletion = false;
        this.timer = 0;4
    }
    update(){
        this.x += (this.targetX - this.x) * 0.03;
        this.y += (this.targetY - this.y) * 0.03;
        this.timer++;
        if (this.timer > 100) this.markedForDeletion = true;
    }
    draw(context){
        context.font = '20px Creepster';
        context.fillStyle = 'white';
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = 'black';
        context.fillText(this.value, this.x - 2, this.y - 2);
    }
}
//floatingMessage code end...

class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame 
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
        
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontal movement
         //this.x++;
        this.x += this.speed;
        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        //horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement
        
        //if (input.includes('ArrowUp') && this.onGround()) this.vy -= 30;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        //verticle boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        //sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }
        else {
            this.frameTimer += deltaTime;
        }
        
    }
    draw(context){
        //context.fillStyle = 'red';
        //context.fillRect(this.x, this.y, this.width, this.height);
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy =>{
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
                }
            else{
                this.setState(6, 0);
                this.game.score-=1;
                this.game.lives--;
                if (this.game.lives <=0) this.game.gameOver = true;
            }
            }
            
        });
    }
}
//Player code end...


//input code start..
    class InputHandler{
        constructor(game){
            this.game = game;
            this.keys = [];
            window.addEventListener('keydown', e=>{
        
                if (( e.key === 'ArrowDown' || 
                      e.key === 'ArrowUp' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight' ||
                      e.key === 'Enter')
                      && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
                else if(e.key === 'd') this.game.debug = !this.game.debug;
            });
            window.addEventListener('keyup', e=>{
                if(e.key === 'ArrowDown' ||
                   e.key === 'ArrowUp' ||
                   e.key === 'ArrowLeft' ||
                   e.key === 'ArrowRight' ||
                   e.key === 'Enter'){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }
//input code end..

//background code start...
    class Layer {
        constructor(game, width, height, speedModifier, image){
            this.game = game;
            this.width = width;
            this.height = height;
            this.speedModifier = speedModifier;
            this.image = image;
            this.x = 0;
            this.y = 0;
        }
        update(){
            if (this.x < -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModifier;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }
    class Background {
        constructor(game){
            this.game = game;
            this.width = 1667;
            this.height = 500;
            this.layer1image = document.getElementById('layer1');
            this.layer2image = document.getElementById('layer2');
            this.layer3image = document.getElementById('layer3');
            this.layer4image = document.getElementById('layer4');
            this.layer5image = document.getElementById('layer5');
            this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1image);
            this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image);
            this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image);
            this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image);
            this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image);
            this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
        }
        update(){
            this.backgroundLayers.forEach(layer =>{
                layer.update();
            })
        }
        draw(context){
            this.backgroundLayers.forEach(layer =>{
                layer.draw(context);
            })
        }
    }
//background code end....

//enemies code start...
    class Enemy {
        constructor(){
            this.frameX = 0;
            this.frameY = 0;
            this.fps = 20;
            this.frameInterval = 1000/this.fps;
            this.frameTimer = 0;
            this.markedForDeletion = false;
        }
        update(deltaTime){
            //movement
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;
            if (this.frameTimer > this.frameInterval){
                this.frameTimer = 0;
                if(this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;

            }
            else{
                this.frameTimer += deltaTime;
            }
            //check if off screen
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context){
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);

        }
    }

    class FlyingEnemy extends Enemy{
        constructor(game){
            super();
            this.game = game;
            this.width = 60;
            this.height = 44;
            this.x = this.game.width + Math.random() * this.game.width * 0.5;
            this.y = Math.random() * this.game.height * 0.5;
            this.speedX = Math.random() + 1;
            this.speedY = 0;
            this.maxFrame = 5;
            this.image = document.getElementById('enemy_fly');
            this.angle = 0;
            this.va = Math.random() * 0.1 + 0.1;
        }
        update(deltaTime){
            super.update(deltaTime);
            this.angle += this.va;
            this.y += Math.sin(this.angle);
        }
    }
    class GroundEnemy extends Enemy{
        constructor(game){
            super();
            this.game = game;
            this.width = 60;
            this.height = 87;
            this.x = this.game.width;
            this.y = this.game.height - this.height - this.game.groundMargin;
            this.image = document.getElementById('enemy_plant');
            this.speedX = 0;
            this.speedY = 0;
            this.maxFrame = 1;
        }
    }

    class ClimbingEnemy extends Enemy{
        constructor(game){
            super();
            this.game = game;
            this.width = 120;
            this.height = 144;
            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.5;
            this.image = document.getElementById('enemy_spider_big');
            this.speedX = 0;
            this.speedY = Math.random() > 0.5 ? 1 : -1;
            this.maxFrame = 5;
        }
        update(deltaTime){
            super.update(deltaTime);
            if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
            if (this.y < this.height) this.markedForDeletion = true;
        }
        draw(context){
            super.draw(context);
            context.beginPath();
            context.moveTo(this.x + this.width/2,0);
            context.lineTo(this.x + this.width/2, this.y +50);
            context.stroke();
        }
    }
//enemies code end...
    
//UI code start..
class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = document.getElementById('lives');
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText('Score:' + this.game.score, 20, 50);
        // timer
        context.font = this.fontSize * 0.8 +  'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);
        //lives
        for (let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
        }
       
        //game over messages
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.score > this.game.winningScore){
                context.fillText('Boo-yah', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('What are creatures of the night afraid of? YOU!!!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            else{
                context.fillText('Love at first bite?', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Nope. Better luck next time!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            
            }
        }
        context.restore();
    }
}
//UI code end...


//Main JS code start..
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 50;
            this.speed = 0;
            this.maxSpeed = 4;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            //handlerenemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }
            else{
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            //handle messages
            this.floatingMessages.forEach(message => {
                message.update();
                
            });
            //handle particles
            this.particles.forEach((particle, index) =>{
                particle.update();
            });
            if (this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }

            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
               collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context); 
            });
            this.UI.draw(context);
        }
        addEnemy(){
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this)); 
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
        this.enemies.push(new FlyingEnemy(this));
          //console.log(this.enemies);  
        }
    }
    
    const game = new Game (canvas.width, canvas.height);
    console.log(game);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }

    animate(0);
});
//Main JS code end..
