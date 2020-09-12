const canvas=document.getElementById('game');
const ctx = canvas.getContext('2d');


let player;
let obstacles= [];
let keys= {};
let score;
let scoreText;
let highscore;
let highscoreText;
let gravity;
let speed;


//event listner
document.addEventListener('keydown',function(evt){
    keys[evt.code]=true;
   
});
document.addEventListener('keyup',function(evt){
    keys[evt.code]= false;
});





class Player{
    constructor(x, y, w, h, c){
        this.x=x;
        this.y=y;
        this.w=w;   //width
        this.h=h;   //height
        this.c=c;   

        this.dy = 0;   //direction
        this.jumpForse= 15;
        this.originalHeight = h;
        this.grounded = false;
        this.jumpTimer= 0;
    }




    Animate(){
        //jump
        if (keys['ArrowUp'] || keys['KeyW']){
            this.jump();
        }else{
            this.jumpTimer = 0;
        }

        //player down
        if(keys['ArrowDown'] || keys['KeyS']){
            this.h = this.originalHeight/2;
        }else{
            this.h =this.originalHeight;
        }

        this.y += this.dy;

        //gravity
        if(this.y + this.h < canvas.height){
            this.dy +=gravity;
            this.grounded =false;
        } else{
            this.dy = 0;
            this.grounded =true;
            this.y = canvas.height-this.h;
        }


        this.Draw();
    }


    jump(){
        if(this.grounded && this.jumpTimer ==0){
            this.jumpTimer =1;
            this.dy = -this.jumpForse;
        }else if(this.jumpTimer >0 && this.jumpTimer<15){
            this.jumpTimer++;
            this.dy =-this.jumpForse -(this.jumpTimer/50);
        }
    }

    Draw(){
       ctx.beginPath();
       ctx.fillStyle= this.c;
       ctx.fillRect(this.x, this.y, this.w, this.h);
       ctx.closePath();

    }
}




class Obstacle{
    constructor(x, y, w, h, c){
        this.x=x;
        this.y=y;
        this.w=w;   //width
        this.h=h;   //height
        this.c=c;   

        this.dx = -gameSpeed;   
        
    }
    Update(){
        this.x += this.dx;
        this.Draw(); 
        this.dx =-gameSpeed;
    }

    Draw(){
        ctx.beginPath();
        ctx.fillStyle= this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}



class Text{
    constructor(t,x,y,a,c,s){
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
        
    }

    Draw(){
        ctx.beginPath();
        ctx.fillStyle =this.c;
        ctx.font = this.s +"px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.t, this.x, this.y);
        ctx.closePath();
    }
}









//functions
function EnemyObstacle(){
    let size = RandomIntInRange(20, 70);
    let type = RandomIntInRange(0, 1);
    let obstacle = new Obstacle(canvas.width + size, canvas.height-size, size, size, 'blue');

    if(type ==1){
        obstacle.y -= player.originalHeight- 10;
    }
    obstacles.push(obstacle);
}

function RandomIntInRange(min, max){
    return Math.round(Math.random() *(max- min) + min);
}

function Start(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = "20px sans-serif";

    gameSpeed = 3;
    gravity=1;
    score=0;
    highscore=0;
   // if (localStorage.getItem('highscore')){                                        //get the saved highscore
   //     highscore = localStorage.getItem('highscore');
   // }

    player = new Player(25, 0, 30, 50, 'red');

    scoreText =new Text("Score: " +score, 80, 60, "left",'red', "60");
    highscoreText = new Text("High Score: " +highscore, canvas.width-30,50,"right", 'green', "40");

    requestAnimationFrame(Update);


}

let initialEnemyTimer = 200;
let enemyTimer =initialEnemyTimer;

function Update(){
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    enemyTimer--;
    if(enemyTimer<=0){
        EnemyObstacle();
        enemyTimer = initialEnemyTimer- gameSpeed * 8;

        if(enemyTimer<60){
            enemyTimer= 60;
        }
    }

    //enemies
    for(let i = 0; i< obstacles.length; i++){
        let o=obstacles[i];

        //hit
        if(o.x + o.w<0){
            obstacles.splice(i, 1);

        }
        if(
            player.x < o.x + o.w &&
            player.x + player.w> o.x &&
            player.y < o.y + o.h &&
            player.y + player.h >o.y
        ){
            obstacles =[];
            score = 0;
            enemyTimer = initialEnemyTimer;
            gameSpeed = 3;
            //window.localStorage.setItem('highscore',highscore);     //save highscore
        }

        o.Update();
    }

    player.Animate();
    score++;
    scoreText.t = "Score: "+score;
    scoreText.Draw();

    //check if the highscore
    if(score > highscore){
        highscore = score;
        highscoreText.t = "Highscore: " +highscore;
    }
    highscoreText.Draw();

    gameSpeed += 0.003;
}

Start();


