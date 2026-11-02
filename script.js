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