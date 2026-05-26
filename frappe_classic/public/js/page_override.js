// Helper function to handle the injection safely
function injectCustomSearch() {
    // 1. Double check that it doesn't already exist on the currently active visible page
    let $visiblePageHead = $('.page-head:visible .standard-items-section');
    
    if ($visiblePageHead.length && $visiblePageHead.find('#global-custom-search').length === 0) {
        
        let custom_search_html = `
            <div class="desktop-search-wrapper input-group search-bar mr-3">
                <button
                    id="global-custom-search"
                    class="btn-reset flex justify-between desktop-navbar-modal-search"
                    title="${__("Search")}"
                    style="border: 1px solid var(--border-color); padding: 4px 12px; width: 300px; border-radius: var(--border-radius-sm); background: var(--control-bg); color: var(--text-color);"
                >
                    <span class="desktop-search-icon" style="display: flex; align-items: center; gap: 8px;">
                        <svg class="icon icon-sm"><use href="#icon-search"></use></svg>
                        ${__("Search")}
                    </span>
                    <span class="desktop-keyboard-shortcut" style="color: var(--text-muted); font-size: var(--text-xs);">Ctrl + K</span>
                </button>
            </div>
        `;

        $visiblePageHead.prepend(custom_search_html);
    }
}

// 2. Listen to Frappe's route change
$(document).on('page-change', function() {
    // A micro-timeout pushes execution to the end of the JS call stack,
    // giving Frappe's single-page router engine enough time to render the DOM elements.
    setTimeout(injectCustomSearch, 50);
});

// 3. Fallback: Catch any lazy-loaded desk views or slower ajax transitions
$(document).on('ajaxComplete', function() {
    setTimeout(injectCustomSearch, 50);
});

// 4. Fully optimized Native Search Modal Trigger on Click
// 4. Bulletproof Native Search Modal Trigger on Click
$(document).on('click', '#global-custom-search', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevents bubbling up which auto-closes dialog backdrops

    // Way 1: Direct native instantiation check (Frappe v14 & v15 Workspace standard)
    if (frappe.search && frappe.search.show) {
        frappe.search.show();
    } 
    // Way 2: Internal UI instance handler fallback
    else if (frappe.search && frappe.search.search_dialog && frappe.search.search_dialog.show) {
        frappe.search.search_dialog.show();
    } 
    // Way 3: Trigger via the window object (The global keydown interceptor)
    else {
        let searchKeyEvent = new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            keyCode: 75,      // Explicit legacy keyCode fallback for old chrome runtimes
            ctrlKey: true,
            metaKey: true,    // Cmd Key support for Apple systems
            bubbles: true,
            cancelable: true
        });
        
        // Dispatching to window instead of document because Frappe's 
        // global key manager listens directly to window keyboard mappings
        window.dispatchEvent(searchKeyEvent);
    }
});