# 2048 Game VBO

![HTML5](https://img.shields.io/badge/tech-HTML5-E34F26) 
![JavaScript](https://img.shields.io/badge/tech-JavaScript-F7DF1E) 
![CSS3](https://img.shields.io/badge/tech-CSS3-264DE4) 
![GitHub last commit](https://img.shields.io/github/last-commit/VIBondarenko/2048)

**2048 Game VBO** is a modern browser‑based recreation of the classic _2048_ puzzle.  
The project is completely written in vanilla JavaScript, HTML5, and CSS3 and adds a glass‑morphism
user‑interface, touch support, and customizable themes on top of the original gameplay.

---

## Implemented Features

* **Flexible Gameplay** – move tiles with arrow keys **or** touch swipes.  
* **Settings Modal** – live‑change board colour, page background, and select animated
  themes (snow, rain, leaves, sunny).  
* **Smooth Animations** – CSS transitions for tile moves and merges.  
* **Score Tracking** – automatic score updates plus “new” and “merge” tile highlights.  
* **State Persistence** – user settings are stored in `localStorage` and loaded on startup.  
* **Responsive Layout** – plays equally well on desktop and mobile screens.

---

## Technologies

* HTML5 semantic markup  
* CSS3 with glass‑morphism & key‑frame animations  
* Vanilla JavaScript (ES6) – no external libraries

---

## Project Purpose

This mini‑game was built as a hands‑on exercise to practise **DOM manipulation,
event handling, local storage,** and **CSS animations** without relying on frameworks.
Feel free to fork the code and extend it with new board sizes, a score leaderboard,
or additional UI themes.

---

## How to Run

### ✅ Prerequisites

* Any modern browser (Chrome, Firefox, Edge, Safari).  
* _Optional:_ A tiny local web‑server to avoid cross‑origin restrictions.

---

### Step‑by‑Step

1. **Clone the repository**

    ```bash
    git clone https://github.com/VIBondarenko/2048.git
    cd 2048
    ```

2. **Run the game**

   **Quick way:** just double‑click `index.html`, the file will open in your default
   browser.

   **Local server way (recommended):**

    ```bash
    # Python 3
    python -m http.server 8000
    ```

    Then open `http://localhost:8000` in the browser.

---

## Controls

| Action            | Desktop Key | Mobile Gesture |
|-------------------|-------------|----------------|
| Move Left         | ←           | Swipe Left     |
| Move Right        | →           | Swipe Right    |
| Move Up           | ↑           | Swipe Up       |
| Move Down         | ↓           | Swipe Down     |
| Open Settings     | `S` button  | Tap ⚙ icon     |

---

## Notes

* Game state is **not** persisted – finishing or refreshing the page will reset the board.  
* Settings (colours, animation type & speed) are saved to `localStorage`.  
* Tested on Chrome 124, Firefox 125, and Safari 17 (desktop & iOS).

---

## Feedback

Author: [Vitaliy Bondarenko](https://github.com/VIBondarenko)  
Suggestions, ideas, and pull‑requests are warmly welcome – just open an issue!
