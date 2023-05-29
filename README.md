<!-- # manga-lib

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Manga Scraper is a library that allows you to easily scrape manga content from various websites.

## Features

- Scrapes manga chapters, titles, images, and other metadata.
- Supports multiple popular manga websites (updating).
- Provides a simple and intuitive API for easy integration.

## Installation

Install the library using npm:

```

npm i manga-lib

```

## Usage

Here's an example of how to use Manga Scraper in your code:

``` javascript
const MangaScraper = require('manga-scraper');

// Create a new instance of the MangaScraper
const scraper = new MangaScraper();

// Scrape a manga from a specific website
const manga = scraper.scrapeManga('https://example.com/manga');

// Retrieve the manga details
const title = manga.getTitle();
const chapters = manga.getChapters();

// Display the manga details
console.log(`Title: ${title}`);
console.log('Chapters:');
chapters.forEach((chapter) => {
  console.log(`- ${chapter}`);
});

```

 -->
