import { UserData } from './userdata';
import { createLogoutButton } from './logout';

function displayUserInfo(userData: UserData): void {
    const { userInfo, projects } = userData;
    
    const appDiv = document.getElementById('app')!;
    appDiv.innerHTML = '';
    
    const profileContainer = document.createElement('div');
    profileContainer.id = 'userData';
    appDiv.appendChild(profileContainer);
    
    
    const profileUP = document.createElement('div');
    profileUP.className = 'profile-up';

    const birthDate = userInfo.attrs.dateOfBirth ? userInfo.attrs.dateOfBirth.split('T')[0] : 'Not specified';
    profileUP.innerHTML = `
        <div class="user-info-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="info-container">
                <div class="profile-image-container">
                    
                </div>
                <div class="user-info-content">
                    <p><strong>Login:</strong> ${userInfo.login}</p>
                    <p><strong>Email:</strong> ${userInfo.email}</p>
                    <p><strong>Gender:</strong> ${userInfo.attrs.genders || 'Not specified'}</p>
                    <p><strong>Birth Date:</strong> ${birthDate || 'Not specified'}</p>
                    <p><strong>Phone:</strong> ${userInfo.attrs.PhoneNumber || 'Not specified'}</p>
                    <p><strong>Degree:</strong> ${userInfo.attrs.Degree || 'Not specified'}</p>
                    <p><strong>Campus:</strong> ${userInfo.campus || 'Reboot01'}</p>
                </div>
            </div>
        </div>
    `;
    
    
    profileContainer.appendChild(profileUP);
    displayUserImage(userInfo.attrs)
    // Add logout button last, after all content is rendered
    const logoutBtn = createLogoutButton();
    logoutBtn.style.position = 'absolute';
    logoutBtn.style.zIndex = '9999';
    profileUP.appendChild(logoutBtn);

    const profileRight = document.createElement('div');
    profileRight.className = 'profile-right';
    profileRight.innerHTML = `
    <div class="charts-container">
        <div class="xp-progression">
            <h3>XP Progression</h3>
        </div>
        <div class="projects-section">
            <div class="projects-header-fixed">
                <h3>Submitted Projects</h3>
                <div class="projects-columns">
                    <span class="header-item">Project Name</span>
                    <span class="header-item">XP Gained</span>
                    <span class="header-item">Submission Date</span>
                </div>
            </div>
            <div id="projectsList"></div>
        </div>
    </div>
`;
    profileContainer.appendChild(profileRight);
    displayXPProgressionChart(projects);
    displaySubmittedProjects(projects);

    const profileLeft = document.createElement('div');
    profileLeft.className = 'profile-left';
    profileLeft.innerHTML = `
    <div class="charts-container">
        <div class="chart-box">
            <h3>Skills Distribution</h3>
            <div id="skillsGraph" class="chart"></div>
        </div>
        <div class="chart-box">
            <h3>Audit Ratio</h3>
            <div id="auditRatio" class="chart"></div>
        </div>
    </div>
`;

    profileContainer.appendChild(profileLeft);   
    displaySkillsGraph(userData.skills);
    displayAuditRatioGraph(userInfo.auditRatio, userInfo.totalUp, userInfo.totalDown);

}
function displaySkillsGraph( skills: UserData['skills']): void {
    const skillMap: Record<string, number> = {};
    
    skills.forEach(skill => {
        const skillName = skill.type.replace('skill_', '').split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        skillMap[skillName] = skill.amount;
    });

    const centerX = 180;
    const centerY = 180;
    const radius = 120;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "380");
    svg.setAttribute("height", "380");
    svg.classList.add('skills-graph');

    // Background circles
    [0.25, 0.5, 0.75, 1].forEach(percentage => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.classList.add('reference-circle');
        circle.setAttribute("cx", centerX.toString());
        circle.setAttribute("cy", centerY.toString());
        circle.setAttribute("r", (radius * percentage).toString());
        svg.appendChild(circle);
    });

    const skillsArray = Object.entries(skillMap);

    // Axis lines and labels
    skillsArray.forEach(([skill, _], index) => {
        const angle = (index / skillsArray.length) * 2 * Math.PI - Math.PI / 2;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.classList.add('axis-line');
        line.setAttribute("x1", centerX.toString());
        line.setAttribute("y1", centerY.toString());
        line.setAttribute("x2", (centerX + radius * Math.cos(angle)).toString());
        line.setAttribute("y2", (centerY + radius * Math.sin(angle)).toString());
        svg.appendChild(line);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("class", "skill-label");
        text.setAttribute("x", (centerX + (radius + 30) * Math.cos(angle)).toString());
        text.setAttribute("y", (centerY + (radius + 30) * Math.sin(angle)).toString());
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("alignment-baseline", "middle");
        text.textContent = skill;
        svg.appendChild(text);
    });

    const skillPoints = skillsArray.map(([_, value], index) => {
        const angle = (index / skillsArray.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) * (value / 75);
        const y = centerY + radius * Math.sin(angle) * (value / 75);
        return { x, y, value };
    });

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.classList.add('skill-polygon');
    polygon.setAttribute("points", skillPoints.map(p => `${p.x},${p.y}`).join(" "));
    svg.appendChild(polygon);

    skillPoints.forEach(({ x, y, value }) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.classList.add('skill-point');
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        svg.appendChild(circle);

        const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.classList.add('skill-value');
        valueText.setAttribute("x", x.toString());
        valueText.setAttribute("y", (y - 12).toString());
        valueText.setAttribute("text-anchor", "middle");
        valueText.textContent = Math.round(value).toString();
        svg.appendChild(valueText);
    });

    document.querySelector('#skillsGraph')?.appendChild(svg);
}


