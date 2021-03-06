Gem's Battles
===========================
*Hung Nguyen <nmhung1210@gmail.com> - 2017*


## Introduction

Gem's Battles is basically a kind of Match Three game. It was developed base on DevKit game engine. For what's DevKit, you can get more information at https://github.com/gameclosure/devkit.

## DEMO
You can get fun with the DEMO at https://nmhung1210.github.io/gem_battles/


## Game's features
1. The swapping game for a battle. You need to have valid swap in order of attack the enemy.
2. The AI Bot was implemented to play VS battle with the player. There is lots power of the BOT. It's not just random...
3. When you have a valid swap, you will gain score for it. More matches gems would have more points.
4. These are particles, flame effects, sound effects implemented to improve experiences of the battle.
5. If there is no move from the player for a time period, the HINT would be shown to help the player keep track.
6. Each level has different BOT's powers. It's smarter for a higher level.

## Assets notices

Almost assets using in this projects is provided by BlackStorm Lab. They are also some extra assets (buttons, level map) had been downloaded from Google Search and Free2DAssets page at http://www.gameart2d.com/freebies.html. They're licensed free for non-commercial sharing. 

## Setup Workspace

### OSX & Linux
Follow the instructions on the DevKit docs at https://github.com/gameclosure/devkit

### Window
For Window users, You might need Window 10 with the Sub Linux (Ubuntu) installed for this project. First go to project folder, open command prompt and then enter "bash" to enter the bash Linux system. The rest is same as Linux instructions as above.

## DevKit review
### Pros
+ Lightweight.
+ Support HTML5 and Native platform as well.
+ Having documents and demo/sample for each major features.
+ Having source map for debugging easier in the major browser (Chrome, Firefox etc).
+ Having Simulate devices (iPhone5, iPhone6, iPad) for testing and debugging purpose.

### Cons
- Lacking IDE. The feeling that is not a modern game engine.
- Lacking Toolset. These are no Sprite Editor, no Animation Editor, Particle Editor (https://github.com/gameclosure/particle-editor) is not friendly and useful etc.
- Lacking Coding guideline standard.
- Package Modules are not organized as good enough. The devkit-core could not be able to installed smoothly in Window as document said.

## Build steps
1. Setup dependencies by following the Setup Workspace session above.
2. Enter bash system
3. Goto project folder
4. Type `devkit install` to install needed modules
5. Type `devkit serve` to run debug simulator