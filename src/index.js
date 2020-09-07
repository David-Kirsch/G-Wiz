
let array = ['This is a random questions', 'How many licks in a lollipop?', 'What color is the sky', 'How old is the oldest person?', 'What year was I born?', 'What year are we in?']
const card_text = document.querySelector('.card_text');
card_text.style.setProperty('--animate-duration', '.5s');
card_text.style.setProperty('animation-fill-mode',  'none')
const startbtn = document.querySelector('.start')
const card = document.querySelector('.card')
const text = document.querySelector('h6')
const loggedIn = document.querySelector('.logged-in')
const login = document.querySelector('.login')
const levelBar = document.querySelector('#level')
const difficultyBar = document.querySelector('#difficulty')
const logo = document.querySelector('.logo')
const item3 = document.querySelector('.item3')
const option1 = document.querySelector('#option_1')
const option2 = document.querySelector('#option_2')
const nextBtn = document.querySelector('#next_question')
let filteredQ = []


//when card is clicked, a new question is pulled
nextBtn.addEventListener('click', function(e){
        card_text.classList.add('animate__animated', 'animate__flip');
        pickAQuestion(filteredQ)
});

//new
//when card is clicked, a new question is pulled
// nextBtn.addEventListener('click', function(e){
//     card_text.classList.add('animate_animated', 'animate_flip');
//     pickAQuestion(filteredQ)
// })
// event listener for option buttons
// const optionListener = (question) => {
    card_text.addEventListener('click', function(e){
      if (e.target.matches("#option_1")){
            if(e.target.dataset.btn === e.target.dataset.correct){
                console.log("Correct")
            } else {
                console.log("Wrong")
            }
    } else if (e.target.matches("#option_2") ){
            if(e.target.dataset.btn === e.target.dataset.correct){
                console.log("Correct")
            } else {
                console.log("Wrong")
            }
            
        } 
    })
// }


// sets class back to plain classname after animation flip
card_text.addEventListener('animationend', function(e) {
    card_text.className = 'card_text'
  });

//call to API with level and difficulty passed in so it can be passed to filter function
function getAllQuestions(level, diff){
  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(questions => filterQuestions(questions, level, diff))
}

//all the questions from database are passed into this function. Based on arg's passed in, filtered array
//is created and contains only questions within param
  function filterQuestions(questionsArray, level, diff){
    filteredQ = []
    filteredQ = questionsArray.filter(question => question.level === level && question.difficulty === parseInt(diff))
    pickAQuestion(filteredQ)
  }

  //pull a random question from filtered array
  function pickAQuestion(questions){
      displayQuestion(questions[Math.floor(Math.random() * questions.length)])
  }

  //display question on flashcard
  function displayQuestion(question){
     console.log(question)
    text.innerHTML = `<ul><li>${question.related_words[0]}</li>
    <li>${question.related_words[1]}</li>
    <li>${question.related_words[2]}</li>
    </ul>`
    option1.innerText = question.option_1
    option1.dataset.correct = question.correct_answer
    option2.innerText = question.option_2
    option2.dataset.correct = question.correct_answer
  }

loggedIn.hidden = true;
//card_text.hidden = true;



//login verified 
document.addEventListener('click', function(e){
    loggedIn.hidden = false;
    login.style.backgroundColor = '#a8dadc';
    //login.children[0].remove();
    logo.hidden = true

})

//start button for now
startbtn.addEventListener('click', function(e){
    if(e.target.className === "item5 start"){
    start();
    e.target.className = "item5"
    console.log(e.target)
    }
})

//load game 
function start(){
    getAllQuestions('ES', 1);
    card_text.classList.add('animate__animated', 'animate__bounceInLeft');
    //card_text.hidden = false;
    getDifficulty('ES');
    getLevels();

    
}

//calls API to get a list of all questions then sorts through array to get uniqe level values
function getLevels(){
  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(questions => {
        let levels = []
        let uniqValue = []
      for(let question of questions){
        levels.push(question.level)
      }
      levels.forEach((l) => {
          if(!uniqValue.includes(l)){
              uniqValue.push(l)
          }
      })
      populateLevelBar(uniqValue)
  })
}

// when user selects an option from level, sends option value and 1 (for difficulty) to getAllQuestions()
//also sends the option value to getDifficulty() to grab a list of all the difficulty numbers
levelBar.addEventListener('change', function(e){
    card.click();
    getAllQuestions(e.target.value, 1)
    getDifficulty(e.target.value)
})

//when user clicks on difficulty bar the value from both dropsdowns are sent to getAllQuestions()
difficultyBar.addEventListener('change', function(e){
    console.dir(e.target)
    card.click();
    getAllQuestions(e.target.previousElementSibling.value, e.target.value)
})

//calls API to get a list of all questions then sorts through array to get uniqe difficulty values
function getDifficulty(level){
  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(questions => {
        let difficulty = []
        let uniqValue = []
      for(let question of questions){
        if(question.level === level){
            difficulty.push(question.difficulty)
        }
      }
      difficulty.forEach((d) => {
          if(!uniqValue.includes(d)){
              uniqValue.push(d)
          }
      })
      populateDifficultyBar(uniqValue)
  })
  }

  //create options in select element for difficulties
  function populateDifficultyBar(difficulty){
      difficultyBar.innerHTML = ""
      for(let num of difficulty){
          let option = document.createElement('option')
          option.value = num
          option.innerText = num
          difficultyBar.append(option)
      }
  }

//create options in select element for levels
function populateLevelBar(levels){
    levelBar.innerHTML = ""
    
    let name = "";
    for(let level of levels){
        let option = document.createElement('option')
        option.value = level
        if(level == 'ES'){
            name = 'Elementry School'
        } else if(level == 'MS'){
            name = 'Middle School'
        } else if (level == 'HS'){
            name = 'High School'
        } else {
            name = 'SAT'
        }
        option.innerText = name
        levelBar.append(option)
    }
}





