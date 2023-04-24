// initialise stuff
let data;
let correctCount = 0;
let wrongCount = 0;
let gram1;
let gram2;
let freq1;
let freq2;
let answer;
let difficulty;

// get answer buttons
const buttonA = document.getElementById('button-a');
const buttonB = document.getElementById('button-b');
document.getElementById('button-obsc3').disabled = true;

buttonA.disabled = true;
buttonB.disabled = true;


async function fetchData() {
  try {
    const response = await fetch('https://jamesthekee.github.io/large_unigram.json');
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

document.getElementById('button-obsc1').addEventListener('click', () => setDifficulty(1));
document.getElementById('button-obsc2').addEventListener('click', () => setDifficulty(2));
document.getElementById('button-obsc3').addEventListener('click', () => setDifficulty(3));

function setDifficulty(x){
  correctCount = 0;
  wrongCount = 0;
  updateCounter();

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

  difficulty = x;
  nextQuestion();
}

function nextQuestion() {
  var sampleMax = data.length;
  if(difficulty <=1){
    sampleMax = 4000;
  }else if(difficulty <=2){
    sampleMax = 20000;
  }// else it is 100,000
  console.log(data.length);

  var index = Math.floor(Math.random()*sampleMax);
  gram1 = data[index];
  index = Math.floor(Math.random()*sampleMax);
  gram2 = data[index];    

  freq1 = gram1[1];
  freq2 = gram2[1];
  buttonA.innerHTML = gram1[0];
  buttonB.innerHTML = gram2[0];
  gram1=gram1[0];
  gram2=gram2[0];

  if(freq1 <= freq2){
    answer = 2;
  }else{
    answer = 1;
  }
}

function checkQuestion(x) {
    if(x == answer){
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

    }else{
        document.getElementById('word-relationship-display').innerHTML = "less";
    }

    document.getElementById('freq-display1').innerHTML = `${gram1}: ${numberWithCommas(freq1)}`;
    document.getElementById('freq-display2').innerHTML = `${gram2}: ${numberWithCommas(freq2)}`;;

    var ratio = (freq1/freq2).toFixed(3);
    document.getElementById('freq-ratio').innerHTML = `freq ratio: ${ratio}`;

    nextQuestion();
}

function updateCounter() {
    const correctCounter = document.getElementById('correct-counter');
    const wrongCounter = document.getElementById('wrong-counter');
    correctCounter.textContent = `Correct: ${correctCount}`;
    wrongCounter.textContent = `Wrong: ${wrongCount}`;
}