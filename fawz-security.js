/* FRONT-END DETERRENTS ONLY. Real database protection must be done with Firebase Security Rules. */
(function () {
    if (window.__fawzSecurityLoaded) return;
    window.__fawzSecurityLoaded = true;

    const blockEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    document.addEventListener("contextmenu", blockEvent, true);
    document.addEventListener("dragstart", blockEvent, true);
    document.addEventListener("selectstart", function (event) {
        if (!event.target || !["INPUT", "TEXTAREA", "SELECT", "OPTION"].includes(event.target.tagName)) {
            blockEvent(event);
        }
    }, true);

    document.addEventListener("keydown", function (event) {
        const key = (event.key || "").toLowerCase();
        const blocked =
            key === "f12" ||
            (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
            (event.ctrlKey && ["u", "s", "p"].includes(key));
        if (blocked) blockEvent(event);
    }, true);

    document.querySelectorAll("img").forEach(function (img) {
        img.setAttribute("draggable", "false");
        img.addEventListener("contextmenu", blockEvent, true);
        img.addEventListener("dragstart", blockEvent, true);
    });
})();
