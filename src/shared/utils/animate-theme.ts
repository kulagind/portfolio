export function animateTheme(snapshot: HTMLElement): void {
  const container = document.createElement('div');
  container.classList.add('canvas-theme-container');
  snapshot.classList.add('canvas-theme-layout');
  container.append(snapshot);

  requestAnimationFrame(() => {
    document.body.appendChild(container);
    container.classList.add('animate-moveleft');
    snapshot.classList.add('animate-moveright');

    container.addEventListener('animationend', () => {
      requestAnimationFrame(() => {
        container.remove();
      });
    });
  });
}