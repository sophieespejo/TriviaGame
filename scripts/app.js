let splashContainer = document.getElementById('splash-container'),
    startForm = document.getElementById('start-form'),
    radioContainers = document.querySelectorAll('.radio-container'),
    radioInputs = document.querySelectorAll('input'),
    bestScores = document.querySelectorAll('.best-score-value'),
    countdownTxt = document.getElementById('countdownTxt'),
    questionContainer = document.getElementById('question-container'),
    instructionContainer = document.getElementById('instructions-container'),
    resultContainer = document.getElementById('result-container'),
    questionTxt = document.getElementById('questionTxt'),
    optionsBtn = document.getElementsByClassName('optionBtn'),
    scoreTxt = document.getElementById('scoreTxt'),
    currentQNum = document.getElementById('currentQNum'),
    timerText = document.getElementById('timerText'),
    resultText = document.getElementById('resultText'),
    playAgainBtn = document.getElementById('playAgainBtn'),
    difficultyLvl,
    easyQuestions,
    mediumQuestions,
    hardQuestions,
    points = 0,
    questionNum = 1,
    displayedQuestions = [],
    bestScoreArr = [],
    finalPointDisplay,
    fetchedQuestions,
    arrIndex = 0,
    countdownTimer,
    rNumArr = [],
    timeLeft = 10,
    startBtn = document.getElementById('startBtn');




//start countdown when startbtn is clicked
startBtn.addEventListener('click', countdownStart);

// easy mode is selected
function getEasyQuestions()
{
    fetch("../../data/easy.json").then(
        response => response.json()
    ).then(
        data => 
        {
            easyQuestions = data.easyQuestions;
            fetchedQuestions = easyQuestions;
            getRandomQs();
        }
    )
}

// medium mode is selected
function getMediumQuestions()
{
    fetch("../../data/medium.json").then(
        response => response.json()
    ).then(
        data => 
        {
            mediumQuestions = data.mediumQuestions;
            fetchedQuestions = mediumQuestions;
            getRandomQs();
        }
    )
}

// hard mode is selected
function getHardQuestions()
{
    fetch("../../data/hard.json").then(
        response => response.json()
    ).then(
        data => 
        {
            hardQuestions = data.hardQuestions;
            fetchedQuestions = hardQuestions;
            getRandomQs();
        }
    )
}

//refresh splash page best scores
function bestScoresToDOM()
{
    finalPointDisplay = points;
    for(let i=0; i<bestScores.length; i++)
    {
        bestScores[i].textContent = `${bestScoreArr[i].bestScore}`;
    }
}

//check local storage for best scores, set bestScoreArray
function getSavedBestScores()
{
    finalPointDisplay = points;
    if(localStorage.getItem('bestScores'))
    {
        bestScoreArr = JSON.parse(localStorage.bestScores);
    }
    else{
        bestScoreArr = [
        { difficulty: 'easy', bestScore: finalPointDisplay },
        { difficulty: 'medium', bestScore: finalPointDisplay },
        { difficulty: 'hard', bestScore: finalPointDisplay },
        ];
        localStorage.setItem('bestScores', JSON.stringify(bestScoreArr));
    }
  bestScoresToDOM();
}



//update bestScoreArray
function updateBestScore()
{
    for(let i=0; i< bestScores.length; i++)
    {
        if(difficultyLvl === bestScoreArr[i].difficulty)
        {
            //return best score as a number with one decimal
            const savedBestScore = parseInt(bestScoreArr[i].bestScore);
            //update is the new final score is better or less than currect best score
            if (savedBestScore === 0 || savedBestScore < points)
            {
                bestScoreArr[i].bestScore = finalPointDisplay;
            }
        }
    }
  //save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArr));
  //update Splash page
  bestScoresToDOM();
}


//removes a second to time played
function countdown() 
{
    timeLeft--;
    timerText.textContent = timeLeft + ' seconds remaining';
    console.log('timeleft:'+timeLeft);
    if (timeLeft == 5) 
    {
        console.log('inside if timeleft:'+timeLeft)
        specialFeature();
    } 
    else if (timeLeft <= 0)
    {
        showRightAnswer();
        clearInterval(countdownTimer);
        givePoints();
    }
}


//randomly removes a wrong answer after 10 seconds
function specialFeature()
{
    console.log('ca '+displayedQuestions[arrIndex].correctAnswer);
    let randomNum = Math.floor(Math.random()*4);
    console.log('answer to remove:'+randomNum);
    let rNumSameAsCA = true;
    while (rNumSameAsCA)
    {
        console.log('special feature running');
        if(displayedQuestions[arrIndex].correctAnswer == randomNum)
        {
            randomNum = Math.floor(Math.random()*4);
        }
        else
        {
            optionsBtn[randomNum].classList.add('hideDisplay');
            rNumSameAsCA = false;
        }
    }
}

//playagain event listener
playAgainBtn.addEventListener('click', function()
{
    resultContainer.hidden = true;
    splashContainer.hidden = false;
    questionNum = 1;
    points = 0;
    countdownTxt.textContent = '';

})

//displays correct answer
function showRightAnswer()
{
    for(let i=0; i<optionsBtn.length; i++)
    {
        optionsBtn[i].disabled = true;
        if(optionsBtn[i].value == displayedQuestions[arrIndex].correctAnswer)
        {
            optionsBtn[displayedQuestions[arrIndex].correctAnswer].classList.add('correctAnswer');
        }
        else
        {
            optionsBtn[i].classList.add('wrongAnswer');
        }
    }
}

