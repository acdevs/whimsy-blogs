const form = document.querySelector('form');
const title = document.querySelector('#title');
const snip = document.querySelector('#snippet');
const body = document.querySelector('textarea');
const button = document.querySelector('button[type="submit"]');

form.addEventListener('submit', () => {
    const blog = document.querySelector('#processedBody');
    blog.value = body.value.replace(/\n/g, '<br>');
});

title.addEventListener('input', () => {
    title.value ? title.value = title.value.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()) : "";
});

snip.addEventListener('input', () => {
    snip.value ? snip.value = sentenceCase(snip.value) : "";
});

form.addEventListener('input', () => {
    title.value && snip.value && body.value ? button.disabled = false : button.disabled = true;
});
function sentenceCase(str) {
    return str.replace(/(^|\.\s+)([a-z])/g, (match, group1, group2) => {
        return group1 + group2.toUpperCase();
    });
}