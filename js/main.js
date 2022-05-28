// Переменные, связанные с меню
const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav");
const body = document.querySelector("body");
// Переменные, связанные с табуляцией на экране HOWWORKING
const breadcrumbs = document.querySelectorAll(".howworking__breadcrumbs-item");
const breadcrumbsActive = "howworking__breadcrumbs-item_active";
const tabsItem = document.querySelectorAll(".howworking__tabs-item");
const tabsItemActive = "howworking__tabs-item_show";
const tabsContainer = document.querySelector(".howworking__tabs");
// Переменные, связанные с модальным окном регистрации
const loginItem = document.querySelectorAll(".logreg__container");
const loginItemActive = "logreg__container_show";
const loginSwitcherClass = "logreg__link";
// Переменные, связанные с IBG
const IBGcontainers = document.querySelectorAll(".ibg");
// Переменнные, связанные с блоком REVIEWS
const reviewsContainer = document.querySelector(".reviews__list");
const reviewsItem = document.querySelectorAll(".reviews__item");
const reviewsActiveClass = "reviews__item_abs";
const reviewsItemHeight = [];
// Прочие константы
const RESIZEWIDTH = 1150;

// Тело скрипта
setTabsHeight();

for (let container of IBGcontainers) {
    setBackgroundFromDataset(container);
}

for (let i = 0; i < reviewsItem.length; i++) {
    reviewsItemHeight[i] = reviewsItem[i].offsetHeight;
}
if (document.documentElement.offsetWidth > RESIZEWIDTH) {
    setRandomReviewsPosition(reviewsContainer, reviewsItem, reviewsActiveClass);
}

// Листнеры
document.addEventListener("click", (event) => {
    //-- Скролл при нажатии на пункты меню --//
    if (event.target.dataset.link) {
        event.preventDefault();

        if (event.target.dataset.link === "welcome" && document.documentElement.offsetWidth > RESIZEWIDTH) {
            scrollSmoothlyTo(document.querySelector(`.header`), 2, 40);
        } else if (document.documentElement.offsetWidth <= RESIZEWIDTH) {
            scrollSmoothlyTo(document.querySelector(`.${event.target.dataset.link}`), 2, document.querySelector(".header").offsetHeight);
        } else {
            scrollSmoothlyTo(document.querySelector(`.${event.target.dataset.link}`), 2);
        }

        menu.classList.remove("menu_active");
        nav.classList.remove("nav_active");
        body.classList.remove("body_lock");
    }

    //-- Открытие меню --//
    if (event.target.closest(".menu")) {
        event.preventDefault();
        menu.classList.toggle("menu_active");
        nav.classList.toggle("nav_active");
        body.classList.toggle("body_lock");
    }

    //-- Аккордеон --//
    if (event.target.closest(".questions__item")) {
        event.target.closest(".questions__item").classList.toggle("questions__item_open");
        let child = event.target.closest(".questions__item").children[event.target.closest(".questions__item").children.length - 1];

        if (child.closest(".questions__item_open")) {
            child.style.maxHeight = child.scrollHeight + "px";
        } else {
            child.style.maxHeight = 0 + "px";
        }
    }

    //-- Табуляция --//
    if (event.target.dataset.tabs) {
        event.preventDefault();

        for (let i = 0; i < breadcrumbs.length; i++) {
            if (event.target.dataset.tabs == i) {
                breadcrumbs[i].classList.add(breadcrumbsActive);
                tabsItem[i].classList.add(tabsItemActive);
                continue;
            }

            breadcrumbs[i].classList.remove(breadcrumbsActive);
            tabsItem[i].classList.remove(tabsItemActive);
        }
    }

    //-- Модальное окно --//
    if (event.target.dataset.modal) {
        event.preventDefault();

        let modal = document.querySelector(`.${event.target.dataset.modal}`);
        modal.style.top = 0;
        body.classList.add("body_lock");

        modal.addEventListener("click", (event) => {
            if (event.target.classList.contains(modal.className)) {
                modal.style.top = `-150%`;
                body.classList.remove("body_lock");
            }
        });
    }

    //-- Окно регистрации и логина --//
    if (event.target.dataset.logreg == "switcher") {
        event.preventDefault();
        for (let item of loginItem) {
            item.classList.toggle(loginItemActive);
        }
    }

    //-- Структурирование отзывов --//
    if (event.target.closest(".reviews__button") && document.querySelector(".reviews__button")) {
        setDefaultReviewsPosition(reviewsContainer, reviewsItem, reviewsActiveClass);
        document.querySelector(".reviews__button").remove();
    }

    //-- Валидация форм --//
    if (event.target.closest(".form__submit")) {
        event.preventDefault();
        let form = event.target.closest(".form");
        let mail = form.querySelector(".form__mail");
        let tel = form.querySelector(".form__tel") ? form.querySelector(".form__tel") : undefined;

        if (isMail(mail.value)) {
            /* form.submit(); */
            form.querySelector(".form__wrong_mail").classList.remove("form__wrong_show");
        } else {
            form.querySelector(".form__wrong_mail").classList.add("form__wrong_show");
            setTimeout(() => {
                form.querySelector(".form__wrong_mail").classList.remove("form__wrong_show");
            }, 1500);
        }

        if (!isNaN(+tel.value) && tel.value) {
            form.querySelector(".form__wrong_tel").classList.remove("form__wrong_show");
        } else {
            form.querySelector(".form__wrong_tel").classList.add("form__wrong_show");
            setTimeout(() => {
                form.querySelector(".form__wrong_tel").classList.remove("form__wrong_show");
            }, 1500);
        }
    }
});

