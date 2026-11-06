document.addEventListener("DOMContentLoaded", function () {
    const themeCheckbox = document.querySelector("#theme-checkbox");
    const rootElement = document.documentElement;
    const storageKey = "cat-gallery-theme";

    if (!themeCheckbox) {
        console.error(
            'Theme toggle not found. Check that the HTML contains id="theme-checkbox".'
        );

        return;
    }

    const savedTheme = localStorage.getItem(storageKey);

    const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    let currentTheme;

    if (savedTheme === "light" || savedTheme === "dark") {
        currentTheme = savedTheme;
    } else {
        currentTheme = systemPrefersDark ? "dark" : "light";
    }

    applyTheme(currentTheme);

    themeCheckbox.addEventListener("change", function () {
        const selectedTheme = themeCheckbox.checked
            ? "dark"
            : "light";

        applyTheme(selectedTheme);
        localStorage.setItem(storageKey, selectedTheme);
    });

    function applyTheme(theme) {
        const darkThemeIsActive = theme === "dark";

        rootElement.dataset.theme = theme;
        themeCheckbox.checked = darkThemeIsActive;

        themeCheckbox.setAttribute(
            "aria-checked",
            String(darkThemeIsActive)
        );
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.querySelector("#lightbox");
    const lightboxImage = document.querySelector("#lightbox-image");
    const lightboxTitle = document.querySelector("#lightbox-title");
    const lightboxDescription = document.querySelector(
        "#lightbox-description"
    );

    const closeButton = document.querySelector("#lightbox-close");
    const previousButton = document.querySelector(
        "#lightbox-previous"
    );
    const nextButton = document.querySelector("#lightbox-next");

    const photoCards = Array.from(
        document.querySelectorAll(".photo-card")
    );

    let currentPhotoIndex = 0;

    if (
        !lightbox ||
        !lightboxImage ||
        !lightboxTitle ||
        !lightboxDescription ||
        photoCards.length === 0
    ) {
        console.error("The gallery lightbox could not be initialized.");
        return;
    }

    photoCards.forEach(function (card, index) {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute(
            "aria-label",
            `Enlarge portrait: ${
                card.querySelector("h3")?.textContent ?? "Lestat portrait"
            }`
        );

        card.addEventListener("click", function () {
            openLightbox(index);
        });

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", function () {
        showPreviousPhoto();
    });

    nextButton.addEventListener("click", function () {
        showNextPhoto();
    });

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            showPreviousPhoto();
        }

        if (event.key === "ArrowRight") {
            showNextPhoto();
        }
    });

    function openLightbox(index) {
        currentPhotoIndex = index;
        displayPhoto(currentPhotoIndex);

        if (!lightbox.open) {
            lightbox.showModal();
        }
    }

    function closeLightbox() {
        lightbox.close();
        photoCards[currentPhotoIndex].focus();
    }

    function showPreviousPhoto() {
        currentPhotoIndex =
            (currentPhotoIndex - 1 + photoCards.length) %
            photoCards.length;

        displayPhoto(currentPhotoIndex);
    }

    function showNextPhoto() {
        currentPhotoIndex =
            (currentPhotoIndex + 1) % photoCards.length;

        displayPhoto(currentPhotoIndex);
    }

    function displayPhoto(index) {
        const selectedCard = photoCards[index];
        const selectedImage = selectedCard.querySelector("img");
        const selectedTitle = selectedCard.querySelector("h3");
        const selectedDescription = selectedCard.querySelector("p");

        lightboxImage.src = selectedImage.currentSrc || selectedImage.src;
        lightboxImage.alt = selectedImage.alt;

        lightboxTitle.textContent =
            selectedTitle?.textContent ?? "Portrait of Lestat";

        lightboxDescription.textContent =
            selectedDescription?.textContent ?? "";
    }
});
