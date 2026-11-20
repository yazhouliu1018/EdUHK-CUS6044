'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const allowsHoverMotion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

function enableMagneticHover(field) {
  const button = field.querySelector('button.magnetic');

  function resetOffset() {
    button.style.removeProperty('--magnetic-x');
    button.style.removeProperty('--magnetic-y');
  }

  field.addEventListener('pointermove', (event) => {
    if (!allowsHoverMotion.matches || event.pointerType !== 'mouse') return;
    const bounds = field.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    button.style.setProperty('--magnetic-x', `${Math.max(-10, Math.min(10, x * 20))}px`);
    button.style.setProperty('--magnetic-y', `${Math.max(-7, Math.min(7, y * 14))}px`);
  });
  field.addEventListener('pointerleave', resetOffset);
  field.addEventListener('pointercancel', resetOffset);
}

const lyricSets = [
  {time:'00:02—00:05',lines:['我能{升:专升本}，','{you:你}不能{degree:本升专}。'],tokens:{
    升:{label:'升',title:'把“没有这条路”，说成“没有能力”。',body:'专科可以“升”为本科，本科却没有对应的“本升专”通道。说话者把对方没有这条路说成无能，把自己需要补上的一段路说成能力，用逻辑错位制造了优势。',question:'这句话颠倒了输赢，但有没有改变“往上才有价值”的前提？'},
    you:{label:'你',title:'这一刻，“你”指向本科生。',body:'开头的对话把本科生放在被调侃的位置，专科位置暂时获得话语优势。随着故事继续，“你”又会转向原来的大专同学，比较的对象随之移动。',question:'人物最想向谁证明，自己已经不一样了？'},
    degree:{label:'本／专',title:'反转，借用了熟悉的排序。',body:'“本升专”之所以听起来荒谬，是因为观众熟悉“专升本”的升学方向，也熟悉学历常被拿来比较高低的社会语言。笑点让这种熟悉的关系暂时倒置。',question:'如果没有预先共享的学历排序，这个反转还会同样好笑吗？'}
  }},
  {time:'01:18—01:20',lines:['你看看你{certificate:毕业证}呢，','{adult:成人本科}。'],tokens:{
    certificate:{label:'毕业证',title:'一张凭证，让炫耀突然停下。',body:'前面反复宣布的“上岸”，在毕业证面前被重新检查。凭证把人物自我宣布的身份变成可以被检验、被揭穿的事情，情节的突然反转制造了反差。',question:'一个身份，需要别人承认，才算成立吗？'},
    adult:{label:'成人本科',title:'“上岸”之后，比较仍在继续。',body:'视频把“成人本科”用作揭穿人物的词：即便同为本科，仍有人继续区分不同凭证。小组由此讨论“等级内部还有等级”，以及人物优势为何不稳固。',question:'人物已经说自己是本科，为什么还会被一句话拉回原位？',footnote:'这里分析视频的表达方式，不代表网站对任何学历类型的价值判断。'}
  }},
  {time:'01:36',lines:['我不{root:忘本}，','也不{special:忘专}。'],tokens:{
    root:{label:'本',title:'“本”同时指向出身和本科。',body:'“忘本”原本表示忘记根本、忘记出身；放进这首歌，“本”又与本科发生联系。两个意思叠在一起，使人物短暂呈现出不愿选边的姿态。',question:'这一次示弱，是故事的终点，还是又一次反转的起点？'},
    special:{label:'专',title:'一句“都不忘”，很快被自己收回。',body:'小组把这句话读作较轻的抵抗：它似乎拒绝在本与专之间选边。但十几秒后，人物又说“我就忘专，咋地”，重新回到炫耀与比较。',question:'将一句话放回前后文，你对它的判断会改变吗？'}
  }}
];
let currentLyric = 0;
const lyricTabs = $$('[data-lyric]');
const lyricContinue = $('#lyric-continue');
function selectToken(key){
  const item=lyricSets[currentLyric].tokens[key];
  $$('#lyric-text button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.token===key)));
  $('#analysis-token').textContent=item.label;
  $('#analysis-title').textContent=item.title;
  $('#analysis-body').textContent=item.body;
  $('#analysis-question').textContent=item.question;
  $('#analysis-footnote').textContent=item.footnote||'';
}
function selectLyric(index){
  currentLyric=index; const set=lyricSets[index];
  lyricTabs.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});
  $('#lyric-panel').setAttribute('aria-labelledby',`lyric-tab-${index}`);
  $('#lyric-time').textContent=set.time;
  $('#lyric-text').innerHTML=set.lines.map(line=>line.replace(/\{([^:}]+):([^}]+)\}/g,(_,key,label)=>`<span class="magnetic-field"><button type="button" class="magnetic" data-token="${key}" aria-pressed="false" aria-label="解读：${label}"><span class="lyric-word">${label}</span></button></span>`)).join('<br>');
  $$('#lyric-text button').forEach(button=>{
    button.addEventListener('click',()=>selectToken(button.dataset.token));
    enableMagneticHover(button.parentElement);
  });
  selectToken(Object.keys(set.tokens)[0]);
  const nextTab = lyricTabs[index+1];
  lyricContinue.textContent = nextTab
    ? `继续看${nextTab.textContent.trim()}`
    : `返回${lyricTabs[0].textContent.trim()}`;
}
lyricTabs.forEach((tab,index)=>tab.addEventListener('click',()=>selectLyric(index)));
lyricContinue.addEventListener('click',()=>{
  const nextIndex = (currentLyric+1)%lyricTabs.length;
  selectLyric(nextIndex);
  $('.lyric-left').scrollIntoView({block:'start',behavior:'instant'});
  lyricTabs[nextIndex].focus({preventScroll:true});
});
const evidence=[
 ['“我能专升本，你不能本升专”','0:02—0:05','协商','站在专科位置，借“升”的单向性暂时占优。'],
 ['“大专的同学我早就删掉了”','0:12','顺从','用等级排斥原来所在的群体。'],
 ['“好的本科它不会比专科生差”','0:38','协商','可能是居高临下的“安慰”，也可能在拉平。'],
 ['“我专升本是整个，你专升本是半个”','1:04—1:06','顺从','用“完整／不完整”评判他人。'],
 ['“你看看你毕业证呢，成人本科”','1:18—1:20','顺从','凭借学历类型的区分揭穿炫耀。'],
 ['“我不忘本也不忘专”','1:36','较轻的抵抗','暂时拒绝选边，但十几秒后被收回。'],
 ['“我前面全都是骗你的，我就忘专，咋地”','1:48—1:53','顺从','收回示弱，回到炫耀。']
];
$('#evidence-body').innerHTML=evidence.map(row=>'<tr>'+row.map(v=>`<td>${v}</td>`).join('')+'</tr>').join('');
const acts=[
 {scene:'第一幕 / 宣布上岸',prop:'上岸了',quote:'“大专的同学\n我早就删掉了”',time:'0:02—1:14 · 据视频字幕',title:'先宣布，自己已不在原来的位置。',description:'人物宣布专升本“上岸”，说自己删掉了大专同学，还要去本科生的图书馆看看。炫耀既指向新的身份，也不断回望原来的同学。',identity:'从专科出发，自称已经成为本科生。',target:'开头调侃本科生，随后转向大专同学。',mechanism:'夸张的身份宣告，与急于证明自己的姿态形成喜感。'},
 {scene:'第二幕 / 凭证出场',prop:'毕业证',quote:'“你看看你毕业证呢”\n“成人本科”',time:'1:16—1:20 · 据视频字幕',title:'一张证书，打断了一分多钟的炫耀。',description:'毕业证突然进入对话。视频利用“成人本科”这个词揭穿人物原先营造的优势，使自信的表演迅速崩塌。这里描述的是视频的表达方式。',identity:'“我已上岸”的宣告，被重新检查。',target:'比较从原来的同学，回到炫耀者本人。',mechanism:'先前的自信与此刻被揭穿的狼狈，构成反差。'},
 {scene:'第三幕 / 示弱与推翻',prop:'我是谁？',quote:'“我不忘本\n也不忘专”',time:'1:22—1:53 · 据视频字幕',title:'身份被拆开，坦白也并不稳定。',description:'人物先崩溃、示弱，又否认自己先前自报的出身，承认“我前面全都是骗你的”。“不忘本也不忘专”的姿态，随后被“我就忘专”收回。',identity:'自报出身、否认、全盘推翻，身份不断变化。',target:'话语指向自身，也仍与原来的同学比较。',mechanism:'自我拆解与反复改口，让观众不断重估前面的表演。'},
 {scene:'第四幕 / 炫耀重启',prop:'录取通知',quote:'“你在等啥”\n副歌又回来了。',time:'1:59—2:17 · 据视频字幕',title:'一块手写白板，又把“上岸”演了一遍。',description:'手写“录取通知”成为新的道具，人物再次炫耀，副歌重新出现。故事没有停在坦白，而是绕回开头那场身份表演。',identity:'凭借新的表演道具，再次宣布自己的优势。',target:'仍然需要一个被比较、被看见的“你”。',mechanism:'观众刚经历揭穿和坦白，炫耀却又开始，循环本身成为笑点。'}
];
let currentAct=0;
function selectAct(index){
 currentAct=index;const act=acts[index];
 $$('[data-act]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});
 $('#act-panel').setAttribute('aria-labelledby',`act-tab-${index}`);
 for(const [id,key] of Object.entries({'act-scene':'scene','act-prop':'prop','act-quote':'quote','act-time':'time','act-title':'title','act-description':'description','act-identity':'identity','act-target':'target','act-mechanism':'mechanism'}))$('#'+id).textContent=act[key];
 $('#next-act').textContent=index===3?'回到第一幕':'看下一幕';
}
$$('[data-act]').forEach(b=>b.addEventListener('click',()=>selectAct(Number(b.dataset.act))));
$('#next-act').addEventListener('click',()=>selectAct((currentAct+1)%4));
function tabKeyboard(selector,select){
 const tabs=$$(selector);tabs.forEach((b,i)=>b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();select(next);tabs[next].focus();}));
}
tabKeyboard('[data-lyric]',selectLyric);tabKeyboard('[data-act]',selectAct);
const reactions=[['好玩／不当真',104,56.2],['借梗仿写',50,27.0],['其他',42,22.7],['引出学历或阶级讨论',40,21.6],['批评／反感',29,15.7],['支持／共鸣',23,12.4],['明确自述被嘲讽或冒犯',0,0]];
$('#reaction-chart').innerHTML=reactions.map(([label,count,pct],i)=>`<div class="reaction-row ${i===0||i===1?'featured':''}"><span>${label}</span><div class="bar-track" aria-hidden="true"><div class="bar" style="width:${pct/56.2*100}%"></div></div><span class="bar-value">${pct.toFixed(1)}%<small>${count}条</small></span></div>`).join('');
const comments=[
 {id:'01',quote:'高处不胜寒',source:'文稿§6.3、§6.4',explanation:'小组注意到，即使一句轻松的玩笑，也沿用了“高处／低处”的空间比喻。这个例子让“升”的方向从歌词延续到评论中。'},
 {id:'02',quote:'注意是本来，不是专来。',source:'文稿§6.3',explanation:'“本”已离开学历语境，成为日常词语的一部分；改写仍让“本”成为正确的那个词。小组据此讨论排序如何随着构词游戏被保留。'},
 {id:'03',quote:'游戏本，不是游戏专。',source:'文稿§6.3',explanation:'“游戏本”指游戏笔记本电脑。网友把“本／专”的替换搬到电脑上：场景变了，词语之间的比较形式仍在。'},
 {id:'04',quote:'我只是说人有一直向上去走的精神很好。',source:'文稿§6.3、§6.4',explanation:'这条评论表达了对“向上走”的认同。它与歌词共享“上”的隐喻，但呈现出鼓励和共鸣的语气。'},
 {id:'05',quote:'这几年学历严重贬值',source:'文稿§6.3、§6.4',explanation:'讨论由人物是否上岸，转向凭证本身是否还具有同样的区分作用。小组把它作为理解文凭通胀与位置不稳定的一个入口。'},
 {id:'06',quote:'这就是阶级的壁垒……',source:'文稿§6.3 · 原摘录含省略',explanation:'这条摘录把个人笑话联系到结构性问题。它说明部分评论触及阶级话题；这并不能直接证明评论者的心理状态。'}
];
$('#comment-grid').innerHTML=comments.map(({id,quote,explanation,source})=>`
 <article class="comment-card">
   <div class="comment-card-top"><span>匿名评论 / ${id}</span></div>
   <blockquote>“${quote}”</blockquote>
   <details>
     <summary class="lift">看看小组怎么读 <span>＋</span></summary>
     <p>${explanation}</p>
     <p>${source}</p>
   </details>
 </article>`).join('');
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?scrollY/max*100:0)+'%';}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){$$('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
['lyrics','story','comments','playground','research'].forEach(id=>observer.observe($('#'+id)));
selectLyric(0);selectAct(0);updateProgress();
