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
    displayXPProgressionChart(projects, userData.allXp, userData.xpSum);
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

}>, allXp?: Array<{
    object: { name: string; type: string };
    amount: number;
    createdAt: string;
}>, totalXp?: number): void {
    const container = document.querySelector('.profile-right .xp-progression');
    if (!container) return;
    
    // Get the container width
    const containerWidth = container.clientWidth || 800;
    
    // Adjust dimensions based on screen size
    const isMobile = window.innerWidth <= 768;
    
    // Set minimum dimensions - increase height for mobile
    const minHeight = isMobile ? 400 : 300;
    
    // Set a reasonable height that's proportional but not too small
    // For mobile, make it taller relative to width
    const containerHeight = isMobile 
        ? Math.max(containerWidth * 0.8, minHeight)
        : Math.max(Math.min(containerWidth * 0.5, 340), minHeight);
    
    // Function to create and render the chart
    const renderChart = () => {
        // Clear any existing content except the heading
        while (container.firstChild) {
            if (container.firstChild.nodeName !== 'H3') {
                container.removeChild(container.firstChild);
            } else {
                break;
            }
        }
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", containerHeight.toString());
        
        // Use different viewBox for mobile to make elements larger
        if (isMobile) {
            svg.setAttribute("viewBox", `0 0 400 ${containerHeight}`);
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        } else {
            svg.setAttribute("viewBox", `0 0 800 340`);
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
        
        svg.classList.add('xp-chart');

        // Adjust padding for mobile
        const padding = isMobile ? 40 : 50;
        const width = (isMobile ? 400 : 800) - (padding * 2);
        const height = isMobile ? containerHeight - 80 : 260;


        // Process all XP data points
        let cumulativeXP = 0;









        let allDataPoints: {date: Date, xp: number, amount: number, name: string, isProject: boolean}[] = [];
        
        if (allXp && allXp.length > 0) {
            // Sort all XP transactions by date
            const sortedXp = [...allXp].sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            
            // Create data points for all XP
            allDataPoints = sortedXp.map(xp => {
                const amount = xp.amount;
                cumulativeXP += amount;
                return {
                    date: new Date(xp.createdAt),
                    xp: cumulativeXP,
                    amount: amount,
                    name: xp.object.name || "XP Transaction",
                    isProject: xp.object.type === "project"
                };
            });
        } else {
            // Fallback to just using projects if allXp is not available
            allDataPoints = projects.map(project => {
                const amount = project.amount;
                cumulativeXP += amount;
                return {
                    date: new Date(project.createdAt),
                    xp: cumulativeXP,
                    amount: amount,
                    name: project.object.name,
                    isProject: true
                };
            });
        }



        // Use the provided totalXp if available, otherwise use the calculated one
        const finalTotalXp = totalXp || cumulativeXP;
        
        // Convert total XP to KB for display

        const totalXpInKB = (finalTotalXp / 1000).toFixed(1);
        
        // Add total XP earned above the chart
        const totalXpText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        totalXpText.textContent = `Total XP Earned: ${totalXpInKB} KB`;
        totalXpText.setAttribute("x", isMobile ? "180" : "380"); // Center of the chart
        totalXpText.setAttribute("y", "5");  // Position at the top
        totalXpText.setAttribute("fill", "#ff2770");
        totalXpText.setAttribute("text-anchor", "middle");
        totalXpText.setAttribute("font-size", isMobile ? "14px" : "16px");
        totalXpText.setAttribute("font-weight", "bold");
        svg.appendChild(totalXpText);

        const xScale = width / (allDataPoints.length - 1 || 1);
        const yScale = height / (finalTotalXp || 1);
        
        // Y-axis markers with adjusted positioning
        const yMarkers = isMobile ? 4 : 5; // Fewer markers on mobile
        for (let i = 0; i <= yMarkers; i++) {

            const y = padding + height - ((finalTotalXp * i / yMarkers) * yScale);
            const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            gridLine.setAttribute("x1", padding.toString());
            gridLine.setAttribute("x2", ((isMobile ? 400 : 800) - padding).toString());
            gridLine.setAttribute("y1", y.toString());
            gridLine.setAttribute("y2", y.toString());
            gridLine.setAttribute("stroke", "rgba(69, 243, 255, 0.1)");
            gridLine.setAttribute("stroke-width", "1");
            svg.appendChild(gridLine);

            // Convert XP to KB for y-axis labels

            const kbValue = ((finalTotalXp * i / yMarkers) / 1000).toFixed(1);
        
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = `${kbValue} KB`;
            text.setAttribute("x", (padding - 10).toString());
            text.setAttribute("y", y.toString());
            text.setAttribute("fill", "#fff");
            text.setAttribute("text-anchor", "end");
            text.setAttribute("font-size", isMobile ? "9px" : "10px");
            text.setAttribute("alignment-baseline", "middle");
            svg.appendChild(text);
        }

        // Add vertical grid lines - limit to fewer dates on mobile
        const numDates = isMobile ? 4 : 6;
        for (let i = 0; i < numDates; i++) {
            // Calculate index in the data array for evenly spaced dates

            const dataIndex = i === 0 ? 0 : Math.floor((allDataPoints.length - 1) * (i / (numDates - 1)));
            const x = padding + (dataIndex * xScale);
            
            const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            gridLine.setAttribute("x1", x.toString());
            gridLine.setAttribute("x2", x.toString());
            gridLine.setAttribute("y1", padding.toString());
            gridLine.setAttribute("y2", (padding + height).toString());
            gridLine.setAttribute("stroke", "rgba(69, 243, 255, 0.1)");
            gridLine.setAttribute("stroke-width", "1");
            svg.appendChild(gridLine);
            
            // Add date label

            if (allDataPoints[dataIndex]) {
                const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                // Format date to be shorter on mobile
                const dateStr = isMobile 


                    ? allDataPoints[dataIndex].date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    : allDataPoints[dataIndex].date.toLocaleDateString();
                    
                dateText.textContent = dateStr;
                dateText.setAttribute("x", x.toString());
                dateText.setAttribute("y", (padding + height + 20).toString());
                dateText.setAttribute("fill", "#fff");
                dateText.setAttribute("text-anchor", "middle");
                dateText.setAttribute("font-size", isMobile ? "10px" : "12px");
                
                // Rotate date labels on mobile for better fit
                if (isMobile) {
                    dateText.setAttribute("transform", `rotate(45, ${x}, ${padding + height + 20})`);
                    dateText.setAttribute("text-anchor", "start");
                }
                
                svg.appendChild(dateText);
            }
        }
        
        // Draw connecting line first (so it's behind the points)

        const pathData = allDataPoints.map((point, index) => {
            const x = padding + (index * xScale);
            const y = padding + height - (point.xp * yScale);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#45f3ff");
        path.setAttribute("stroke-width", isMobile ? "1.5" : "2");
        svg.appendChild(path);
        


        // Data points with adjusted positioning
        // On mobile, show fewer points to avoid overcrowding
        const pointFrequency = isMobile ? Math.ceil(allDataPoints.length / 30) : 1;
        
        allDataPoints.forEach((point, index) => {
            // Skip some points on mobile to avoid overcrowding
            if (isMobile && index % pointFrequency !== 0 && !point.isProject) return;
            
            const x = padding + (index * xScale);
            const y = padding + height - (point.xp * yScale);

            // Data point circle
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", x.toString());
            circle.setAttribute("cy", y.toString());




            circle.setAttribute("r", point.isProject ? (isMobile ? "4" : "5") : (isMobile ? "2" : "3"));
            
            // Make project points red, other XP points blue
            circle.setAttribute("fill", point.isProject ? "#ff2770" : "#45f3ff");
            
            // Add a stroke to project points to make them stand out
            if (point.isProject) {
                circle.setAttribute("stroke", "#ffffff");
                circle.setAttribute("stroke-width", "1");
            }

            // Tooltip with XP values in KB
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = `${point.name}\nXP Earned: ${(point.amount / 1000).toFixed(1)} KB\nTotal XP: ${(point.xp / 1000).toFixed(1)} KB\nDate: ${point.date.toLocaleDateString()}`;
            circle.appendChild(title);

            svg.appendChild(circle);
        });

        // Axes with adjusted positioning
        const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xAxis.setAttribute("x1", padding.toString());
        xAxis.setAttribute("y1", (padding + height).toString());
        xAxis.setAttribute("x2", ((isMobile ? 400 : 800) - padding).toString());
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

        // Add legend - position differently on mobile
        const legendY = isMobile ? padding - 15 : padding - 10;
        const legendX1 = isMobile ? padding + 5 : padding + 10;
        const legendX2 = isMobile ? padding + 80 : padding + 100;
        
        // Project point legend
        const projectCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        projectCircle.setAttribute("cx", legendX1.toString());
        projectCircle.setAttribute("cy", legendY.toString());
        projectCircle.setAttribute("r", isMobile ? "4" : "5");
        projectCircle.setAttribute("fill", "#ff2770");
        projectCircle.setAttribute("stroke", "#ffffff");
        projectCircle.setAttribute("stroke-width", "1");
        svg.appendChild(projectCircle);
        
        const projectText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        projectText.textContent = "Projects";
        projectText.setAttribute("x", (legendX1 + 10).toString());
        projectText.setAttribute("y", legendY.toString());
        projectText.setAttribute("fill", "#fff");
        projectText.setAttribute("font-size", isMobile ? "10px" : "12px");
        projectText.setAttribute("alignment-baseline", "middle");
        svg.appendChild(projectText);
        
        // Other XP legend
        const xpCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        xpCircle.setAttribute("cx", legendX2.toString());
        xpCircle.setAttribute("cy", legendY.toString());
        xpCircle.setAttribute("r", isMobile ? "2" : "3");
        xpCircle.setAttribute("fill", "#45f3ff");
        svg.appendChild(xpCircle);
        
        const xpText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xpText.textContent = "Other XP";
        xpText.setAttribute("x", (legendX2 + 10).toString());
        xpText.setAttribute("y", legendY.toString());
        xpText.setAttribute("fill", "#fff");
        xpText.setAttribute("font-size", isMobile ? "10px" : "12px");
        xpText.setAttribute("alignment-baseline", "middle");
        svg.appendChild(xpText);

        container.appendChild(svg);
        
        // Update container height
        if (container instanceof HTMLElement) {
            container.style.minHeight = `${containerHeight + 60}px`; // Add extra for the heading
        }
    };
    
    // Initial render
    renderChart();
    
    // Add resize event listener to update chart on window resize
    const resizeHandler = () => {
        const updatedContainer = document.querySelector('.profile-right .xp-progression');
        if (updatedContainer) {
            // Remove existing chart and redraw
            const currentIsMobile = window.innerWidth <= 768;
            // Only redraw if mobile state changed (to avoid unnecessary redraws)
            if (currentIsMobile !== isMobile) {
                // Remove the old SVG
                const oldSvg = updatedContainer.querySelector('svg');
                if (oldSvg) {
                    updatedContainer.removeChild(oldSvg);
                }
                // Call the function again to redraw with new dimensions
                displayXPProgressionChart(projects, allXp, totalXp);
            }
        } else {
            // If container no longer exists, remove the event listener
            window.removeEventListener('resize', resizeHandler);
        }
    };
    
    // Use a debounced version of the resize handler to avoid performance issues
    let resizeTimeout: number | null = null;
    const debouncedResizeHandler = () => {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout(resizeHandler, 250);
    };
    
    window.addEventListener('resize', debouncedResizeHandler);
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
