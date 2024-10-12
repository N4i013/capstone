const images = document.querySelectorAll('.flashback-image');
let currentIndex = 0;
let intervalId;

function changeImage() {
    images[currentIndex].classList.add('hidden');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.remove('hidden');
}

let animationInterval;

function startAnimation(container) {
    const images = container.querySelectorAll('img');
    let currentIndex = 0;
    animationInterval = setInterval(() => {
        images[currentIndex].classList.add('hidden');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.remove('hidden');
    }, 500); // Change the interval as needed
}

function stopAnimation(container) {
    clearInterval(animationInterval);
    const images = container.querySelectorAll('img');
    images.forEach((img, index) => {
        if (index !== 0) {
            img.classList.add('hidden');
        } else {
            img.classList.remove('hidden');
        }
    });
}
