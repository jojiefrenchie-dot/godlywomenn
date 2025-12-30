export function cleanupBitDefenderAttributes() {
  if (typeof window === 'undefined') return;

  function removeAttributes() {
    document.querySelectorAll('[bis_skin_checked]').forEach((el) => {
      el.removeAttribute('bis_skin_checked');
    });
  }

  // Initial cleanup
  removeAttributes();

  // Create observer for dynamic additions
  const observer = new MutationObserver((mutations) => {
    let needsCleanup = false;
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'bis_skin_checked'
      ) {
        needsCleanup = true;
      }
    });
    if (needsCleanup) {
      removeAttributes();
    }
  });

  // Start observing
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['bis_skin_checked']
  });

  return () => observer.disconnect();
}