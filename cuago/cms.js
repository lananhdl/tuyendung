(async function(){
  const API=window.HGD_CMS_API||'';
  async function get(action,params={}){if(!API) return null;const u=new URL(API);u.searchParams.set('action',action);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));const r=await fetch(u);const j=await r.json();if(!j.ok)throw new Error(j.error||'API');return j.data}
  try{
    const products=await get('products');
    const productGrid=document.querySelector('.product-grid');
    if(productGrid&&products?.length){productGrid.innerHTML=products.slice(0,8).map((p,i)=>`<a class="product-card" href="product.html?slug=${encodeURIComponent(p.slug)}"><div class="pimg" style="background-image:url('${p.image||''}')"></div><div><small>${String(i+1).padStart(2,'0')}</small><h3>${p.name}</h3><p>${p.category||''}</p><span class="product-more">XEM CHI TIẾT ↗</span></div></a>`).join('')}
    const track=document.getElementById('projectTrack');
    const projects=await get('projects');
    if(track&&projects?.length){track.innerHTML=projects.map(p=>`<a class="project-item" href="project.html?id=${encodeURIComponent(p.id)}"><div class="project-image" style="background-image:url('${p.images?.[0]||''}')"></div><small>${p.category||'DỰ ÁN'}</small><h3>${p.name}</h3><p>${p.location||''}</p></a>`).join('')}
    const news=await get('news');const newsGrid=document.querySelector('.news-grid');if(newsGrid&&news?.length){newsGrid.innerHTML=news.slice(0,6).map(n=>`<article><div class="news-image" style="background-image:url('${n.image_url||''}')"></div><small>${n.category||'TIN TỨC'}</small><h3>${n.title}</h3><p>${n.excerpt||''}</p></article>`).join('')}
    const about=await get('about');(about||[]).forEach(a=>{const el=document.querySelector(`[data-content="${a.section}"]`);if(el){const h=el.querySelector('h3'),p=el.querySelector('p');if(h&&a.title)h.textContent=a.title;if(p&&a.content)p.textContent=a.content}})
  }catch(e){console.warn('HGD CMS:',e)}
  const leadForm=document.getElementById('leadForm');
  if(leadForm&&API){leadForm.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(leadForm);try{const u=new URL(API);u.searchParams.set('action','lead');const r=await fetch(u,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'lead',name:fd.get('name'),phone:fd.get('phone'),product:fd.get('product'),message:fd.get('message')})});const j=await r.json();if(!j.ok)throw new Error(j.error);alert('Cảm ơn bạn! Huỳnh Gia Door sẽ liên hệ lại sớm.');leadForm.reset()}catch(err){alert('Không gửi được yêu cầu. Vui lòng gọi trực tiếp cho Huỳnh Gia Door.')}})}
})();
