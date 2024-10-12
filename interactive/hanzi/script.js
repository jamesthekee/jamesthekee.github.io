// initialise stuff
let data;
let correctCount = 0;
let wrongCount = 0;
let gram1;
let gram2;
let freq1;
let freq2;
let answer;
let obscurity = 3;
let difficulty = 3;

// get answer buttons
const buttonA = document.getElementById('button-a');
const buttonB = document.getElementById('button-b');

document.getElementById('button-obsc3').disabled = true;
document.getElementById('button-diff3').disabled = true;


buttonA.disabled = true;
buttonB.disabled = true;


async function fetchData() {
  try {
    const response = await fetch('https://jamesthekee.github.io/assets/data/charfreq.json');
    data = await response.json();
    data = data["unigrams"];
    buttonA.disabled = false;
    buttonB.disabled = false;
    nextQuestion();
  } catch (error) {
    console.error(error);
  }
}
fetchData();

buttonA.addEventListener('click', () => checkQuestion(1));
buttonB.addEventListener('click', () => checkQuestion(2));

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

document.getElementById('button-obsc1').addEventListener('click', () => setObscurity(1));
document.getElementById('button-obsc2').addEventListener('click', () => setObscurity(2));
document.getElementById('button-obsc3').addEventListener('click', () => setObscurity(3));

document.getElementById('button-diff1').addEventListener('click', () => setDifficulty(1));
document.getElementById('button-diff2').addEventListener('click', () => setDifficulty(2));
document.getElementById('button-diff3').addEventListener('click', () => setDifficulty(3));


function setObscurity(x){
  resetCounter();

  document.getElementById('button-obsc1').disabled = false;
  document.getElementById('button-obsc2').disabled = false;
  document.getElementById('button-obsc3').disabled = false;

  if(x==1){
    document.getElementById('button-obsc1').disabled = true;
  }else if(x==2){
    document.getElementById('button-obsc2').disabled = true;
  }else{
    document.getElementById('button-obsc3').disabled = true;
  }

  obscurity = x;
  nextQuestion();
}

function setDifficulty(x){
  resetCounter();

  document.getElementById('button-diff1').disabled = false;
  document.getElementById('button-diff2').disabled = false;
  document.getElementById('button-diff3').disabled = false;

  if(x==1){
    document.getElementById('button-diff1').disabled = true;
  }else if(x==2){
    document.getElementById('button-diff2').disabled = true;
  }else{
    document.getElementById('button-diff3').disabled = true;
  }

  difficulty = x;
  nextQuestion();
}


function nextQuestion() {
  var sampleMax = data.length; // 9933
  var minDiff = 0;
  if(obscurity <=1){
    sampleMax = 200;
    if(difficulty == 3)maxDiff = 6;
    if(difficulty == 2)maxDiff = 60;
    if(difficulty == 1)maxDiff = 100;

  }else if(obscurity <=2){
    sampleMax = 2000;
    if(difficulty == 3)maxDiff = 20;
    if(difficulty == 2)maxDiff = 200;
    if(difficulty == 1)maxDiff = 500;
  }else{
    sampleMax = 7000;
    if(difficulty == 3)maxDiff = 100;
    if(difficulty == 2)maxDiff = 500;
    if(difficulty == 1)maxDiff = 1000;
  }
  var d = Math.floor(Math.random()*maxDiff);
  var maxIndex = sampleMax - d;
  var index1 = Math.floor(Math.random()*maxIndex);
  var index2 = index1 + d;

  
  console.log(d, index1);
  var row1,row2;
  if(Math.floor(Math.random()*2) == 0){
    row1 = data[index1];
    row2 = data[index2];  
  }else {
    row1 = data[index2];
    row2 = data[index1];    
  }

  freq1 = row1[1];
  freq2 = row2[1];
  buttonA.innerHTML = row1[0];
  buttonB.innerHTML = row2[0];
  gram1=row1[0];
  gram2=row2[0];

  if(freq1 < freq2){
    answer = 2;
  }else if(freq1 > freq2){
    answer = 1;
  }else{
    answer = 0;
  }
}

function checkQuestion(x) {
    if(answer == 0){
        correctCount++;
        document.getElementById("answer-feedback").innerHTML = "correct";
        document.getElementById("answer-feedback").style = "color: green";
    }
    else if(x == answer){
        correctCount++;
        document.getElementById("answer-feedback").innerHTML = "correct";
        document.getElementById("answer-feedback").style = "color: green";
    }else{
        wrongCount++;
        document.getElementById("answer-feedback").innerHTML = "wrong";
        document.getElementById("answer-feedback").style = "color: red";
    }
    updateCounter();

    document.getElementById('word1-display').innerHTML = gram1;
    document.getElementById('word2-display').innerHTML = gram2;
    if(answer==1){
        document.getElementById('word-relationship-display').innerHTML = "more";

    }else if(answer == 0){
        document.getElementById('word-relationship-display').innerHTML = "equally";
    }else{
        document.getElementById('word-relationship-display').innerHTML = "less";
    }

    document.getElementById('freq-display1').innerHTML = `${gram1}: ${numberWithCommas(freq1)}`;
    document.getElementById('freq-display2').innerHTML = `${gram2}: ${numberWithCommas(freq2)}`;;

    var ratio = (freq1/freq2).toFixed(3);
    document.getElementById('freq-ratio').innerHTML = `freq ratio: ${ratio}`;

    nextQuestion();
}

function resetCounter(){
  correctCount = 0;
  wrongCount = 0;
  updateCounter();
}

function updateCounter() {
    const correctCounter = document.getElementById('correct-counter');
    const wrongCounter = document.getElementById('wrong-counter');
    correctCounter.textContent = `Correct: ${correctCount}`;
    wrongCounter.textContent = `Wrong: ${wrongCount}`;
}
