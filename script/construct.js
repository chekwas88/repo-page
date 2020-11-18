import { graphql } from "https://cdn.skypack.dev/@octokit/graphql";

const token = '11c1950186f4922647670d5e68c9ecd8ec1a93dc';

const getDataQuery = `
  query { 
   
    viewer {
      name
      login
      bio
      avatarUrl
      repositories(first: 20 privacy: PUBLIC orderBy: {field: CREATED_AT direction: DESC} ){
        totalCount
        nodes{
          name
          description
          pushedAt
          stargazerCount
          languages(last: 20){
            nodes{
              name
              color
            }
          }
        }
      }
    }
  }
`
const auth = {
  headers: {
    authorization: `token ${token}`
  }
}

const dateFormat = (currentTime, repoTime) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = currentTime - repoTime;

    if (elapsed < msPerMinute) {
      return ` updated ${Math.round(elapsed/1000)}   seconds ago`;   
    }

    else if (elapsed < msPerHour) {
      return `updated ${Math.round(elapsed/msPerMinute)}  minutes ago`;   
    }

    else if (elapsed < msPerDay ) {
      return `updated ${Math.round(elapsed/msPerHour )} hours ago`;   
 }

 else if (elapsed < msPerMonth) {
     return `updated  ${Math.round(elapsed/msPerDay)}  days ago `;   
 }

 else if (elapsed < msPerYear) {
   const month = new Intl.DateTimeFormat('en-US', {month: 'long', day:"numeric"}).format(repoTime)
     return `updated  on ${month}`;   
 }

 else {
  const monthYear = new Intl.DateTimeFormat('en-US', {month: 'long', year: "numeric"}).format(repoTime)
  return `updated  on ${monthYear}`;  
 }
}

const createListItem = (item) => {
  const list = document.createElement('li');
  const repoDetail = document.createElement('div');
  const repoInfo = document.createElement('div');
  const repoAction = document.createElement('div');

  // construct repo info
  const h3title = document.createElement('h3');
  const nameLink = document.createElement('a');
  nameLink.href = "#";
  nameLink.className = "content__link";
  nameLink.textContent = item.name;
  h3title.className = "content__title"
  h3title.appendChild(nameLink);

  repoInfo.appendChild(h3title);
 

  // description
  if(item.description){
    const pdescription = document.createElement('p');
    pdescription.className = "content__description";
    pdescription.textContent = item.description;
    repoInfo.appendChild(pdescription);
  }
  

  // tags
  const tags = document.createElement('div');

  
  
  if(item.languages.nodes.length){
    const langSpan = document.createElement('span');
    const langColorSpan = document.createElement('span');
    const langTypeSpan = document.createElement('span');
    langColorSpan.className = "content__language-color";
    langColorSpan.style = `background-color: ${item.languages.nodes[0].color}`;
    langTypeSpan.textContent = item.languages.nodes[0].name;
    langTypeSpan.className = "content__language-type";
    langSpan.appendChild(langColorSpan);
    langSpan.appendChild(langTypeSpan);
    langSpan.className = "content__language";
    tags.appendChild(langSpan);

  }
 


  if(item.stargazerCount > 0){
    const starLink = document.createElement("a");
    const starSvg = document.createElement("img");
    const countSpan = document.createElement("span");
    starSvg.classList = "content__icon";
    starSvg.src = "./img/SVG/star.svg";
    starSvg.alt = "star icon";
    countSpan.textContent = item.stargazerCount;
    starLink.appendChild(starSvg);
    starLink.appendChild(countSpan);
    starLink.href = '#';
    tags.appendChild(starLink);
  }
  const timeSpan = document.createElement('span')
  const displayTime = dateFormat(new Date().getTime(), new Date(item.pushedAt).getTime())
  timeSpan.textContent = displayTime;
  tags.appendChild(timeSpan)
  tags.className = "content__tags"
  repoInfo.appendChild(tags);
  repoInfo.className = "content__repo-info";

  // construct repo action
  const starButton = document.createElement("button");
  const buttonStarSvg = document.createElement("img");
  buttonStarSvg.src = "./img/SVG/star.svg";
  buttonStarSvg.alt = "star icon";


  buttonStarSvg.classList = "content__icon";
  

  const buttonSpan = document.createElement('span');
  buttonSpan.textContent = "Star";
  starButton.appendChild(buttonStarSvg);
  starButton.appendChild(buttonSpan);
  repoAction.appendChild(starButton);
  repoAction.className = "content__repo-action";

  repoDetail.appendChild(repoInfo);
  repoDetail.appendChild(repoAction);
  repoDetail.className = "content__repo-detail"
  list.appendChild(repoDetail);

  return list;

}

const renderUserData = (viewer) => {
 
  const profilePicContainer = document.querySelector('.content__pic-container');
  const profileinfo = document.querySelector('.content__profile-info');
  const navAvatar = document.querySelector('.nav-icon__user');


  const profileimg = document.createElement('img');
  profileimg.src = viewer.avatarUrl;
  profileimg.alt = "profile-picture";
  profileimg.loading = "lazy"
  profileimg.className = "content__picture";

  const navIconAvatar = document.createElement('img');
  navIconAvatar.src = viewer.avatarUrl;
  navIconAvatar.alt = "avatar";
  navIconAvatar.loading = "lazy";
  navIconAvatar.className = "content__picture";

  const nameSpan = document.createElement('span');
  const usernameSpan = document.createElement('span');
  const bioParagraph = document.createElement("p");
  bioParagraph.textContent = viewer.bio
  bioParagraph.className = "bio";
  nameSpan.textContent = viewer.name;
  nameSpan.className = "name";
  usernameSpan.textContent = viewer.login;
  usernameSpan.className = "username";

  profilePicContainer.appendChild(profileimg);
  profileinfo.appendChild(nameSpan);
  profileinfo.appendChild(usernameSpan);
  profileinfo.appendChild(bioParagraph);
  navAvatar.appendChild(navIconAvatar);
}

const renderRepoData = (viewer) => {
  const {repositories} = viewer;
  const repoSection = document.querySelector(".content__repo");
  const smallTabList = document.getElementById("smalllistRepo");
  const largeTabList = document.getElementById("largelistRepo");


  const tabRepoCountSpan = document.createElement("span");
  tabRepoCountSpan.textContent = viewer.repositories.totalCount;
  tabRepoCountSpan.className = "tab__count";
  const tabRepoCountSpan2 = document.createElement("span");
  tabRepoCountSpan2.textContent = viewer.repositories.totalCount;
  tabRepoCountSpan2.className = "tab__count";
  smallTabList.appendChild(tabRepoCountSpan);
  largeTabList.appendChild(tabRepoCountSpan2);


 

  const repoList = document.createElement('ul');
  const countDiv = document.createElement("div");
  const countSpan = document.createElement("span");

  countSpan.textContent = `${viewer.repositories.totalCount} results for public repositories`;
  
  countDiv.className = "content__count";
  countDiv.appendChild(countSpan);

  repoList.className = "content__list";
  repositories.nodes.forEach((node) => {
    const listItem = createListItem(node);
    repoList.appendChild(listItem);
  });

  repoSection.appendChild(countDiv);
  repoSection.appendChild(repoList);

}

const renderElements = ({viewer={}}) => {

  renderUserData(viewer);
  renderRepoData(viewer);

}

// Make GraphQL call to load and render data onLoad

window.onload = async () =>{
  const container = document.getElementById('app');
  const result = await graphql(getDataQuery, auth)
  container.style = "display: block"
  renderElements(result)
} 

