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
    // Disable/enable buttons based on the current story
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
            <div class="story-image" tabindex="0">
                <div class="image-wrapper">
                    <img src="/img/grandpa-${ story.svg_variant }.svg" width="120" title="Grandpa Cartoon">
                    <img class="active-image" width="120" src="/img/grandpa-${ story.interaction.svg }.svg" title="Grandpa Cartoon">
                </div>
                <div class="action-text">
                    ${ story.interaction.text }
                </div>
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
            <span class="marker" style="background-color: ${ story.bg_color };"></span>
            ${ story.title }
        </button>`
    ).join('');
}

document.addEventListener('click', event => {
    const nextButton = event.target.closest('#next');
    const previousButton = event.target.closest('#previous');
    const storyButton = event.target.closest('button[data-story]');
    const storyImage = event.target.closest('.story-image');

    if (nextButton) {
        currentStory++;
        renderStory(stories[currentStory]);
    }

    if (previousButton) {
        currentStory--;
        renderStory(stories[currentStory]);
    }

    if (storyButton) {
        currentStory = Number(storyButton.dataset.story);
        renderStory(stories[currentStory]);
    }

    if (storyImage) {
        // Apply fixes for iOS flickering issues
        requestAnimationFrame(() => {
            storyImage.classList.toggle('active');

            // Force reflow to prevent image flickering on iOS
            storyImage.offsetHeight; 

            // Add a stabilized class to ensure consistent rendering
            requestAnimationFrame(() => {
                storyImage.classList.add('stabilized');
            });
        });
    }
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
