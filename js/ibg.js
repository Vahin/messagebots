const IBGcontainers = document.querySelectorAll('.ibg');

function setBackgroundFromDataset(container) {
    setBackgroundParams(container, getBackgroundParams(container));

    function getBackgroundParams(container) {
        let params = container.dataset.ibg;

        return params;
    }

    function setBackgroundParams(container, params) {
        container.style.background = params;
    }
}