function displayAuditRatioGraph(auditRatio: number, totalUp: number, totalDown: number): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "400");
    svg.setAttribute("height", "400");
    svg.classList.add('audit-ratio-graph');

    const centerX = 200;
    const centerY = 200;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    
    const total = totalUp + totalDown;
    const upPercentage = totalUp / total;
    const upValue = circumference * upPercentage;
    const downValue = circumference * (1 - upPercentage);

    const upCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    upCircle.classList.add('up-circle');
    upCircle.setAttribute("cx", centerX.toString());
    upCircle.setAttribute("cy", centerY.toString());
    upCircle.setAttribute("r", radius.toString());
    upCircle.setAttribute("stroke-dasharray", `${upValue} ${circumference}`);
    upCircle.setAttribute("transform", `rotate(-90 ${centerX} ${centerY})`);
    svg.appendChild(upCircle);

    const downCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    downCircle.classList.add('down-circle');
    downCircle.setAttribute("cx", centerX.toString());
    downCircle.setAttribute("cy", centerY.toString());
    downCircle.setAttribute("r", radius.toString());
    downCircle.setAttribute("stroke-dasharray", `${downValue} ${circumference}`);
    downCircle.setAttribute("stroke-dashoffset", `-${upValue}`);
    downCircle.setAttribute("transform", `rotate(-90 ${centerX} ${centerY})`);
    svg.appendChild(downCircle);

    const ratioText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    ratioText.classList.add('ratio-text');
    ratioText.textContent = `Ratio: ${auditRatio.toFixed(2)}`;
    ratioText.setAttribute("x", centerX.toString());
    ratioText.setAttribute("y", centerY.toString());
    svg.appendChild(ratioText);

    const upText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    upText.classList.add('up-text');
    upText.textContent = `Done: ${(totalUp / 1000000).toFixed(1)}MB`;
    upText.setAttribute("x", centerX.toString());
    upText.setAttribute("y", (centerY - 40).toString());
    svg.appendChild(upText);

    const downText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    downText.classList.add('down-text');
    downText.textContent = `Received: ${(totalDown / 1000000).toFixed(1)}MB`;
    downText.setAttribute("x", centerX.toString());
    downText.setAttribute("y", (centerY + 50).toString());
    svg.appendChild(downText);


    document.querySelector('#auditRatio')?.appendChild(svg);
}

