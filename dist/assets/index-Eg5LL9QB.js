(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();async function E(){var s;const a=localStorage.getItem("token"),o=await(await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql",{method:"POST",headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"},body:JSON.stringify({query:`
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
            `})})).json();return{userInfo:o.data.user[0],xpSum:o.data.transaction_aggregate.aggregate.sum.amount,level:((s=o.data.level[0])==null?void 0:s.amount)||0,projects:o.data.projects,skills:o.data.skills}}function C(){const a=document.createElement("button");return a.textContent="Logout",a.className="logout-btn profile-logout",a.id="logoutBtn",a.addEventListener("click",function(){console.log("Button clicked - addEventListener"),localStorage.clear(),location.reload()}),a}function k(a){const{userInfo:e,projects:o}=a,s=document.getElementById("app");s.innerHTML="";const t=document.createElement("div");t.id="userData",s.appendChild(t);const n=document.createElement("div");n.className="profile-up";const l=e.attrs.dateOfBirth?e.attrs.dateOfBirth.split("T")[0]:"Not specified";n.innerHTML=`
        <div class="user-info-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="info-container">
                <div class="profile-image-container">
                    
                </div>
                <div class="user-info-content">
                    <p><strong>Login:</strong> ${e.login}</p>
                    <p><strong>Email:</strong> ${e.email}</p>
                    <p><strong>Gender:</strong> ${e.attrs.genders||"Not specified"}</p>
                    <p><strong>Birth Date:</strong> ${l||"Not specified"}</p>
                    <p><strong>Phone:</strong> ${e.attrs.PhoneNumber||"Not specified"}</p>
                    <p><strong>Degree:</strong> ${e.attrs.Degree||"Not specified"}</p>
                    <p><strong>Campus:</strong> ${e.campus||"Reboot01"}</p>
                </div>
            </div>
        </div>
    `,t.appendChild(n),P(e.attrs);const m=C();m.style.position="absolute",m.style.zIndex="9999",n.appendChild(m);const b=document.createElement("div");b.className="profile-right",b.innerHTML=`
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
`,t.appendChild(b),$(o),I(o);const f=document.createElement("div");f.className="profile-left",f.innerHTML=`
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
`,t.appendChild(f),L(a.skills),N(e.auditRatio,e.totalUp,e.totalDown)}function L(a){var f;const e={};a.forEach(h=>{const u=h.type.replace("skill_","").split("-").map(d=>d.charAt(0).toUpperCase()+d.slice(1)).join(" ");e[u]=h.amount});const o=180,s=180,t=120,n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("width","380"),n.setAttribute("height","380"),n.classList.add("skills-graph"),[.25,.5,.75,1].forEach(h=>{const u=document.createElementNS("http://www.w3.org/2000/svg","circle");u.classList.add("reference-circle"),u.setAttribute("cx",o.toString()),u.setAttribute("cy",s.toString()),u.setAttribute("r",(t*h).toString()),n.appendChild(u)});const l=Object.entries(e);l.forEach(([h,u],d)=>{const r=d/l.length*2*Math.PI-Math.PI/2,i=document.createElementNS("http://www.w3.org/2000/svg","line");i.classList.add("axis-line"),i.setAttribute("x1",o.toString()),i.setAttribute("y1",s.toString()),i.setAttribute("x2",(o+t*Math.cos(r)).toString()),i.setAttribute("y2",(s+t*Math.sin(r)).toString()),n.appendChild(i);const g=document.createElementNS("http://www.w3.org/2000/svg","text");g.setAttribute("class","skill-label"),g.setAttribute("x",(o+(t+30)*Math.cos(r)).toString()),g.setAttribute("y",(s+(t+30)*Math.sin(r)).toString()),g.setAttribute("text-anchor","middle"),g.setAttribute("alignment-baseline","middle"),g.textContent=h,n.appendChild(g)});const m=l.map(([h,u],d)=>{const r=d/l.length*2*Math.PI-Math.PI/2,i=o+t*Math.cos(r)*(u/75),g=s+t*Math.sin(r)*(u/75);return{x:i,y:g,value:u}}),b=document.createElementNS("http://www.w3.org/2000/svg","polygon");b.classList.add("skill-polygon"),b.setAttribute("points",m.map(h=>`${h.x},${h.y}`).join(" ")),n.appendChild(b),m.forEach(({x:h,y:u,value:d})=>{const r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.classList.add("skill-point"),r.setAttribute("cx",h.toString()),r.setAttribute("cy",u.toString()),n.appendChild(r);const i=document.createElementNS("http://www.w3.org/2000/svg","text");i.classList.add("skill-value"),i.setAttribute("x",h.toString()),i.setAttribute("y",(u-12).toString()),i.setAttribute("text-anchor","middle"),i.textContent=Math.round(d).toString(),n.appendChild(i)}),(f=document.querySelector("#skillsGraph"))==null||f.appendChild(n)}function N(a,e,o){var c;const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width","400"),s.setAttribute("height","400"),s.classList.add("audit-ratio-graph");const t=200,n=200,l=120,m=2*Math.PI*l,b=e+o,f=e/b,h=m*f,u=m*(1-f),d=document.createElementNS("http://www.w3.org/2000/svg","circle");d.classList.add("up-circle"),d.setAttribute("cx",t.toString()),d.setAttribute("cy",n.toString()),d.setAttribute("r",l.toString()),d.setAttribute("stroke-dasharray",`${h} ${m}`),d.setAttribute("transform",`rotate(-90 ${t} ${n})`),s.appendChild(d);const r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.classList.add("down-circle"),r.setAttribute("cx",t.toString()),r.setAttribute("cy",n.toString()),r.setAttribute("r",l.toString()),r.setAttribute("stroke-dasharray",`${u} ${m}`),r.setAttribute("stroke-dashoffset",`-${h}`),r.setAttribute("transform",`rotate(-90 ${t} ${n})`),s.appendChild(r);const i=document.createElementNS("http://www.w3.org/2000/svg","text");i.classList.add("ratio-text"),i.textContent=`Ratio: ${a.toFixed(2)}`,i.setAttribute("x",t.toString()),i.setAttribute("y",n.toString()),s.appendChild(i);const g=document.createElementNS("http://www.w3.org/2000/svg","text");g.classList.add("up-text"),g.textContent=`Done: ${(e/1e6).toFixed(1)}MB`,g.setAttribute("x",t.toString()),g.setAttribute("y",(n-40).toString()),s.appendChild(g);const S=document.createElementNS("http://www.w3.org/2000/svg","text");S.classList.add("down-text"),S.textContent=`Received: ${(o/1e6).toFixed(1)}MB`,S.setAttribute("x",t.toString()),S.setAttribute("y",(n+50).toString()),s.appendChild(S),(c=document.querySelector("#auditRatio"))==null||c.appendChild(s)}function $(a){var S;const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("width","800"),e.setAttribute("height","340");const o=50,s=800-o*2,t=260;let n=0;const l=a.map(c=>(n+=c.amount,{date:new Date(c.createdAt),xp:n,name:c.object.name})),m=s/(l.length-1),b=t/n,f=5;for(let c=0;c<=f;c++){const A=o+t-n*c/f*b,p=document.createElementNS("http://www.w3.org/2000/svg","line");p.setAttribute("x1",o.toString()),p.setAttribute("x2",(800-o).toString()),p.setAttribute("y1",A.toString()),p.setAttribute("y2",A.toString()),p.setAttribute("stroke","rgba(69, 243, 255, 0.1)"),p.setAttribute("stroke-width","1"),e.appendChild(p);const v=(n*c/f/1e3).toFixed(1),w=document.createElementNS("http://www.w3.org/2000/svg","text");w.textContent=`${v}KB`,w.setAttribute("x",(o-10).toString()),w.setAttribute("y",A.toString()),w.setAttribute("fill","#fff"),w.setAttribute("text-anchor","end"),w.setAttribute("font-size","10px"),w.setAttribute("alignment-baseline","middle"),e.appendChild(w)}const h=l.length-1;for(let c=0;c<=h;c++){const A=o+c*m,p=document.createElementNS("http://www.w3.org/2000/svg","line");p.setAttribute("x1",A.toString()),p.setAttribute("x2",A.toString()),p.setAttribute("y1",o.toString()),p.setAttribute("y2",(o+t).toString()),p.setAttribute("stroke","rgba(69, 243, 255, 0.1)"),p.setAttribute("stroke-width","1"),e.appendChild(p)}l.forEach((c,A)=>{const p=o+A*m,v=o+t-c.xp*b,w=document.createElementNS("http://www.w3.org/2000/svg","circle");if(w.setAttribute("cx",p.toString()),w.setAttribute("cy",v.toString()),w.setAttribute("r","4"),w.setAttribute("fill","#45f3ff"),A%3===0){const y=document.createElementNS("http://www.w3.org/2000/svg","text");y.textContent=c.date.toLocaleDateString(),y.setAttribute("x",p.toString()),y.setAttribute("y",(o+t+20).toString()),y.setAttribute("fill","#fff"),y.setAttribute("text-anchor","middle"),y.setAttribute("font-size","12px"),e.appendChild(y)}const x=document.createElementNS("http://www.w3.org/2000/svg","title");x.textContent=`${c.name}
XP: ${c.xp}
Date: ${c.date.toLocaleDateString()}`,w.appendChild(x),e.appendChild(w)});const u=l.map((c,A)=>{const p=o+A*m,v=o+t-c.xp*b;return`${A===0?"M":"L"} ${p} ${v}`}).join(" "),d=document.createElementNS("http://www.w3.org/2000/svg","path");d.setAttribute("d",u),d.setAttribute("fill","none"),d.setAttribute("stroke","#45f3ff"),d.setAttribute("stroke-width","2"),e.appendChild(d);const r=document.createElementNS("http://www.w3.org/2000/svg","line");r.setAttribute("x1",o.toString()),r.setAttribute("y1",(o+t).toString()),r.setAttribute("x2",(800-o).toString()),r.setAttribute("y2",(o+t).toString()),r.setAttribute("stroke","#45f3ff"),r.setAttribute("stroke-width","2"),e.appendChild(r);const i=document.createElementNS("http://www.w3.org/2000/svg","line");i.setAttribute("x1",o.toString()),i.setAttribute("y1",(o-20).toString()),i.setAttribute("x2",o.toString()),i.setAttribute("y2",(o+t).toString()),i.setAttribute("stroke","#45f3ff"),i.setAttribute("stroke-width","2"),e.appendChild(i);const g=document.createElement("div");g.className="xp-progression",g.innerHTML="<h3>XP Progression</h3>",g.appendChild(e),(S=document.querySelector(".profile-right .xp-progression"))==null||S.appendChild(e)}function P(a){const e=a["pro-picUploadId"],o=localStorage.getItem("token");if(!o||!e){console.log("Token or FileId not found");return}const s=document.createElement("img");s.style.opacity="0",s.onload=()=>{s.style.opacity="1"},s.src=`https://learn.reboot01.com/api/storage/?token=${o}&fileId=${e}`,s.className="profile-image";const t=document.querySelector(".profile-image-container");t==null||t.appendChild(s)}function I(a){const e=document.getElementById("projectsList");[...a].reverse().forEach(s=>{const t=document.createElement("div");t.className="project-item";const n=new Date(s.createdAt).toLocaleDateString();t.innerHTML=`
            <span class="project-name">${s.object.name}</span>
            <span class="project-xp">${s.amount.toLocaleString()} XP</span>
            <span class="project-date">${n}</span>
        `,e.appendChild(t)})}function j(){const a=document.getElementById("app"),e=document.createElement("div");e.id="loginSection",e.className="login-container",e.innerHTML=`
        <form id="loginForm">
            <h2>sign in</h2>
            <input type="text" id="identifier" placeholder="username or email">
            <input type="password" id="password" placeholder="password">
            <button type="submit">Login</button>
            <p id="errorMessage" class="error-message"></p>
        </form>
    `,a.appendChild(e),M()}function M(){document.getElementById("loginForm").addEventListener("submit",async a=>{a.preventDefault();const e=document.getElementById("identifier").value,o=document.getElementById("password").value,s=btoa(`${e}:${o}`);try{const t=await fetch("https://learn.reboot01.com/api/auth/signin",{method:"POST",headers:{Authorization:`Basic ${s}`}});if(!t.ok)throw new Error("Invalid credentials");const n=await t.json();localStorage.setItem("token",n);const l=document.getElementById("app");l.innerHTML="";const m=document.createElement("div");m.id="profileSection",l.appendChild(m);const b=await E();k(b)}catch(t){const n=document.getElementById("errorMessage");n&&(n.textContent=t instanceof Error?t.message:"An error occurred")}})}document.addEventListener("DOMContentLoaded",async()=>{if(!localStorage.getItem("token"))j();else{const e=await E();k(e)}});
