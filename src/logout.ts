
export function createLogoutButton(): HTMLButtonElement {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'logout-btn profile-logout';
    logoutButton.id = 'logoutBtn';

    logoutButton.addEventListener('click', function() {
        console.log("Button clicked - addEventListener");
        localStorage.clear();
        location.reload();

    });

    return logoutButton;
}


function handleLogout(): void {
    localStorage.removeItem('token');
    location.reload();
}

export { handleLogout };
