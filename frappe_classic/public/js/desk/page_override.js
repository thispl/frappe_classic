// Helper function to safely inject custom search
async function injectCustomSearch() {

    // Get current user search_bar value
    const search_bar_enabled = await frappe.db.get_value(
        "User",
        frappe.session.user,
        "search_bar"
    ).then(r => r.message?.search_bar);

    // Remove if disabled
    if (!search_bar_enabled) {
        $('#global-custom-search')
            .closest('.desktop-search-wrapper')
            .remove();
        return;
    }

    // Find visible page header
    let $visiblePageHead = $('.page-head:visible .standard-items-section');

    // Prevent duplicate injection
    if (
        $visiblePageHead.length &&
        $visiblePageHead.find('#global-custom-search').length === 0
    ) {

        let custom_search_html = `
            <div class="desktop-search-wrapper input-group search-bar mr-3">
                <button
                    id="global-custom-search"
                    class="btn-reset flex justify-between desktop-navbar-modal-search"
                    title="${__("Search")}"
                    style="
                        border: 1px solid var(--border-color);
                        padding: 4px 12px;
                        width: 300px;
                        border-radius: var(--border-radius-sm);
                        background: var(--control-bg);
                        color: var(--text-color);
                    "
                >
                    <span
                        class="desktop-search-icon"
                        style="display:flex;align-items:center;gap:8px;"
                    >
                        <svg class="icon icon-sm">
                            <use href="#icon-search"></use>
                        </svg>
                        ${__("Search")}
                    </span>

                    <span
                        class="desktop-keyboard-shortcut"
                        style="
                            color: var(--text-muted);
                            font-size: var(--text-xs);
                        "
                    >
                        Ctrl + K
                    </span>
                </button>
            </div>
        `;

        $visiblePageHead.prepend(custom_search_html);
    }
}

// Route change listener
$(document).on('page-change', function () {
    setTimeout(() => {
        injectCustomSearch();
    }, 50);
});

// Ajax fallback listener
$(document).on('ajaxComplete', function () {
    setTimeout(() => {
        injectCustomSearch();
    }, 50);
});

// Search trigger
$(document).on('click', '#global-custom-search', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (frappe.search?.show) {
        frappe.search.show();
    } else if (frappe.search?.search_dialog?.show) {
        frappe.search.search_dialog.show();
    } else {
        let searchKeyEvent = new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            keyCode: 75,
            ctrlKey: true,
            metaKey: true,
            bubbles: true,
            cancelable: true,
        });

        window.dispatchEvent(searchKeyEvent);
    }
});