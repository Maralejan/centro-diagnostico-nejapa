document.querySelectorAll('.card').forEach(card => {
    const bar = card.querySelector('.hover-bar');
    bar.textContent = card.getAttribute('data-text');
});