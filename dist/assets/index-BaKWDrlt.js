(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();async function L(){var i;const a=localStorage.getItem("token"),r=await(await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql",{method:"POST",headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"},body:JSON.stringify({query:`
                query {
                    user {
                        login
                        email
                        attrs
                        auditRatio
                        totalUp
                        totalDown
                        campus
                    }
                    transaction_aggregate(
                        where: {
                            event: { path: { _eq: "/bahrain/bh-module" } },
                            type: { _eq: "xp" }
                        }
                    ) {
                        aggregate {
                            sum {
                                amount
                            }
                        }
                    }
                    level: transaction(
                        order_by: { amount: desc },
                        limit: 1,
                        where: {
                            type: { _eq: "level" },
                            path: { _like: "/bahrain/bh-module%" }
                        }
                    ) {
                        amount
                    }
                    projects: transaction(
                        where: {
                            type: { _eq: "xp" },
                            object: { type: { _eq: "project" } }
                        },
                        order_by: { createdAt: asc }
                    ) {
                        id
                        object {
                            name
                        }
                        amount
                        createdAt
                    }
                    skills: transaction(
                        where: {
                            _and: [
                                {type: { _iregex: "(^|[^[:alnum:]])[[:alnum:]]*skill[[:alnum:]]*($|[^[:alnum:]])" }},
                                {type: {_like: "%skill%"}},
                                {object: {type: {_eq: "project"}}},
                                {type: {_in: [
                                    "skill_prog", "skill_algo", "skill_sys-admin", "skill_front-end", 
                                    "skill_back-end", "skill_stats", "skill_ai", "skill_game", 
                                    "skill_tcp"
                                ]}}
                            ]
                        }
                        order_by: [{type: asc}, {createdAt: desc}]
                        distinct_on: type
                    ) {
                        amount
                        type
                    }
                }
            `})})).json();return{userInfo:r.data.user[0],xpSum:r.data.transaction_aggregate.aggregate.sum.amount,level:((i=r.data.level[0])==null?void 0:i.amount)||0,projects:r.data.projects,skills:r.data.skills}}function M(){const a=document.createElement("button");return a.textContent="Logout",a.className="logout-btn profile-logout",a.id="logoutBtn",a.addEventListener("click",function(){console.log("Button clicked - addEventListener"),localStorage.clear(),location.reload()}),a}function N(a){const{userInfo:e,projects:r}=a,i=document.getElementById("app");i.innerHTML="";const t=document.createElement("div");t.id="userData",i.appendChild(t);const n=document.createElement("div");n.className="profile-up";const s=e.attrs.dateOfBirth?e.attrs.dateOfBirth.split("T")[0]:"Not specified";n.innerHTML=`
        <div class="user-info-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="info-container">
                <div class="profile-image-container">
                    
                </div>
                <div class="user-info-content">
                    <p><strong>Login:</strong> ${e.login}</p>
                    <p><strong>Email:</strong> ${e.email}</p>
                    <p><strong>Gender:</strong> ${e.attrs.genders||"Not specified"}</p>
                    <p><strong>Birth Date:</strong> ${s||"Not specified"}</p>
                    <p><strong>Phone:</strong> ${e.attrs.PhoneNumber||"Not specified"}</p>
                    <p><strong>Degree:</strong> ${e.attrs.Degree||"Not specified"}</p>
                    <p><strong>Campus:</strong> ${e.campus||"Reboot01"}</p>
                </div>
            </div>
        </div>
    `,t.appendChild(n),_(e.attrs);const o=M();o.style.position="absolute",o.style.zIndex="9999",n.appendChild(o);const A=document.createElement("div");A.className="profile-right",A.innerHTML=`
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
`,t.appendChild(A),P(r),D(r);const h=document.createElement("div");h.className="profile-left",h.innerHTML=`
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
`,t.appendChild(h),I(a.skills),j(e.auditRatio,e.totalUp,e.totalDown)}function I(a){var h;const e={};a.forEach(g=>{const p=g.type.replace("skill_","").split("-").map(m=>m.charAt(0).toUpperCase()+m.slice(1)).join(" ");e[p]=g.amount});const r=180,i=180,t=120,n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("width","380"),n.setAttribute("height","380"),n.classList.add("skills-graph"),[.25,.5,.75,1].forEach(g=>{const p=document.createElementNS("http://www.w3.org/2000/svg","circle");p.classList.add("reference-circle"),p.setAttribute("cx",r.toString()),p.setAttribute("cy",i.toString()),p.setAttribute("r",(t*g).toString()),n.appendChild(p)});const s=Object.entries(e);s.forEach(([g,p],m)=>{const l=m/s.length*2*Math.PI-Math.PI/2,d=document.createElementNS("http://www.w3.org/2000/svg","line");d.classList.add("axis-line"),d.setAttribute("x1",r.toString()),d.setAttribute("y1",i.toString()),d.setAttribute("x2",(r+t*Math.cos(l)).toString()),d.setAttribute("y2",(i+t*Math.sin(l)).toString()),n.appendChild(d);const f=document.createElementNS("http://www.w3.org/2000/svg","text");f.setAttribute("class","skill-label"),f.setAttribute("x",(r+(t+30)*Math.cos(l)).toString()),f.setAttribute("y",(i+(t+30)*Math.sin(l)).toString()),f.setAttribute("text-anchor","middle"),f.setAttribute("alignment-baseline","middle"),f.textContent=g,n.appendChild(f)});const o=s.map(([g,p],m)=>{const l=m/s.length*2*Math.PI-Math.PI/2,d=r+t*Math.cos(l)*(p/75),f=i+t*Math.sin(l)*(p/75);return{x:d,y:f,value:p}}),A=document.createElementNS("http://www.w3.org/2000/svg","polygon");A.classList.add("skill-polygon"),A.setAttribute("points",o.map(g=>`${g.x},${g.y}`).join(" ")),n.appendChild(A),o.forEach(({x:g,y:p,value:m})=>{const l=document.createElementNS("http://www.w3.org/2000/svg","circle");l.classList.add("skill-point"),l.setAttribute("cx",g.toString()),l.setAttribute("cy",p.toString()),n.appendChild(l);const d=document.createElementNS("http://www.w3.org/2000/svg","text");d.classList.add("skill-value"),d.setAttribute("x",g.toString()),d.setAttribute("y",(p-12).toString()),d.setAttribute("text-anchor","middle"),d.textContent=Math.round(m).toString(),n.appendChild(d)}),(h=document.querySelector("#skillsGraph"))==null||h.appendChild(n)}function j(a,e,r){var y;const i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("width","400"),i.setAttribute("height","400"),i.classList.add("audit-ratio-graph");const t=200,n=200,s=120,o=2*Math.PI*s,A=e+r,h=e/A,g=o*h,p=o*(1-h),m=document.createElementNS("http://www.w3.org/2000/svg","circle");m.classList.add("up-circle"),m.setAttribute("cx",t.toString()),m.setAttribute("cy",n.toString()),m.setAttribute("r",s.toString()),m.setAttribute("stroke-dasharray",`${g} ${o}`),m.setAttribute("transform",`rotate(-90 ${t} ${n})`),i.appendChild(m);const l=document.createElementNS("http://www.w3.org/2000/svg","circle");l.classList.add("down-circle"),l.setAttribute("cx",t.toString()),l.setAttribute("cy",n.toString()),l.setAttribute("r",s.toString()),l.setAttribute("stroke-dasharray",`${p} ${o}`),l.setAttribute("stroke-dashoffset",`-${g}`),l.setAttribute("transform",`rotate(-90 ${t} ${n})`),i.appendChild(l);const d=document.createElementNS("http://www.w3.org/2000/svg","text");d.classList.add("ratio-text"),d.textContent=`Ratio: ${a.toFixed(2)}`,d.setAttribute("x",t.toString()),d.setAttribute("y",n.toString()),i.appendChild(d);const f=document.createElementNS("http://www.w3.org/2000/svg","text");f.classList.add("up-text"),f.textContent=`Done: ${(e/1e6).toFixed(1)}MB`,f.setAttribute("x",t.toString()),f.setAttribute("y",(n-40).toString()),i.appendChild(f);const S=document.createElementNS("http://www.w3.org/2000/svg","text");S.classList.add("down-text"),S.textContent=`Received: ${(r/1e6).toFixed(1)}MB`,S.setAttribute("x",t.toString()),S.setAttribute("y",(n+50).toString()),i.appendChild(S),(y=document.querySelector("#auditRatio"))==null||y.appendChild(i)}function P(a){const e=document.querySelector(".profile-right .xp-progression");if(!e)return;const r=600,i=300,t=Math.max(e.clientWidth||800,r),n=Math.max(Math.min(t*.5,340),i),s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width","100%"),s.setAttribute("height",n.toString()),s.setAttribute("viewBox","0 0 800 340"),s.setAttribute("preserveAspectRatio","xMidYMid meet"),s.classList.add("xp-chart");const o=50,A=800-o*2,h=260;let g=0;const p=a.map(c=>(g+=c.amount,{date:new Date(c.createdAt),xp:g,name:c.object.name})),m=A/(p.length-1),l=h/g,d=5;for(let c=0;c<=d;c++){const w=o+h-g*c/d*l,u=document.createElementNS("http://www.w3.org/2000/svg","line");u.setAttribute("x1",o.toString()),u.setAttribute("x2",(800-o).toString()),u.setAttribute("y1",w.toString()),u.setAttribute("y2",w.toString()),u.setAttribute("stroke","rgba(69, 243, 255, 0.1)"),u.setAttribute("stroke-width","1"),s.appendChild(u);const k=(g*c/d/1e3).toFixed(1),b=document.createElementNS("http://www.w3.org/2000/svg","text");b.textContent=`${k}KB`,b.setAttribute("x",(o-10).toString()),b.setAttribute("y",w.toString()),b.setAttribute("fill","#fff"),b.setAttribute("text-anchor","end"),b.setAttribute("font-size","10px"),b.setAttribute("alignment-baseline","middle"),s.appendChild(b)}const f=p.length-1;for(let c=0;c<=f;c++){const w=o+c*m,u=document.createElementNS("http://www.w3.org/2000/svg","line");u.setAttribute("x1",w.toString()),u.setAttribute("x2",w.toString()),u.setAttribute("y1",o.toString()),u.setAttribute("y2",(o+h).toString()),u.setAttribute("stroke","rgba(69, 243, 255, 0.1)"),u.setAttribute("stroke-width","1"),s.appendChild(u)}p.forEach((c,w)=>{const u=o+w*m,k=o+h-c.xp*l,b=document.createElementNS("http://www.w3.org/2000/svg","circle");b.setAttribute("cx",u.toString()),b.setAttribute("cy",k.toString()),b.setAttribute("r","4"),b.setAttribute("fill","#45f3ff");const $=p.length>15?4:3;if(w%$===0){const E=document.createElementNS("http://www.w3.org/2000/svg","text");E.textContent=c.date.toLocaleDateString(),E.setAttribute("x",u.toString()),E.setAttribute("y",(o+h+20).toString()),E.setAttribute("fill","#fff"),E.setAttribute("text-anchor","middle"),E.setAttribute("font-size","12px"),s.appendChild(E)}const C=document.createElementNS("http://www.w3.org/2000/svg","title");C.textContent=`${c.name}
XP: ${c.xp}
Date: ${c.date.toLocaleDateString()}`,b.appendChild(C),s.appendChild(b)});const S=p.map((c,w)=>{const u=o+w*m,k=o+h-c.xp*l;return`${w===0?"M":"L"} ${u} ${k}`}).join(" "),y=document.createElementNS("http://www.w3.org/2000/svg","path");y.setAttribute("d",S),y.setAttribute("fill","none"),y.setAttribute("stroke","#45f3ff"),y.setAttribute("stroke-width","2"),s.appendChild(y);const v=document.createElementNS("http://www.w3.org/2000/svg","line");v.setAttribute("x1",o.toString()),v.setAttribute("y1",(o+h).toString()),v.setAttribute("x2",(800-o).toString()),v.setAttribute("y2",(o+h).toString()),v.setAttribute("stroke","#45f3ff"),v.setAttribute("stroke-width","2"),s.appendChild(v);const x=document.createElementNS("http://www.w3.org/2000/svg","line");for(x.setAttribute("x1",o.toString()),x.setAttribute("y1",(o-20).toString()),x.setAttribute("x2",o.toString()),x.setAttribute("y2",(o+h).toString()),x.setAttribute("stroke","#45f3ff"),x.setAttribute("stroke-width","2"),s.appendChild(x);e.firstChild&&e.firstChild.nodeName!=="H3";)e.removeChild(e.firstChild);e.appendChild(s),e instanceof HTMLElement&&(e.style.minHeight=`${n+60}px`),window.addEventListener("resize",()=>{const c=document.querySelector(".profile-right .xp-progression");if(c&&c.contains(s)){const w=Math.max(c.clientWidth||800,r),u=Math.max(Math.min(w*.5,340),i);s.setAttribute("height",u.toString()),c instanceof HTMLElement&&(c.style.minHeight=`${u+60}px`)}})}function _(a){const e=a["pro-picUploadId"],r=localStorage.getItem("token");if(!r||!e){console.log("Token or FileId not found");return}const i=document.createElement("img");i.style.opacity="0",i.onload=()=>{i.style.opacity="1"},i.src=`https://learn.reboot01.com/api/storage/?token=${r}&fileId=${e}`,i.className="profile-image";const t=document.querySelector(".profile-image-container");t==null||t.appendChild(i)}function D(a){const e=document.getElementById("projectsList");[...a].reverse().forEach(i=>{const t=document.createElement("div");t.className="project-item";const n=new Date(i.createdAt).toLocaleDateString();t.innerHTML=`
            <span class="project-name">${i.object.name}</span>
            <span class="project-xp">${i.amount.toLocaleString()} XP</span>
            <span class="project-date">${n}</span>
        `,e.appendChild(t)})}function B(){const a=document.getElementById("app"),e=document.createElement("div");e.id="loginSection",e.className="login-container",e.innerHTML=`
        <form id="loginForm">
            <h2>sign in</h2>
            <input type="text" id="identifier" placeholder="username or email">
            <input type="password" id="password" placeholder="password">
            <button type="submit">Login</button>
            <p id="errorMessage" class="error-message"></p>
        </form>
    `,a.appendChild(e),T()}function T(){document.getElementById("loginForm").addEventListener("submit",async a=>{a.preventDefault();const e=document.getElementById("identifier").value,r=document.getElementById("password").value,i=btoa(`${e}:${r}`);try{const t=await fetch("https://learn.reboot01.com/api/auth/signin",{method:"POST",headers:{Authorization:`Basic ${i}`}});if(!t.ok)throw new Error("Invalid credentials");const n=await t.json();localStorage.setItem("token",n);const s=document.getElementById("app");s.innerHTML="";const o=document.createElement("div");o.id="profileSection",s.appendChild(o);const A=await L();N(A)}catch(t){const n=document.getElementById("errorMessage");n&&(n.textContent=t instanceof Error?t.message:"An error occurred")}})}document.addEventListener("DOMContentLoaded",async()=>{if(!localStorage.getItem("token"))B();else{const e=await L();N(e)}});
