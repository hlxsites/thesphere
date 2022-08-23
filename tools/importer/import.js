/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const author = main.querySelector('[rel="author"]');
  if (author) {
    meta.Author = author;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

const createEmbeds = (main, document) => {
  main.querySelectorAll('iframe').forEach((embed) => {
    let src = embed.getAttribute('src');
    src = src && src.startsWith('//') ? `https:${src}` : src;
    if (src && !src.includes('googletagmanager')) {
      embed.replaceWith(WebImporter.DOMUtils.createTable([
        ['Embed'],
        [`<a href="${src}">${src}</a>`],
      ], document));
    }
  });
};

const makeAbsoluteLinks = (main) => {
  main.querySelectorAll('a').forEach((a) => {
    if (a.href.startsWith('/')) {
      const ori = a.href;
      const u = new URL(a.href, 'https://www.theplayer.org/');
      a.href = u.toString();

      if (a.textContent === ori) {
        a.textContent = a.href;
      }
    }
  });
};

const makeProxySrcs = (main) => {
  main.querySelectorAll('img').forEach((img) => {
    if (img.src.startsWith('/')) {
      img.src = `http://localhost:3001${img.src}?host=https://www.theplayer.org`;
    } else {
      try {
        const u = new URL(img.src, 'http://localhost:3001');
        if (!u.searchParams.has('host')) {
          u.searchParams.append('host', 'https://www.theplayer.org');
        }
        img.src = `http://localhost:3001${u.pathname}${u.search}`;
      } catch (error) {
        console.warn(`Unable to make proxy src for ${img.src}: ${error.message}`);
      }
    }
  });
};

const convertBackgroundImages = (document) => {
  document.querySelectorAll('[data-background]').forEach((el) => {
    if (el.dataset.background) {
      try {
        const u = new URL(el.dataset.background, 'http://localhost:3001');
        if (!u.searchParams.has('host')) {
          u.searchParams.append('host', 'https://www.theplayer.org');
        }

        const img = document.createElement('img');
        img.src = `http://localhost:3001${u.pathname}${u.search}`;

        el.prepend(img);
      } catch (error) {
        console.warn(`Unable to make proxy src for ${el.dataset.background}: ${error.message}`);
      }

    }
  });
};

const convertSliderToCarouselBlock = (main, document) => {
  main.querySelectorAll('.slider, .swiper-container').forEach((slider) => {
    const slides = slider.querySelectorAll('.swiper-slide');
    if (slides.length > 0) {
      const carousel = [['Carousel']];
      
      slides.forEach((slide) => {
        carousel.push([slide]);
      });
      const table = WebImporter.DOMUtils.createTable(carousel, document);
      slider.replaceWith(table);
    }
  });
}

const convertContainerToColumnBlock = (main, document) => {
  main.querySelectorAll('.container').forEach((container) => {
    const rows = container.querySelectorAll('* > .row');
    if (rows.length > 0 && rows[0].children.length > 1) {
      const columns = [['Columns']];

      let nbCols = 2;
      // only convert if there are more than 1 column
      rows.forEach((row) => {
        const r = [];
        Array.from(row.children).forEach((col) => {
          r.push(col);
        });
        nbCols = r.length;
        columns.push(r);
      });
      
      const table = WebImporter.DOMUtils.createTable(columns, document);
      table.querySelector('th').colSpan = nbCols;
      container.replaceWith(table);
    }
  });
}

const createGalleryBlock = (main, document) => {
  main.querySelectorAll('.gallery').forEach((gallery) => {
    const block = [['Gallery']];
    gallery.querySelectorAll('img').forEach((img) => {
      block.push([img]);
    });
    const table = WebImporter.DOMUtils.createTable(block, document);
    gallery.replaceWith(table);
  });
}


export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @returns {HTMLElement} The root element
   */
  transformDOM: ({ document, html }) => {
    WebImporter.DOMUtils.remove(document, [
      'nav',
    ]);

    const main = document.body;

    convertBackgroundImages(document);
    createEmbeds(main, document);
    createMetadata(main, document, html);
    makeAbsoluteLinks(main);
    makeProxySrcs(main);

    convertSliderToCarouselBlock(main, document);
    convertContainerToColumnBlock(main, document);
    createGalleryBlock(main, document);

    WebImporter.DOMUtils.remove(document, [
      'iframe',
      '.copyrights'
    ]);

    return document.body;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {String} url The url of the document being transformed.
   * @param {HTMLDocument} document The document
   */
  // eslint-disable-next-line arrow-body-style
  generateDocumentPath: ({ url }) => {
    return new URL(url).pathname.replace(/\.html$/, '');
  },
};