'use strict';

// Imports
import { stories } from "./stories.js";

// Elements
const app = document.querySelector('#app');
const nextButton = document.querySelector('#next');
const previousButton = document.querySelector('#previous');

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log("Service Worker registered!", reg))
      .catch(err => console.log("Service Worker registration failed!", err));
}

// State
let currentStory = 0;

// Functions
function renderStory(story) {
    previousButton.disabled = currentStory === 0;
    nextButton.disabled = currentStory === stories.length - 1;
    document.documentElement.style.setProperty('--active-color', story.bg_color);

    const storyContent = story.content.map(page => {
        const pageHTML = page.map(paragraph => {
            return `<p>${ paragraph }</p>`;
        }).join('');
        return `<div class="page">${ pageHTML }</div>`;
    }).join('');

    app.innerHTML = `
        <div class="story-wrapper">
            <div class="story-image">
                <img src="/img/grandpa-${ story.svg_variant }.svg" title="Grandpa Cartoon">
            </div>
            <h2 class="story-title">${ story.title }</h2>
            <div class="story">${ storyContent }</div>
        </div>`;
}

function renderStoryList() {
    document.querySelector('#story-list').innerHTML = stories.map((story, index) => 
        `<button 
            data-story="${ index }" 
            popovertarget="stories-popover" 
            popovertargetaction="hide"
            aria-label="Read story: ${story.title}">
            ${ story.title }
        </button>`
    ).join('');
}

document.addEventListener('click', event => {
    const nextButton = event.target.closest('#next');
    const previousButton = event.target.closest('#previous');
    const storyButton = event.target.closest('button[data-story]');

    if(nextButton) {
        currentStory++;
        renderStory(stories[currentStory]);
    }

    if(previousButton) {
        currentStory--;
        renderStory(stories[currentStory]);
    }

    if(storyButton) {
        currentStory = Number(storyButton.dataset.story);
        renderStory(stories[currentStory]);
    }

    // Disable buttons after rendering
    previousButton.disabled = currentStory === 0;
    nextButton.disabled = currentStory === stories.length - 1;
});

// Splash Screen
function loadSplashScreen() {
    const splashScreen = document.querySelector("#splash-screen");
    window.addEventListener("load", () => {
        setTimeout(() => {
            splashScreen.style.opacity = "0";
            setTimeout(() => splashScreen.remove(), 750);
        }, 1000);
    });
}

// Render App
loadSplashScreen();

// Load First Story
if (stories.length > 0) {
    renderStory(stories[currentStory]);
}

renderStoryList();
