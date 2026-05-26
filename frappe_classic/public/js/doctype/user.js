frappe.ui.form.on("User", {
    async search_bar(frm) {
        if (frm.doc.search_bar) {
            await frm.save();
            window.location.reload();
        }
    }
});