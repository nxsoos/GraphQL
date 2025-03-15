import { fetchUserData } from "./userdata";
import { displayUserInfo } from "./display";


function createLoginUI(): void {
    const appDiv = document.getElementById('app')!;
    
    const loginContainer = document.createElement('div');
    loginContainer.id = 'loginSection';
    loginContainer.className = 'login-container';
    
    loginContainer.innerHTML = `
        <form id="loginForm">
            <h2>sign in</h2>
            <input type="text" id="identifier" placeholder="username or email">
            <input type="password" id="password" placeholder="password">
            <button type="submit">Login</button>
            <p id="errorMessage" class="error-message"></p>
        </form>
    `;
    
    appDiv.appendChild(loginContainer);
    setupLoginHandler();
}

function createProfileUI(): void {
    const appDiv = document.getElementById('app')!;
    
    const profileContainer = document.createElement('div');
    profileContainer.id = 'profileSection';
    
    profileContainer.innerHTML = `
        <div id="profileData">
            <h2>Profile Information</h2>
            <div id="userData"></div>
            <button id="logoutBtn">Logout</button>
        </div>
    `;
    
    appDiv.appendChild(profileContainer);
}

function setupLoginHandler(): void {
    document.getElementById('loginForm')!.addEventListener('submit', async (e: Event) => {
        e.preventDefault();
        
        const identifier: string = (document.getElementById('identifier') as HTMLInputElement).value;
        const password: string = (document.getElementById('password') as HTMLInputElement).value;
        
        const credentials: string = btoa(`${identifier}:${password}`);
        
        try {
            const response: Response = await fetch('https://learn.reboot01.com/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const jwt: string = await response.json();
            localStorage.setItem('token', jwt);
            
            // Clear login form
            const appDiv = document.getElementById('app')!;
            appDiv.innerHTML = '';
            
            // Create profile container
            const profileContainer = document.createElement('div');
            profileContainer.id = 'profileSection';
            appDiv.appendChild(profileContainer);
            
            // Fetch and display user data
            const userData = await fetchUserData();
            displayUserInfo(userData);
            
        } catch (error) {
            const errorElement = document.getElementById('errorMessage');
            if (errorElement) {
                errorElement.textContent = error instanceof Error ? error.message : 'An error occurred';
            }
        }
    });
}
export { createLoginUI, createProfileUI };
