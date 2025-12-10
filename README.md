# Portfolio Application

[Live Demo](https://www.erika-belicova.com) | [Source Code](https://github.com/Erika-Belicova/portfolio)

## Description

A personal portfolio website designed to showcase my projects, skills, and work experience with a modern, interactive, and responsive user interface. The site features dynamic background animations using Three.js, a contact form powered by EmailJS, and is optimized for accessibility and user experience.

## Table of Contents

- [Portfolio Application](#portfolio-application)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Features](#features)
    - [Sections](#sections)
    - [Animations](#animations)
    - [Responsive Design](#responsive-design)
    - [Styling](#styling)
    - [Accessibility](#accessibility)
    - [Contact Form](#contact-form)
    - [Animation Performance](#animation-performance)
    - [Scroll Effects](#scroll-effects)
  - [Architecture](#architecture)
  - [Known Limitations \& Future Work](#known-limitations--future-work)
  - [Technologies \& Libraries](#technologies--libraries)
  - [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (version 18 or higher recommended)
- Angular CLI (version 19 or higher)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:  
   `git clone https://github.com/Erika-Belicova/portfolio.git`

2. Navigate into the project folder:  
   `cd repository-name`

3. Install dependencies:  
   `npm install`

4. Run the development server:  
   `ng serve` or `npm start` (adjust based on your setup)

5. Open your browser and visit:  
   `http://localhost:4200`

## Features

### Sections

Home · About · Education · Skills · Work Experience · Projects · Contact

### Animations

- Background globe made of stars that slowly rotates (Three.js)  
- Abstract spaceflight animation in the About section (Three.js)  
- Mouse trail with flying dots and click-triggered particle bursts  

### Responsive Design

- Fully responsive across mobile, tablet (portrait and landscape), desktop, and large desktop screens  

### Styling

- Tailwind CSS used for styling  
- Custom color palette combining selected Tailwind colors and original shades  
- Consistent dark blue and light gray/blue theme  
- Designed for a consistent dark blue and light gray/blue aesthetic, evoking a night sky

### Accessibility

- Buttons sized to meet minimum 44px target for touch  
- Verified color contrasts  

### Contact Form

- Messages sent via EmailJS  

### Animation Performance

- Optimized balance between visual clarity and smooth performance  
- Dynamically adjusts particle counts and sizes for efficient rendering across devices  

### Scroll Effects

- Fade-in and fade-down animations using AOS library

## Architecture

- Built with Angular using standalone components  
- Page sections are implemented as dedicated components; animations and mouse trail effects are either standalone components or integrated within relevant sections  
- Modular, maintainable structure allowing easy extension and refactoring  
- EmailJS integrated for contact functionality

## Known Limitations & Future Work

- Accessibility enhancements needed (ARIA attributes, etc.)  
- Refactoring to move inline HTML logic into Angular components  
- Translation/localization component planned but not implemented yet  
- Animations performance can be further optimized

## Technologies & Libraries

- Angular  
- TypeScript  
- HTML & CSS (Tailwind CSS)  
- Three.js (3D animations)  
- EmailJS (contact form)  
- AOS (scroll animations)

## Troubleshooting

- Ensure Node.js and Angular CLI are installed with compatible versions  
- If you encounter styling issues, verify Tailwind CSS build is properly configured  
- If you experience performance issues with animations, please check your network connection, hardware capabilities, and ensure your browser is up to date
