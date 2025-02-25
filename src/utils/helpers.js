export function setButtonText(button, 
    isLoading, 
    loadingText = "Saving...", 
    defaultText = "Save") {
    const text = isLoading ? loadingText : defaultText;

    if (isLoading) {
        button.textContent = 'Saving...';
    } else {
        button.textContent = text;
    }
}