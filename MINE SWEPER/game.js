// פ' שמגדירה את רמת המשחק
function ctor(b, r,c){

    var click = document.getElementById('click');
    click.play();
    minesCount =b;
    rows = r;
    col = c; 
    document.querySelector(".popup").style.display = "none";
    audio = document.getElementById('audio');
    playPauseButton = document.getElementById('playPauseButton');
    isOn = 0; 
   playPause();
}
// פונקציה השומרת את השם (אם התקבל אחד כזה)
function n(){
    name = document.getElementById("name1").value;
}
var board =[];
var minesLocation = [];
var tilesClicked = 0;
var gameOver = false;

// פונקציה המבטלת את ברירת המחדל של הקליק הימני
window.oncontextmenu = function () {
    console.log("Right Click Disabled");
    return false;
}

// פ המרנדמת את מיקומי המוקשים
function setMines(){
    let minesLeft = minesCount;
    while(minesLeft > 0){
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*col);
        let id = r.toString() + "-" + c.toString();
        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft--;
        }
    }
}

// פונקציה המפעילה את כל המשחק
function startGame(b, r,c){


    ctor(b, r,c);

    //חלונית POPUP של ההראות
document.querySelector("#close").addEventListener("click",
function(){
   document.querySelector(".popR").style.display = "none";
}
);

document.querySelector("#r2").addEventListener("click",
function(){
   document.querySelector(".popR").style.display = "block";
}
);

    document.getElementById("mines-count").innerText = minesCount; //כותבת את מס הפצצצות העכשיווי
    // הגדרת גודל הלוח בהתאם לרמה המבוקשת
    document.getElementById("board").style.width=rows*50+"px";
    document.getElementById("board").style.height=rows*50+"px"   
    setMines(); // מרנדמת מוקשים
    //יוצרת את הלוח ע"י יצירת div עבור כל אריח והוספת ארוע לחיצה
    for(let i = 0; i < rows ;i++){
        let row = [];
        for(let j =0; j<col;j++){
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", clickright);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

// בלחיצה על הקליק הימני הפונקציה תוסיף או תסיר דגל
function clickright(){
    let tile = this; 
    if(tile.innerText =="" && !gameOver){
        tile.innerText = "🚩";
        document.getElementById("mines-count").innerText--;
    }
    else if(tile.innerText == "🚩"){
        tile.innerText ="";
        document.getElementById("mines-count").innerText++;
    }
}

// פונקציה המופעלת בעת לחיצה על הקליק השמאלי, על אריח שאינו גלוי
function clickTile(){
    if(gameOver || this.classList.contains("tile-clicked")){
        return;
    }
    if(this.innerText ==""){
     let tile = this;
     if(minesLocation.includes(tile.id)){
         gameOver=true;
         revealMines();
         return;
     }
     let coords=tile.id.split("-");
     let r = parseInt(coords[0]);
     let c = parseInt(coords[1]);
     checkMine(r, c);
    }
    var click = document.getElementById('click');
    click.play();
}

// פ' שחושפת את כל הפצצות 
// במקרה ונפסלנו
function revealMines(){
    var boom = document.getElementById('boom');
    boom.play();
    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            let tile=board[i][j];
            if(minesLocation.includes(tile.id)){
                tile.innerText="💣";
                tile.style.backgroundColor="red";
            }
        }
    }
// לעשות יותר חכם
    document.querySelector(".over").style.display = "block";
    document.getElementById("win").innerText =`${name}
    What  a looser👎👎`;
    setTimeout(
        function open(event){
            document.querySelector(".over").style.display = "none";
            document.querySelector(".end").style.display = "block";
            var looser = document.getElementById('loose');
            looser.play();

        },2000)
}

//פ' רקורסיבית שמקבלת מיקום על הלוח ומגלה את מספר הפצצות שמסביב
function checkMine(i, j){
    if(i<0  || i>= rows || j<0 || j>= col)//למקרה שהמיקום הוא  OOB
        return;
    if(board[i][j].classList.contains("tile-clicked"))
        return;
    board[i][j].classList.add("tile-clicked");
    tilesClicked++;

    let minesFound = 0;
    //top 3
    minesFound+= checkTile(i-1,j);
    minesFound+= checkTile(i-1, j-1);
    minesFound+= checkTile(i-1, j+1);
    //left & right
    minesFound+= checkTile(i, j-1);
    minesFound+= checkTile(i, j+1);
    //down 3
    minesFound+= checkTile(i+1, j-1);
    minesFound+= checkTile(i+1, j);
    minesFound+= checkTile(i+1, j+1);
    if(minesFound>0){
        board[i][j].innerText = minesFound;
        board[i][j].classList.add("x"+minesFound.toString());
    }
    else{
        checkMine(i-1,j-1)
        checkMine(i-1,j)
        checkMine(i-1,j+1)
        checkMine(i,j-1)
        checkMine(i,j+1)
        checkMine(i+1,j-1)
        checkMine(i+1,j)
        checkMine(i+1,j+1)
    }
    //in case we won
   if(tilesClicked==rows*col-minesCount){
      document.getElementById("mines-count").innerText="Cleared";
      gameOver=true;
      document.getElementById("win").innerText =`${name}
      congreatulations!!!  you won!`;

//confetti
      var end = Date.now() + (15 * 1000);
var colors = ['#bb0000', '#ffffff'];
(function frame() {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors
  });
  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors
  })
  if (Date.now() < end) {
    requestAnimationFrame(frame);
  }
}());

      setTimeout(
          function open(event){
              document.querySelector(".end").style.display = "block";
              var clap = document.getElementById('clap');
              clap.play();
          },2000)
   }
}


function checkTile(i, j){
    if(i<0 || i>= rows || j<0 || j>= col)//למקרה שהמיקום הוא  OOB
       return 0;      
    if(minesLocation.includes(i.toString()+"-"+j.toString()))
      return 1;
    return 0;
}

// מפעילה או עוצרת את מוזיקת הרקע
function playPause(){
    console.log(isOn);
    if(isOn == 0) 
    {
        isOn = 1;
        audio.play();
        playPauseButton.innerHTML ="&#128266;";  //or the icon &#9658;         
    }
    else
    {
        isOn = 0;
        audio.pause();
        playPauseButton.innerHTML ="&#128264;" //  or the icon &#9628;

    }

}