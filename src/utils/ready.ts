export function domReady(cb: () => void, isBelowIE11?: boolean) {
    const readyState = document.readyState;

    if (isBelowIE11) {
        if (readyState === 'complete') cb();
        else window.addEventListener('DOMContentLoaded', cb.bind(this));
    } else {
        if (readyState === 'complete' || readyState === 'interactive') cb();
        else window.addEventListener('DOMContentLoaded', cb.bind(this));
    }
}
