// select elements

let url = "https://api.github.com/users/hoba-android/repos";

let input = document.querySelector(".get-repos input");
let button = document.querySelector(".get-button");
let dataShow = document.querySelector(".show-data");

button.addEventListener("click", getRepos);

input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();

    button.click();
  }
});

function getRepos() {
  if (input.value === "") {
    Swal.fire("Enter a valid username plz");
  } else {
    fetch(`https://api.github.com/users/${input.value}/repos`)
      .then((response) => response.json())
      .then((repos) => {
        dataShow.innerHTML = "";
        repos.forEach((repo) => {
          let mainDiv = document.createElement("div");
          let repoName = document.createTextNode(repo.name);
          mainDiv.appendChild(repoName);
          let theUrl = document.createElement("a");
          let theUrlText = document.createTextNode("Visit");
          theUrl.appendChild(theUrlText);
          theUrl.href = `https://github.com/${input.value}/${repo.name}`;
          theUrl.setAttribute("target", "_blank");
          mainDiv.appendChild(theUrl);
          let starsSpan = document.createElement("span");
          let starsText = document.createTextNode(
            `Stars ${repo.stargazers_count}`
          );
          starsSpan.appendChild(starsText);
          mainDiv.appendChild(starsSpan);
          mainDiv.className = "repo-box";

          dataShow.appendChild(mainDiv);
        });
      });
  }
}