//randomly select 25 questions from difficulty level and stores into another array
function getRandomQs()
{
    while (rNumArr.length < 25)
    {
        let rNum = MacreateGroupsth.floor(Math.random()* fetchedQuestions.length);
        if(!rNumArr.includes(rNum))
        {
            rNumArr.push(rNum);
        }
    }
    createNewQuestionArray();
    showCountdown();
}

//displays 3 2 1 go
function countdownStart()
{
    startBtn.disabled = true;
    countdownTxt.textContent = '3';
  setTimeout(() =>
  {
    countdownTxt.textContent = '2';
  }, 1000);
  setTimeout(() =>
  {
    countdownTxt.textContent = '1';
  }, 2000);
  setTimeout(() =>
  {
    countdownTxt.textContent = 'GO!';
  }, 3000);
  setTimeout(() =>
  {
    startBtn.disabled = false;
    displayQuestions();
  }, 4000);
}

//navigate from splash page to countdown page
function showCountdown()
{
    instructionContainer.hidden = false;
    splashContainer.hidden = true;
}

//use rNumArr and create new array of questions using index
function createNewQuestionArray()
{
    for (let i = 0; i < rNumArr.length; i++)
    {
        displayedQuestions.push(fetchedQuestions[rNumArr[i]]);
    }
    console.log(displayedQuestions);
}

//display questions on question page
function displayQuestions()
{
    if(questionNum < 26)
        {
            instructionContainer.hidden = true;
            questionContainer.hidden = false;
            scoreTxt.textContent = points;
            questionTxt.textContent = displayedQuestions[arrIndex].question;
            currentQNum.textContent = questionNum;
            for(let j = 0; j<optionsBtn.length; j++)
                {
                    optionsBtn[j].textContent = displayedQuestions[arrIndex].options[j];
                    // debugger
                    console.log('textContent.length is ' +optionsBtn[j].textContent.length);
                    if(optionsBtn[j].textContent.length > 50)
                    {
                        optionsBtn[j].classList.add('fSizeSmaller')
                    }
                }
            countdownTimer = setInterval(countdown, 1000);
        }
    else
    {
        questionContainer.hidden = true;
        resultContainer.hidden = false;
        resultText.textContent = points;
        bestScoresToDOM();
        updateBestScore();
    }
}

//stop countdown
function stop()
{
    clearInterval(countdownTimer);
    console.log(timeLeft);
}

//user select difficulty level and fetches from correct json
function selectDifficultyLevel(e)
{
    //prevents user from selecting difficulty button and go straight to question page; makes user click on bottom submit button
    e.preventDefault();
    difficultyLvl = getRadioValue();
    console.log(difficultyLvl);
    switch(difficultyLvl)
    {
        case('easy'):
            getEasyQuestions();
            break;
        case('medium'):
            getMediumQuestions();
            break;
        case('hard'):
            getHardQuestions();
            break;
        default:
            break;
    }
}

//get value for selected radio button
function getRadioValue()
{
  let radioValue;
  radioInputs.forEach((radioInput) =>
  {
    if(radioInput.checked)
    {
      radioValue = radioInput.value;
    }
  });
  //add return after the foreach loop is done looping so it won't be undefined
  return radioValue;
}

startForm.addEventListener('click', function()
{
    //like a for loop, goes thru the radioContainer array of objects and declares object as "radioEl" then does whatever in code-block
    radioContainers.forEach((radioEl) =>
    {
        //remove selected styling
        radioEl.classList.remove('selected-label');
        //add back if radio input is checked
        if (radioEl.children[1].checked)
        {
          radioEl.classList.add('selected-label');
        }
    });
});

//event listener for options btns
for(let i =0;i<optionsBtn.length; i++)
{
    optionsBtn[i].addEventListener('click', function()
    {
        optionsBtn[i].classList.add('selectedAnswer');
        console.log(optionsBtn[i].value);
        if(optionsBtn[i].value == displayedQuestions[arrIndex].correctAnswer)
        {
            if(timeLeft > 5)
                {
                    points = points + 3;
                    scoreTxt.textContent = points;
                }
            else
            {
                points = points + 1;
                scoreTxt.textContent = points;
            }
        }
        else
        {
            points = points + 0;
            scoreTxt.textContent = points;
        }
        showRightAnswer();
        stop();
        setTimeout(resetAll, 2000);
    });
}

//gives points to correct response
function givePoints()
{
    if(timeLeft==0)
    {
        points = points + 0;
        scoreTxt.textContent = points;
    }
    else
    {
        checkUserResponse();
    }
    setTimeout(resetAll, 2000);
}

//resets all values
function resetAll()
{
    arrIndex++;
    questionNum++;
    //remove styling on all btns
    for(let i = 0; i<optionsBtn.length; i++ )
    {
        optionsBtn[i].classList.remove('hideDisplay', 'correctAnswer', 'wrongAnswer', 'selectedAnswer', 'fSizeSmaller');
        optionsBtn[i].disabled = false;
    }
    //reset timer
    timeLeft = 11;
    displayQuestions();
}


startForm.addEventListener('submit', selectDifficultyLevel);

//on load, to load scores on DOM
getSavedBestScores();