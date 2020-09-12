const modes={
    'light':1,
    'dark':0
};
const difficulty={
    'normal':0,
    'medium':0,
    'difficult':0
};

let rightSelected=0;
let gameShape;
let T1=0;
let time;
let history={};
let isLightModeActive=true;
const d = new Date();
$(document).ready(()=>{
    $(".modeSelection").click((e)=>{
       getGameMode(e.target.getAttribute('target-mode'));
    });
    $("#start-game").click(()=>{
        try {
            startGame();
        }catch (e) {
            alert(e.message);
        }
    });

    $("#reset").click(()=>{reset()});
    $('input[type="checkbox"]').click(()=>{
        if(isLightModeActive){
            $('.text-light').addClass("text-dark");
            $('.text-light').removeClass("text-light");
            $('.bg-light').addClass("bg-dark");
            $('.bg-light').removeClass("bg-light");
            $('.gameOverlay').css("background-color","#343a40");
        }else{
            $('.text-dark').addClass("text-light");
            $('.text-dark').removeClass("text-dark");
            $('.bg-dark').addClass("bg-light");
            $('.bg-dark').removeClass("bg-dark");
            $('.gameOverlay').css("background-color","#b3d7ff");
        }
        isLightModeActive=!isLightModeActive;

    })

});
function takeMove(diff){
    let timeInterval;
    switch (diff){
        case 0:
            //the game is normal mode
            timeInterval=1000;
            break;
        case 1:
            timeInterval=700;
            break;
        default:
            timeInterval=500;

    }
    startTime();
    let firstMoveSelected=[]; //container for the first value to be checked in the next click
    let lastSelectedItem; //only as a container for first  clicked item
    $(".overlay").click((e)=>{
        let position_1=parseInt($(e.target).next('img')[0].getAttribute('selected-image-first'));
        let position_2=parseInt($(e.target).next('img')[0].getAttribute('selected-image-second'));
        if(firstMoveSelected.length < 2){
            //show the image and add its position to firstMoveSelected array
            $(e.target).css("z-index",-1);
            lastSelectedItem=e.target;
            firstMoveSelected.push(position_1);
            firstMoveSelected.push(position_2);
        }else if(firstMoveSelected.length === 2){
            //show the image and check if equal add them both to right selected and check if the game is end
            // if not equal hide them both and empty the last selected array
            $(e.target).hide('slow');
            let j=firstMoveSelected.pop();
            let i=firstMoveSelected.pop();
            if(gameShape[i][j][0] === gameShape[position_1][position_2][0] ){
                //the two are equal
                //check if the game has ended
                rightSelected++;
                if(checkIfEnded()){
                    //end Game
                    clearInterval(time);
                    alert("Congratulations You Won ! in just " + T1);
                }
            }else{
                //not equal
                setTimeout(()=>{
                    $(e.target).show('slow');
                    $(lastSelectedItem).css("z-index",2);
                    lastSelectedItem='';
                    },timeInterval);
            }
            firstMoveSelected=[];

        }else{
            throw new Error("some thing went wrong");
        }
    })
}
function checkIfEnded(){
    if(rightSelected === ((gameShape[0].length)*2)){
        return true;
    }
    return false;
}
function distributeImages(size){

    $(".gameOverlay").css({'position':'static'});
    $(".gameOverlay").addClass('d-none');
    $(".gameOverlay").removeClass('d-flex');
    size=size/2;
    let algorithmItems=[];
    for(let i=1;i<=size;i++){
        algorithmItems.push(i);
        algorithmItems.push(i);
    }
    switch (size){
        case 8:
            gameShape=[
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
            ];
            break;
        case 10:
            gameShape=[
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ];
            break;
        case 12:
            gameShape=[
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
            ];
            break;
        default:
            throw Error("The selected difficult standard is not valid !");

    }

    // Initialize array
    for (let i = 0 ; i < 4; i++) {
        // gameShape[i] = []; // Initialize inner array
        for (let j = 0; j < size/2; j++) { // i++ needs to be j++
            gameShape[i][j]=algorithmItems.splice(Math.floor(Math.random()*algorithmItems.length), 1);
        }
    }
}
function getGameMode(selectedMode){
    switch (selectedMode){
        case 'normal':
            difficulty['normal']=1;
            difficulty['medium']=0;
            difficulty['difficult']=0;
            break;
        case 'medium':
            difficulty['normal']=0;
            difficulty['medium']=1;
            difficulty['difficult']=0;
            break;
        case 'difficult':
            difficulty['normal']=0;
            difficulty['medium']=0;
            difficulty['difficult']=1;
            break;
    }
}
function startGame(){
    let selectedMode;
        for(let el in difficulty){
            if(difficulty[el]===1){
                selectedMode=el;
                break;
            }
        }
    if(selectedMode === undefined)
        throw Error("Please select the game mode !");
    switch (selectedMode){
        case 'normal':
            startNormalGame();
            break;
        case 'medium':
            startMediumGame();
            break;
        case 'difficult':
            startDifficultGame();
            break;
        default:
            throw Error("Please select the game mode !");
    }
}
function startNormalGame(){
    // 4X4 game with speed of 1 second speed
    //start the image distribution
    $('.mainLink > span').html("Normal");
    try {
        distributeImages(16);
    }catch (e){
        alert(e.message);
    }
    $(".gameContainer").empty();
    let element='';
    for (let i=0 ; i<4 ; i++){
        element += "<tr>"
        for (let j=0;j<4;j++){
            element +=`<td target="${i}${j}">
                            <button  class="overlay btn">
                            </button>
                            <img src="assets/images/${gameShape[i][j]}.svg" selected-image-first="${i}" selected-image-second="${j}" class="img-fluid" alt="remember game image">
                        </td>`;
        }
        element += '</tr>'
    }
    $(".gameContainer").append(element);
    try{
        takeMove(0);
    }catch (e){
        alert(e.message);
    }

}
function startMediumGame(){
    // 4X5 game with speed of 0.8 second speed
    $('.mainLink > span').html("Medium");
    try {
        distributeImages(20);
    }catch (e){
        alert(e.message);
    }
    $(".gameContainer").empty();
    let element='';
    for (let i=0 ; i<4 ; i++){
        element += "<tr>"
        for (let j=0;j<5;j++){
            element +=`<td target="${i}${j}">
                            <button  class="overlay btn">
                            </button>
                            <img src="assets/images/${gameShape[i][j]}.svg" selected-image-first="${i}" selected-image-second="${j}" class="img-fluid" alt="remember game image">
                        </td>`;
        }
        element += '</tr>'
    }
    $(".gameContainer").append(element);
    try{
        takeMove(1);
    }catch (e){
        alert(e.message);
    }


}
function startDifficultGame(){
    // 4X6 game with speed of 0.5 second speed
    $('.mainLink > span').html("Difficult");

    try {
        distributeImages(24);
    }catch (e){
        alert(e.message);
    }
    $(".gameContainer").empty();
    let element='';
    for (let i=0 ; i<4 ; i++){
        element += "<tr>"
        for (let j=0;j<6;j++){
            element +=`<td target="${i}${j}">
                            <button  class="overlay btn">
                            </button>
                            <img src="assets/images/${gameShape[i][j]}.svg" selected-image-first="${i}" selected-image-second="${j}" class="img-fluid" alt="remember game image">
                        </td>`;
        }
        element += '</tr>'
    }
    $(".gameContainer").append(element);
    try{
        takeMove(2);
    }catch (e){
        alert(e.message);
    }

}
function startTime(){
    $(".timer").empty();
    time= setInterval(()=>{
      T1++;
       $(".timer").html(T1);
   },1000)
}
function reset(){
    location.reload();
}