function displayXPProgressionChart(projects: Array<{
    object: { name: string };
    amount: number;
    createdAt: string;
}>): void {
    const container = document.querySelector('.profile-right .xp-progression');
    if (!container) return;
    
    // Set minimum dimensions to ensure the chart doesn't get too small
    const minWidth = 600;
    const minHeight = 300;
    
    // Get the container width but ensure it's not smaller than our minimum
    const containerWidth = Math.max(container.clientWidth || 800, minWidth);
    // Set a reasonable height that's proportional but not too small
    const containerHeight = Math.max(Math.min(containerWidth * 0.5, 340), minHeight);
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%"); // Use percentage for width
    svg.setAttribute("height", containerHeight.toString());
    svg.setAttribute("viewBox", `0 0 800 340`); // Keep viewBox consistent
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    
    // Add a class for additional styling if needed
    svg.classList.add('xp-chart');

    const padding = 50;  
    const width = 800 - (padding * 2);
    const height = 260;  

    let cumulativeXP = 0;
    const dataPoints = projects.map(project => {
        cumulativeXP += project.amount;
        return {
            date: new Date(project.createdAt),
            xp: cumulativeXP,
            name: project.object.name
        };
    });

    const xScale = width / (dataPoints.length - 1);
    const yScale = height / cumulativeXP;
    
    // Y-axis markers with adjusted positioning
    const yMarkers = 5;
    for (let i = 0; i <= yMarkers; i++) {
        const y = padding + height - ((cumulativeXP * i / yMarkers) * yScale);
        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", padding.toString());
        gridLine.setAttribute("x2", (800 - padding).toString());
        gridLine.setAttribute("y1", y.toString());
        gridLine.setAttribute("y2", y.toString());
        gridLine.setAttribute("stroke", "rgba(69, 243, 255, 0.1)");
        gridLine.setAttribute("stroke-width", "1");
        svg.appendChild(gridLine);

        // Convert XP to KB and display
        const kbValue = ((cumulativeXP * i / yMarkers) / 1000).toFixed(1);
    
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = `${kbValue}KB`;
        text.setAttribute("x", (padding - 10).toString());
        text.setAttribute("y", y.toString());
        text.setAttribute("fill", "#fff");
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-size", "10px");
        text.setAttribute("alignment-baseline", "middle");
        svg.appendChild(text);
    }

    // Add vertical grid lines
    const xMarkers = dataPoints.length - 1;
    for (let i = 0; i <= xMarkers; i++) {
        const x = padding + (i * xScale);
        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", x.toString());
        gridLine.setAttribute("x2", x.toString());
        gridLine.setAttribute("y1", padding.toString());
        gridLine.setAttribute("y2", (padding + height).toString());
        gridLine.setAttribute("stroke", "rgba(69, 243, 255, 0.1)");
        gridLine.setAttribute("stroke-width", "1");
        svg.appendChild(gridLine);
    }
    
    // Data points with adjusted positioning
    dataPoints.forEach((point, index) => {
        const x = padding + (index * xScale);
        const y = padding + height - (point.xp * yScale);

        // Data point circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#45f3ff");

        // Date label (every 3rd point to avoid crowding)
        // Adjust the frequency of labels based on data point count
        const labelFrequency = dataPoints.length > 15 ? 4 : 3;
        if (index % labelFrequency === 0) {
            const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            dateText.textContent = point.date.toLocaleDateString();
            dateText.setAttribute("x", x.toString());
            dateText.setAttribute("y", (padding + height + 20).toString());
            dateText.setAttribute("fill", "#fff");
            dateText.setAttribute("text-anchor", "middle");
            dateText.setAttribute("font-size", "12px");
            
            svg.appendChild(dateText);
        }

        // Tooltip with project name and XP
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `${point.name}\nXP: ${point.xp}\nDate: ${point.date.toLocaleDateString()}`;
        circle.appendChild(title);

        svg.appendChild(circle);
    });

    // Draw connecting line
    const pathData = dataPoints.map((point, index) => {
        const x = padding + (index * xScale);
        const y = padding + height - (point.xp * yScale);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#45f3ff");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    // Axes with adjusted positioning
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", padding.toString());
    xAxis.setAttribute("y1", (padding + height).toString());
    xAxis.setAttribute("x2", (800 - padding).toString());
    xAxis.setAttribute("y2", (padding + height).toString());
    xAxis.setAttribute("stroke", "#45f3ff");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", padding.toString() );
    yAxis.setAttribute("y1", (padding - 20).toString());
    yAxis.setAttribute("x2", padding.toString());
    yAxis.setAttribute("y2", (padding + height).toString());
    yAxis.setAttribute("stroke", "#45f3ff");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);

    // Clear any existing content and append the new SVG
    while (container.firstChild) {
        if (container.firstChild.nodeName !== 'H3') {
            container.removeChild(container.firstChild);
        } else {
            break;
        }
    }
    
    container.appendChild(svg);
    
    // Also update the container's CSS to ensure it has sufficient height
    if (container instanceof HTMLElement) {
        container.style.minHeight = `${containerHeight + 60}px`; // Add extra for the heading
    }
    
    // Add resize event listener to update chart on window resize
    window.addEventListener('resize', () => {
        const updatedContainer = document.querySelector('.profile-right .xp-progression');
        if (updatedContainer && updatedContainer.contains(svg)) {
            const newWidth = Math.max(updatedContainer.clientWidth || 800, minWidth);
            const newHeight = Math.max(Math.min(newWidth * 0.5, 340), minHeight);
            svg.setAttribute("height", newHeight.toString());
            
            if (updatedContainer instanceof HTMLElement) {
                updatedContainer.style.minHeight = `${newHeight + 60}px`;
            }
        }
    });
}



function displayUserImage(attrs: Record<string, any>): void {
    const fileId = attrs['pro-picUploadId'];
    const token = localStorage.getItem('token');
    
    if (!token || !fileId) {
        console.log('Token or FileId not found');
        return;
    }

    const userImage = document.createElement('img');
    userImage.style.opacity = '0';
    userImage.onload = () => {
        userImage.style.opacity = '1';
    };
    userImage.src = `https://learn.reboot01.com/api/storage/?token=${token}&fileId=${fileId}`;
    userImage.className = 'profile-image';
    
    const imageContainer = document.querySelector('.profile-image-container');
    imageContainer?.appendChild(userImage);
}

function displaySubmittedProjects(projects: Array<{
    object: { name: string };
    amount: number;
    createdAt: string;
}>): void {
    const projectsList = document.getElementById('projectsList')!;
    
    // Create a copy of projects array and reverse it
    const reversedProjects = [...projects].reverse();
    
    reversedProjects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        const date = new Date(project.createdAt).toLocaleDateString();
        projectItem.innerHTML = `
            <span class="project-name">${project.object.name}</span>
            <span class="project-xp">${project.amount.toLocaleString()} XP</span>
            <span class="project-date">${date}</span>
        `;
        
        projectsList.appendChild(projectItem);
    });
}
export { displayUserInfo };
