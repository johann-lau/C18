const PLAY=1; const END=0;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png")
  ground_animation = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  restart_image = loadImage("restart.png");
  gameover_image = loadImage("gameOver.png");
  obstacle1_image = loadImage("obstacle1.png");
  obstacle2_image = loadImage("obstacle2.png");
  obstacle3_image = loadImage("obstacle3.png");
  obstacle4_image = loadImage("obstacle4.png");
  obstacle5_image = loadImage("obstacle5.png");
  obstacle6_image = loadImage("obstacle6.png");
  sfx_jump = loadSound("jump.mp3");
  sfx_die = loadSound("die.mp3");
  sfx_checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
  velocity = -12;
  gameState = PLAY;
  score = 0;
  clouds = createGroup();
  obstacles = createGroup();
  createCanvas(displayWidth, displayHeight);
  trex = createSprite(30, displayHeight-180, 30, 40);
  trex.addAnimation("trexr", trex_running);
  trex.addImage("trexc", trex_collided);
  trex.scale = 0.5;
  ground = createSprite(300,displayHeight-135,displayWidth,5);
  ground.velocityX=velocity;
  ground.addImage("ground", ground_animation);
  dummy_ground = createSprite(displayWidth/2,displayHeight-130,displayWidth,5);
  //dummy_ground.visible = false;
  dummy_ground.debug = true;
  restart = createSprite(300, 120, 20, 20);
  restart.addImage("restart", restart_image);
  restart.visible = false;
  restart.scale = 3;
  gameover = createSprite(displayWidth/2, displayHeight/2, 20, 20);
  gameover.addImage("gameover", gameover_image);
  gameover.visible = false;
  gameover.scale = displayWidth/1000;
  edges = createEdgeSprites();
  trex.setCollider("rectangle", 140, 0, 250, 90);
  trex.debug = true;
}

function reload() {
  velocity = -12;
  score = 0;
  clouds.destroyEach();
  obstacles.destroyEach();
  trex.changeAnimation("trexr")
  trex.scale = 0.5;
  ground.velocityX=velocity;
  dummy_ground.visible = false;
  restart.visible = false;
  gameover.visible = false;
  gameState = PLAY;
}

function make_cloud() {
  if (frameCount%67 == 0) {
    var cloud = createSprite(displayWidth,displayHeight-300,50,20);
    cloud.scale = 0.8;
    clouds.add(cloud)
    cloud.velocityX = velocity/2;
    cloud.addImage("cloud", cloud_image);
    trex.depth = cloud.depth+1;
    cloud.lifetime = 300;
  }
}

function make_obstacle() {
  if (frameCount%47 == 0) {
    var obstacle = createSprite(displayWidth,displayHeight-180,400,400);
    obstacle.velocityX = velocity;
    obstacle.velocityY = 10;
    obstacle.scale = 0.6;
    obstacles.add(obstacle);
    obstacle.debug = true;
    var obstaclecount = Math.round(random(1,6));
    console.log(obstaclecount);
    switch (obstaclecount) {
      case 1:
        obstacle.addImage("obstacle", obstacle1_image);
        break;
      case 2:
        obstacle.addImage("obstacle", obstacle2_image);
        break;
      case 3:
        obstacle.addImage("obstacle", obstacle3_image);
        break;
      case 4:
        obstacle.addImage("obstacle", obstacle4_image);
        obstacle.scale = 0.08
        break;
      case 5:
        obstacle.addImage("obstacle", obstacle5_image);
        break;
      case 6:
        obstacle.addImage("obstacle", obstacle6_image);
        break;
    }
    trex.depth = obstacle.depth+1;
    obstacle.lifetime = 300;
  }
}

function draw() {
  console.time();
  if (gameState == PLAY) {
    velocity = velocity - 0.05;
    //trex.setCollider("rectangle", -velocity*20, 0, 250, 90); 
    ground.velocityX=velocity;
    if (Math.round(frameCount/1000%2)==0) {
      background("white");
    } else {
      background("darkgrey");
    }
    trex.velocityY=trex.velocityY+0.8;
    if ((keyDown("SPACE") || touches.length>0) && trex.isTouching(dummy_ground)) {
      trex.velocityY=-12;
      sfx_jump.play();
      touches=[]
    }
    if (ground.x<0) {
      ground.x = ground.width/2;
    }
    if (frameCount%200 == 0) {
      sfx_checkpoint.play();
    }
    score = score + Math.round(getFrameRate()/3); //Math.round(frameCount/90);
    make_cloud();
    make_obstacle();
    if (obstacles.isTouching(trex) && trex.collide(dummy_ground)) {
      trex.velocityY=-10;
      sfx_jump.play();
      trex.velocityX = 0;
      trex.velocityY = 0;
      ground.velocityX = 0;
      sfx_die.play();
      trex.changeImage("trexc");
      clouds.setLifetimeEach(-1);
      obstacles.setLifetimeEach(-1);
      gameState = END;
    }
  } else {
    trex.velocityX = 0;
    background("white");
    restart.visible = true;
    gameover.visible = true;
    obstacles.setVelocityXEach(0);
    clouds.setVelocityXEach(0);
    if (mousePressedOver(restart)) {
      reload();
    }
  }
  trex.collide(dummy_ground);
  obstacles.collide(dummy_ground);
  drawSprites();
  text("Score: "+score, 500, 30);
}
