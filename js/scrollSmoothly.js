let scrollSmoothlyTo = function(element, speed = 2, offset = 0) {
    if (!element) return;
    
    let startPosition = window.pageYOffset;
    let finishPosition = element.getBoundingClientRect().top - offset;
    if (startPosition + finishPosition < 0) {
        finishPosition = -startPosition;
    }
    let pathLength = Math.abs(finishPosition);
    let duration = pathLength / speed;
    let start = null;

    function timing(time) {
        return (time < 0.5 ? 4 * Math.pow(time, 3) : 1 - Math.pow(-2 * time + 2, 3) / 2);
    }

    function step(time) {
        if (start === null) start = time;
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        console.log(`timeFraction = ${timeFraction}`)
        let progress = timing(timeFraction);
        let yOffset = (
            finishPosition < 0 ?
                Math.max(startPosition - progress * pathLength, startPosition + finishPosition) :
                Math.min(startPosition + progress * pathLength, startPosition + finishPosition)
        );
        window.scrollTo(0, yOffset);

        if (timeFraction < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}