window.addEventListener("resize", (event) => {
    if (document.documentElement.offsetWidth > RESIZEWIDTH && body.classList.contains("body_lock") && menu.classList.contains("menu_active")) {
        body.classList.remove("body_lock");
    } else if (
        document.documentElement.offsetWidth <= RESIZEWIDTH &&
        !body.classList.contains("body_lock") &&
        menu.classList.contains("menu_active")
    ) {
        body.classList.add("body_lock");
    }

    if (document.documentElement.offsetWidth > RESIZEWIDTH && document.querySelector(".reviews__button")) {
        setDefaultReviewsClass(reviewsItem, reviewsActiveClass);
        document.querySelector(".reviews__button").remove();
    } else {
        setDefaultReviewsClass(reviewsItem, reviewsActiveClass);
    }
});

// Функции
function scrollSmoothlyTo(element, speed = 1, offset = 0) {
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
        return time < 0.5 ? 4 * Math.pow(time, 3) : 1 - Math.pow(-2 * time + 2, 3) / 2;
    }

    function step(time) {
        if (start === null) start = time;
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = timing(timeFraction);
        let yOffset =
            finishPosition < 0
                ? Math.max(startPosition - progress * pathLength, startPosition + finishPosition)
                : Math.min(startPosition + progress * pathLength, startPosition + finishPosition);
        window.scrollTo(0, yOffset);

        if (timeFraction < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function setTabsHeight() {
    // Определяем максимальный размер контейнера, чтобы рядом стоящая картинка не дергалась при изменении размера
    tabsItem[0].classList.add(tabsItemActive);
    tabsContainer.style.minHeight = tabsItem[0].scrollHeight + "px";
    for (let i = 1; i < tabsItem.length; i++) {
        if (tabsItem[i].scrollHeight > parseInt(tabsContainer.style.minHeight)) {
            tabsContainer.style.minHeight = tabsItem[i].scrollHeight + "px";
        }
    }
}

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

function setRandomReviewsPosition(container, items, activeClass) {
    let width = container.clientWidth;
    let height = container.clientHeight;

    container.style.minHeight = height + "px";

    for (let item of items) {
        let itemWidth = item.offsetWidth;
        item.style.width = itemWidth + "px";
        item.classList.add(activeClass);

        item.style.top = getRandom(height - item.offsetHeight) + "px";
        item.style.left = getRandom(width - itemWidth) + "px";
    }

    function getRandom(max) {
        return Math.round(Math.random() * max);
    }
}

function setDefaultReviewsPosition(container, items, activeClass) {
    let positionY = 0;

    for (let i = 0; i < items.length; i++) {
        items[i].style.height = reviewsItemHeight[i] + "px";
        if (i % 2 == 0) {
            items[i].style.left = 0 + "px";
            items[i].style.top = positionY + "px";
            continue;
        }
        items[i].style.left = "51%";
        items[i].style.top = positionY + "px";
        positionY += items[i].offsetHeight + 24;
    }
}

function setDefaultReviewsClass(items, activeClass) {
    for (let item of items) {
        item.classList.remove(activeClass);
    }
}

function isMail(address) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(address) == false) {
        return false;
    }
    return true;
}

let langSwitchers = document.querySelectorAll(".lang__link");
let langActive = "lang__item_active";
let langInputs = document.querySelectorAll("[data-lang]");

langSwitchers.forEach((switcher) => {
    switcher.addEventListener("click", (event) => {
        event.preventDefault();

        for (let lang of langSwitchers) {
            lang.closest(".lang__item").classList.remove(langActive);
        }

        switcher.closest(".lang__item").classList.add(langActive);

        if (document.querySelector("html").getAttribute("lang") != switcher.dataset.langSwitch) {
            for (let lang of langInputs) {
                let temp = lang.dataset.lang;
                if (lang.placeholder) {
                    lang.dataset.lang = lang.placeholder;
                    lang.placeholder = temp;
                    continue;
                }

                lang.dataset.lang = lang.textContent;
                lang.textContent = temp;
            }
        }

        document.querySelector("html").setAttribute("lang", switcher.dataset.langSwitch);
    });
});
