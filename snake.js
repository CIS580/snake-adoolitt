/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var periodicall_Timer = 0;
var growSnake = false;
var speed = 1/16/1000;
var cell_width = 10;
var score = 0;
var snake_array;
var food;
var d = "right";
var gameOver = false

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  console.log("gameover", gameOver);
  if(!gameOver)
  {
    var elapsedTime = newTime - oldTime;

    update(elapsedTime);
    render(elapsedTime);

    // Flip the back buffer
    frontCtx.drawImage(backBuffer, 0, 0);

    // Run the next loop
    window.requestAnimationFrame(loop);
  }
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  console.log("update");
  periodicall_Timer += elapsedTime;

  var nx = snake_array[0].x;
  var ny = snake_array[0].y;

  // TODO: Spawn an apple periodically
  if(periodicall_Timer >= 30000)
  {
    create_food();
    periodicall_Timer = 0;
  }
  // TODO: Move the snake
  switch(d) {
    case "up": ny -= 1; break;
    case "down": ny += 1; break;
    case "left": nx -= 1; break;
    case "right": nx += 1; break;
  }

  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  if(nx >= frontBuffer.width / 10 || ny >= frontBuffer.height / 10 || nx < 0 || ny < 0)
  {
    console.log("out of bounds");
    gameOver = true;
  }
  // TODO: Determine if the snake has eaten an apple
  if(nx == food.x && ny == food.y)
	{
		score += 10;
    growSnake = true;
	}
  else
  {
    console.log("moving");
    var tail = snake_array.pop(); //pops out the last cell
    tail.x = nx; tail.y = ny;
  }

    // TODO: Grow the snake periodically
    if(growSnake)
    {
      var tail = {x: x, y: y};
      growSnake = false;
    }


  // TODO: Determine if the snake has eaten its tail
  if(check_collision(nx, ny, snake_array))
		{
      console.log("ate my tail");
			//create game over
      gameOver = true;

		}
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

      snake_array.unshift(tail); //puts back the tail as the first cell
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.fillStyle = "white";
  backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer
  for(var i = 0; i < snake_array.length; i++)
	{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y);
      console.log(c);
	}

	//Lets paint the food
	paint_cell(food.x, food.y);
	//Lets paint the score
	var score_text = "Score: " + score;
	backCtx.fillText(score_text, 5, backBuffer.height - 5);
}



var input = {
	up: false,
	down: false,
	left: false,
	right: false

}

window.onkeydown = function(event)
{
	switch(event.keyCode)
	{
		//Up
		case 38:
		case 87:
          if(d !=  "down")
          {
               d = "up";
			         input.up = true;
          }
			break;
		//left
		case 37:
		case 65:
         if(d != "right")
         {
              d = "left";
			        input.left = true;
         }
			break;
		//Down
		case 40:
		case 68:
         if(d != "up")
         {
              d = "down";
			        input.down = true;
         }
			break;
		//right
		case 39:
		case 68:
         if(d != "left")
         {
              d = "right";
			        input.right = true;
         }
			break;

	}
}


window.onkeyup = function(event)
{
	switch(event.keyCode)
	{
		//Up
		case 38:
		case 87:
			input.up = false;
			break;
		//left
		case 37:
		case 65:
			input.left = false;
			break;
		//Down
		case 40:
		case 68:
			input.down = false;
			break;
		//right
		case 39:
		case 68:
			input.right = false;
			break;
	}
}

function create_snake()
{
	var length = 5; //Length of the snake
	snake_array = []; //Empty array to start with
	for(var i = length-1; i>=0; i--)
	{
		//This will create a horizontal snake starting from the top left
		snake_array.push({x: i, y:0});
	}
}

function create_food()
{
	food = {
		x: Math.round(Math.random()*(frontBuffer.width-cell_width)),
		y: Math.round(Math.random()*(frontBuffer.height-cell_width)),
	};
	//This will create a cell with x/y between 0-the width of canvas
}

//Generic function to paint cells
function paint_cell(x, y)
{
	backCtx.fillStyle = "blue";
	backCtx.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
	//backCtx.strokeStyle = "white";
	//backCtx.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
}

function check_collision(x, y, array)
{
	//This function will check if the provided x/y coordinates exist
	//in an array of cells or not
	for(var i = 0; i < array.length; i++)
	{
		if(array[i].x == x && array[i].y == y)
		 return true;
	}
	return false;
}

  create_food();
  create_snake();



/* Launch the game */
window.requestAnimationFrame(loop);
