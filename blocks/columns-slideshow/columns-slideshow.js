function selectButton(block, button, row, buttons) {
  block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
  buttons.forEach((r) => r.classList.remove('selected'));
  button.classList.add('selected');
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-slideshow-${cols.length}-cols`);

  let slideshow = document.createElement('div');
  slideshow.className = 'slideshow';
  block.querySelectorAll('h6').forEach((h6, i) => {
    const div = document.createElement('div');
    if (i === 0) {
      h6.before(slideshow);
    }
    h6.before(div);
    div.append(h6);
    let next = div.nextElementSibling;
    while (next && next.tagName !== 'H6') {
      div.append(next);
      next = div.nextElementSibling;
    }
    slideshow.append(div);
  });

  const buttons = document.createElement('div');
  const autoPlayList = [];
  let slideshowInterval = null;
  buttons.className = 'slideshow-buttons';
  [...slideshow.children].forEach((row, i) => {
    /* buttons */
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      window.clearInterval(slideshowInterval);
      selectButton(slideshow, button, row, [...buttons.children]);
    });
    buttons.append(button);
    autoPlayList.push({ row, button });
  });
  slideshow.parentElement.append(buttons);

  slideshowInterval = window.setInterval(() => {
    autoPlayList.some((b, i) => {
      const isSelected = b.button.classList.contains('selected');
      if (isSelected) {
        const nextB = (i + 1 >= autoPlayList.length) ? autoPlayList[0] : autoPlayList[i + 1];
        selectButton(slideshow, nextB.button, nextB.row, [b.button]);
      }
      return isSelected;
    });
  }, 5000);
}
