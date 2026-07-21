document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.exp-tabs li');
  const panes = document.querySelectorAll('.exp-pane');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  const typeEl = document.querySelector('[data-type]');
  if (typeEl) {
    const phrases = JSON.parse(typeEl.dataset.type);
    let pi = 0, ci = 0, deleting = false;
    const span = document.createElement('span');
    span.className = 'out';
    typeEl.appendChild(span);
    const caret = document.createElement('span');
    caret.className = 'caret';
    typeEl.appendChild(caret);

    function tick() {
      const word = phrases[pi];
      if (!deleting) {
        ci++;
        span.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 1600); return; }
      } else {
        ci--;
        span.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 40 : 65);
    }
    tick();
  }

  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.blog-card');
  const summary = document.querySelector('.blog-summary');
  if (chips.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const tag = chip.dataset.tag;
        let visible = 0;
        cards.forEach(card => {
          const match = tag === 'all' || card.dataset.tags.includes(tag);
          card.classList.toggle('hidden', !match);
          if (match) visible++;
        });
        if (summary) summary.textContent = `${visible} post${visible === 1 ? '' : 's'}`;
      });
    });
  }

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (sections.length && navLinks.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('current'));
          const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (link) link.classList.add('current');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
  }
});
