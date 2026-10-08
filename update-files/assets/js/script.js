(function(){
var d=portfolioData,$=function(s,r){return(r||document).querySelector(s)},el=function(t,h,c){var e=document.createElement(t);if(c)e.className=c;e.innerHTML=h||"";return e};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
document.querySelectorAll("[data-bind]").forEach(function(n){n.textContent=d[n.dataset.bind]});
document.querySelectorAll("[data-href]").forEach(function(a){a.href=d[a.dataset.href]});
var mail=$("[data-mail]");mail.href="mailto:"+d.email;mail.textContent=d.email;$("#yr").textContent=new Date().getFullYear();
d.about.forEach(function(p){$("#aboutText").appendChild(el("p",esc(p)))});
d.stats.forEach(function(s){$("#stats").appendChild(el("div","<b>"+esc(s[0])+"</b><span>"+esc(s[1])+"</span>"))});
d.experience.forEach(function(x){$("#timeline").appendChild(el("li","<h3>"+esc(x.role)+", "+esc(x.company)+"</h3><p class='muted'>"+esc(x.dates)+" · "+esc(x.place)+"</p><p>"+esc(x.summary)+"</p><ul>"+x.points.map(function(p){return"<li>"+esc(p)+"</li>"}).join("")+"</ul>"+(x.tools?"<p class='muted'>Tools: "+esc(x.tools)+"</p>":""),"reveal"))});
d.education.forEach(function(e){$("#edu").appendChild(el("li",esc(e)))});
Object.keys(d.skills).forEach(function(k){$("#skillgrid").appendChild(el("div","<h3>"+esc(k)+"</h3><ul class='chips'>"+d.skills[k].split(", ").map(function(s){return"<li>"+esc(s)+"</li>"}).join("")+"</ul>","reveal"))});
var dlg=$("#cs");
d.projects.forEach(function(p){var c=el("article",(p.image?"<img loading='lazy' src='"+p.image+"' alt='Illustration for "+esc(p.title)+"'>":"<div class='ph'>Image to be added</div>")+"<div><p class='muted'>"+esc(p.category)+"</p><h3>"+esc(p.title)+"</h3><p>"+esc(p.short)+"</p><p class='muted'><b>Tools:</b> "+esc(p.tools)+"</p><p class='muted'><b>Skills:</b> "+esc(p.skills)+"</p><button class='btn' type='button'>View case study</button></div>","card reveal");
c.querySelector("button").onclick=function(){var L=function(a){return"<ul>"+a.map(function(i){return"<li>"+esc(i)+"</li>"}).join("")+"</ul>"};
$("#csbody").innerHTML="<h3 id='cst'>"+esc(p.title)+"</h3><p class='muted'>My role: "+esc(p.role)+"</p><h4>Business problem</h4><p>"+esc(p.problem)+"</p><h4>Objective</h4><p>"+esc(p.objective)+"</p><h4>Approach</h4><p>"+esc(p.approach)+"</p><h4>Analysis</h4>"+L(p.analysis)+"<h4>Findings</h4>"+L(p.findings)+"<h4>Recommendations</h4>"+L(p.recommendations)+"<h4>Outcome</h4><p>"+esc(p.outcome)+"</p><h4>Business impact</h4><p>"+esc(p.impact)+"</p>";dlg.showModal()};
$("#cards").appendChild(c)});
$(".close").onclick=function(){dlg.close()};dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});
var nav=$("#links"),mb=$(".menu");mb.onclick=function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o)};nav.addEventListener("click",function(e){if(e.target.tagName==="A")nav.classList.remove("open")});
$(".theme").onclick=function(){var r=document.documentElement,dark=(r.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"))==="dark",n=dark?"light":"dark";r.dataset.theme=n;try{localStorage.setItem("theme",n)}catch(e){}};
if("IntersectionObserver"in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.1});document.querySelectorAll(".reveal").forEach(function(n){io.observe(n)})}else document.querySelectorAll(".reveal").forEach(function(n){n.classList.add("in")});
var f=$("#form"),st=$("#status");f.action=d.formspreeEndpoint;
f.addEventListener("submit",function(e){e.preventDefault();if(!f.checkValidity()){f.reportValidity();st.textContent="Please complete every field with a valid email address.";return}
var b=f.querySelector("button");b.disabled=true;st.textContent="Sending...";
fetch(f.action,{method:"POST",body:new FormData(f),headers:{Accept:"application/json"}}).then(function(r){if(r.ok){f.reset();st.textContent="Thanks. Your message has been sent."}else throw 0}).catch(function(){st.innerHTML="Message not sent. Please try again or email <a href='mailto:"+d.email+"'>"+d.email+"</a>."}).then(function(){b.disabled=false})});
})();
