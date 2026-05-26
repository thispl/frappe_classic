frappe.after_ajax(() => {

	const removeSidebarSearch = () => {

		document.querySelectorAll('.standard-sidebar-item')
			.forEach(item => {

				const label = item.querySelector('.sidebar-item-label');

				if (label?.textContent?.trim() === 'Search') {
					item.remove();
				}
			});
	};

	removeSidebarSearch();

	// Watch dynamic sidebar rerenders
	const observer = new MutationObserver(() => {
		removeSidebarSearch();
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
});