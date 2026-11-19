document.addEventListener('DOMContentLoaded',()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  // Mobile navigation
  const nav=$('#navLinks'); $('#menuToggle').addEventListener('click',()=>nav.classList.toggle('open'));
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  // Dark / light theme saved in this browser
  const themeButton=$('#themeToggle');
  if(localStorage.getItem('anu-theme')==='light')document.body.classList.add('light');
  const setThemeIcon=()=>themeButton.textContent=document.body.classList.contains('light')?'☾':'☼';
  setThemeIcon();
  themeButton.addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('anu-theme',document.body.classList.contains('light')?'light':'dark');setThemeIcon();});

  // Animated rotating role text
  const roles=['a curious mind','a lifelong learner','a dreamer','always growing'];let ri=0,ci=0,del=false;
  function type(){const el=$('#typedRole'),word=roles[ri];el.textContent=word.slice(0,ci);if(!del&&ci<word.length)ci++;else if(!del){del=true;setTimeout(type,1000);return;}else if(ci>0)ci--;else{del=false;ri=(ri+1)%roles.length;}setTimeout(type,del?42:78);}type();

  // Scroll progress and top button
  const topButton=$('#backToTop');
  function scrollUI(){const max=document.documentElement.scrollHeight-innerHeight;$('#readingProgress').style.width=(max>0?scrollY/max*100:0)+'%';topButton.classList.toggle('visible',scrollY>450);}
  addEventListener('scroll',scrollUI,{passive:true});scrollUI();topButton.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  $('#year').textContent=new Date().getFullYear();

  // Scroll reveal animation
  if('IntersectionObserver'in window){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target);}}),{threshold:.12});$$('.section > .container > *, .section.container > *, .project-card,.document-card,.stat-card,.timeline article').forEach(el=>reveal.observe(el));
    const skills=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const n=Math.max(0,Math.min(100,Number(e.target.dataset.level)||0));$('i span',e.target).style.width=n+'%';skills.unobserve(e.target);}}),{threshold:.35});$$('.skill').forEach(el=>skills.observe(el));
  }else $$('.skill i span').forEach((el,i)=>el.style.width=$$('.skill')[i].dataset.level+'%');

  // Slideshow data: change filenames, titles, descriptions and categories here.
  const photos=[
    {src:'assets/images/gallery-01.jpg',title:'A moment to remember',description:'Add a short caption for this photograph.',category:'portrait',label:'PORTRAIT'},
    {src:'assets/images/gallery-02.jpg',title:'Somewhere beautiful',description:'Write where this photograph was taken.',category:'travel',label:'TRAVEL'},
    {src:'assets/images/gallery-03.jpg',title:'Life in little moments',description:'A memory worth keeping.',category:'moments',label:'MOMENTS'},
    {src:'assets/images/gallery-04.jpg',title:'Exploring new places',description:'Add a location or travel memory.',category:'travel',label:'TRAVEL'},
    {src:'assets/images/gallery-05.jpg',title:'A portrait story',description:'A favourite photograph.',category:'portrait',label:'PORTRAIT'},
    {src:'assets/images/gallery-06.jpg',title:'A special day',description:'Describe this moment in your own words.',category:'moments',label:'MOMENTS'}
  ];
  let current=0,filtered=photos.map((_,i)=>i),timer=null;
  const mainImage=$('#featuredPhoto'),fallback=$('#featuredFallback'),thumbs=$$('.thumb');
  function renderSlide(index){
    if(!filtered.length)return;
    current=(index+filtered.length)%filtered.length;
    const photo=photos[filtered[current]];
    mainImage.style.display='block';mainImage.src=photo.src;mainImage.alt=photo.title;
    mainImage.onerror=()=>{mainImage.style.display='none';fallback.style.display='grid';fallback.querySelector('b').textContent=String(filtered[current]+1).padStart(2,'0');fallback.querySelector('span').textContent='Add '+photo.src.split('/').pop();};
    mainImage.onload=()=>{mainImage.style.display='block';fallback.style.display='none';};
    $('#featuredCategory').textContent=photo.label;$('#featuredTitle').textContent=photo.title;$('#featuredDescription').textContent=photo.description;
    $('#slideCurrent').textContent=String(current+1).padStart(2,'0');$('#slideTotal').textContent=String(filtered.length).padStart(2,'0');
    thumbs.forEach((t,i)=>{const active=Number(t.dataset.index)===filtered[current];t.classList.toggle('active',active);t.hidden=!filtered.includes(Number(t.dataset.index));});
  }
  function stopSlideshow(){if(timer)clearInterval(timer);timer=null;$('#slideshowToggle').textContent='▶ Start slideshow';}
  function startSlideshow(){stopSlideshow();timer=setInterval(()=>renderSlide(current+1),4500);$('#slideshowToggle').textContent='Ⅱ Pause slideshow';}
  $('#galleryPrev').addEventListener('click',()=>renderSlide(current-1));$('#galleryNext').addEventListener('click',()=>renderSlide(current+1));
  $('#slideshowToggle').addEventListener('click',()=>timer?stopSlideshow():startSlideshow());
  $('#autoSlideshow').addEventListener('change',e=>e.target.checked?startSlideshow():stopSlideshow());
  thumbs.forEach(t=>t.addEventListener('click',()=>{const idx=filtered.indexOf(Number(t.dataset.index));if(idx>=0)renderSlide(idx);}));
  $('#galleryFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;$$('.filter', $('#galleryFilters')).forEach(x=>x.classList.toggle('active',x===b));filtered=photos.map((p,i)=>({p,i})).filter(x=>b.dataset.filter==='all'||x.p.category===b.dataset.filter).map(x=>x.i);renderSlide(0);});
  renderSlide(0);if($('#autoSlideshow').checked)startSlideshow();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSlideshow();else if($('#autoSlideshow').checked)startSlideshow();});

  // Full-screen image viewer, keyboard and touch-friendly arrow buttons
  const lightbox=$('#lightbox'),lbImage=$('#lightboxImage');let lbIndex=0;
  function openLightbox(index){lbIndex=(index+filtered.length)%filtered.length;const p=photos[filtered[lbIndex]];lbImage.src=p.src;lbImage.alt=p.title;$('#lightboxCaption').textContent=p.title;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';stopSlideshow();}
  function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';lbImage.src='';if($('#autoSlideshow').checked)startSlideshow();}
  $('#openFeatured').addEventListener('click',()=>openLightbox(current));$('#lightboxClose').addEventListener('click',closeLightbox);
  $('#lightboxPrev').addEventListener('click',()=>openLightbox(lbIndex-1));$('#lightboxNext').addEventListener('click',()=>openLightbox(lbIndex+1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
  addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')openLightbox(lbIndex-1);if(e.key==='ArrowRight')openLightbox(lbIndex+1);});
  let touchX=0;lightbox.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});lightbox.addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-touchX;if(Math.abs(d)>50)openLightbox(lbIndex+(d<0?1:-1));},{passive:true});

  // Project category filter
  $('#projectFilters').addEventListener('click',e=>{const b=e.target.closest('[data-project-filter]');if(!b)return;$$('[data-project-filter]').forEach(x=>x.classList.toggle('active',x===b));$$('.project-card').forEach(card=>card.hidden=b.dataset.projectFilter!=='all'&&card.dataset.project!==b.dataset.projectFilter);});

  // Document library search and category filters
  let activeDoc='all';
  function filterDocuments(){const q=$('#documentSearch').value.trim().toLowerCase();let shown=0;$$('.document-card').forEach(card=>{const matchCat=activeDoc==='all'||card.dataset.category===activeDoc;const matchText=(card.dataset.search+' '+card.innerText).toLowerCase().includes(q);card.hidden=!(matchCat&&matchText);if(!card.hidden)shown++;});$('#noDocuments').hidden=shown!==0;}
  $('#documentFilters').addEventListener('click',e=>{const b=e.target.closest('[data-doc-filter]');if(!b)return;activeDoc=b.dataset.docFilter;$$('[data-doc-filter]').forEach(x=>x.classList.toggle('active',x===b));filterDocuments();});
  $('#documentSearch').addEventListener('input',filterDocuments);

  // Contact actions: replace email here and in index.html.
  const email='your-email@example.com';$('#emailLink').href='mailto:'+email;$('#copyEmail').dataset.email=email;
  $('#copyEmail').addEventListener('click',async()=>{const msg=$('#copyFeedback');try{await navigator.clipboard.writeText(email);msg.textContent='Email address copied!';}catch{msg.textContent='Email: '+email;}setTimeout(()=>msg.textContent='',3000);});

  // Three.js 3D hero decoration (site still works if WebGL/CDN is unavailable).
  const canvas=$('#hero3d');
  if(canvas&&window.THREE){try{
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);camera.position.z=7;
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}resize();addEventListener('resize',resize);
    const group=new THREE.Group();scene.add(group);
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,2),new THREE.MeshStandardMaterial({color:0x9b8cff,metalness:.7,roughness:.24}));group.add(core);
    const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,1),new THREE.MeshBasicMaterial({color:0x65e6d2,wireframe:true,transparent:true,opacity:.2}));group.add(wire);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(2.1,.009,8,160),new THREE.MeshBasicMaterial({color:0xa99bff,transparent:true,opacity:.6}));ring.rotation.x=1.15;group.add(ring);
    scene.add(new THREE.AmbientLight(0xffffff,1.5));const light=new THREE.PointLight(0x9b8cff,35);light.position.set(3,3,4);scene.add(light);
    const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();core.rotation.y=t*.12;wire.rotation.x=-t*.08;ring.rotation.z=t*.08;group.rotation.y+=.0018;group.position.y=Math.sin(t*.6)*.08;renderer.render(scene,camera);}animate();
  }catch(e){console.info('3D effect unavailable; site remains usable.',e);}}
});
