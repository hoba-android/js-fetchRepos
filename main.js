// select elements
let countSpan = document.querySelector(".count span");
let bulltetMainContinder = document.querySelector(".bullets");
let bulettsSpansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-answer");
let resultsContainer = document.querySelector(".resutls");
let countDownSpan = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnsweredQuestions = 0;
let countDownInterval;
let duration = 3;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let qObject = JSON.parse(this.responseText);
      let qCount = qObject.length;
      creatBullets(qCount);
      addQuestions(qObject[currentIndex], qCount);

      // handle submit button

      counterDwon(duration, qCount);
      submitButton.addEventListener("click", () => {
        let rightAnswer = qObject[currentIndex].rightAnswer;
        checkAnswer(rightAnswer, qCount);
        currentIndex++;
        showResutlts(qCount);

        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        addQuestions(qObject[currentIndex], qCount);
        handleBullets();
        clearInterval(countDownInterval);
        counterDwon(duration, qCount);
      });
    }
  };
  myRequest.open("GET", "qustions.json", true);
  myRequest.send();
}

getQuestions();

function creatBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) bullet.classList.add("on");
    bulettsSpansContainer.appendChild(bullet);
  }
}

function addQuestions(obj, count) {
  if (currentIndex < count) {
    // add quiestion title
    let h2Element = document.createElement("h2");
    let h2Text = document.createTextNode(obj.title);
    h2Element.appendChild(h2Text);
    quizArea.appendChild(h2Element);

    // add the answers

    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "questions";
      radioInput.id = `ans_${i}`;
      radioInput.dataset.answer = obj[`ans_${i}`];

      let radioLabel = document.createElement("label");
      radioLabel.htmlFor = `ans_${i}`;
      radioLabel.textContent = obj[`ans_${i}`];

      if (i === 1) radioInput.checked = true;

      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(radioLabel);
      answerArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rightAnswer, qCount) {
  let allRadioButtonsAnswers = document.getElementsByName("questions");
  let chosenANswer;

  for (let i = 0; i < allRadioButtonsAnswers.length; i++) {
    let current = allRadioButtonsAnswers[i];
    if (current.checked) {
      chosenANswer = current.dataset.answer;
    }
  }

  if (chosenANswer === rightAnswer) {
    rightAnsweredQuestions++;
  }
}

function handleBullets() {
  let allBullets = document.querySelectorAll(".bullets .spans span");
  let arrayOfBullets = Array.from(allBullets);
  arrayOfBullets.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResutlts(count) {
  let result;

  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    bulltetMainContinder.remove();
    submitButton.remove();
    if (rightAnsweredQuestions > count / 2 && rightAnsweredQuestions < count) {
      result = `<span class="good">Good, you answered ${rightAnsweredQuestions}</span>`;
    } else if (rightAnsweredQuestions === count) {
      result = `<span class="perfect">Perfect, you answered ${rightAnsweredQuestions}</span>`;
    } else {
      result = `<span class="bad">Bad, you answered ${rightAnsweredQuestions}</span>`;
    }
    resultsContainer.innerHTML = result;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function counterDwon(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownSpan.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
