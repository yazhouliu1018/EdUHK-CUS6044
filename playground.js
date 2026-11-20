'use strict';
(() => {
  const one=s=>document.querySelector(s);
  const all=s=>[...document.querySelectorAll(s)];
  function showLab(index){
    all('[data-lab]').forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
    all('.lab-panel').forEach((panel,i)=>{panel.hidden=i!==index;});
  }
  const tabs=all('[data-lab]');
  tabs.forEach((button,index)=>{
    button.addEventListener('click',()=>showLab(index));
    button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%3;else if(event.key==='ArrowLeft')next=(index+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;event.preventDefault();showLab(next);tabs[next].focus();});
  });
  all('[data-next-lab]').forEach(button=>{
    button.addEventListener('click',()=>{
      const index=Number(button.dataset.nextLab);
      showLab(index);
      tabs[index].closest('.lab-tabs').scrollIntoView({block:'start',behavior:'instant'});
      tabs[index].focus({preventScroll:true});
    });
  });
  const opened=new Set();
  function updateLayers(){
    all('[data-layer]').forEach((button,index)=>{
      const isOpen=opened.has(index);button.setAttribute('aria-expanded',String(isOpen));
      button.querySelector('.layer-front').setAttribute('aria-hidden', String(isOpen));
      button.querySelector('.layer-back').setAttribute('aria-hidden', String(!isOpen));
    });
    one('#layer-count').textContent=`已翻开 ${opened.size} / 3 张`;
    one('#layer-insight').textContent=opened.size===3?'同一个“升”字，从描述升学，走向了“向上才有价值”的社会判断。':opened.size?'继续翻开另外几张，看看字面意思之外还有什么。':'先猜一猜：“神话”在这里，和神仙故事有关吗？';
  }
  all('[data-layer]').forEach((button,index)=>button.addEventListener('click',()=>{opened.has(index)?opened.delete(index):opened.add(index);updateLayers();}));
  one('#reset-layers').addEventListener('click',()=>{opened.clear();updateLayers();});
  let firstReading=null,secondReading=null,heardNext=false;
  function renderReading(){
    one('#next-line').hidden=!heardNext;
    one('#reading-step').textContent=heardNext?'第二步 / 放回前后文':'第一步 / 单看这一句';
    one('#reading-prompt').textContent=heardNext?'现在，你会保持原来的判断，还是换一种读法？':'这句话对学历等级的态度，你会怎么读？';
    all('[data-reading]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.reading===(heardNext?secondReading:firstReading))));
    one('#hear-next').hidden=heardNext;one('#hear-next').disabled=!firstReading;
    one('#reading-feedback').hidden=!(heardNext&&secondReading);
    one('#reading-status').textContent=heardNext?(secondReading?'你已完成两次阅读。可以继续切换，比较不同理解。':`你的初读是“${firstReading}”。读完下文，再选一次。`):(firstReading?`你的初读是“${firstReading}”。准备好看下一句了吗？`:'选择一种读法，就可以看下一句。');
    if(heardNext&&secondReading)one('#reading-trail').textContent=`你的初读：${firstReading}，放回前后文：${secondReading}`;
  }
  all('[data-reading]').forEach(button=>button.addEventListener('click',()=>{if(heardNext)secondReading=button.dataset.reading;else firstReading=button.dataset.reading;renderReading();}));
  one('#hear-next').addEventListener('click',()=>{if(firstReading){heardNext=true;renderReading();}});
  one('#reset-reading').addEventListener('click',()=>{firstReading=null;secondReading=null;heardNext=false;renderReading();});
  const presets=[
    {before:'游戏',after:'',original:'“游戏本”里的“本”，指笔记本电脑。点一下开关，试试同一套替换规则。',changed:'“游戏专”不是这里的常用电脑称呼。改写把歌词中的“本／专”替换规则，搬到了另一个语境。'},
    {before:'',after:'来',original:'“本来”是一个日常词语，通常不涉及学历。试着只换掉第一个字。',changed:'“专来”把“本来”的“本”换成了“专”。文稿中的匿名评论是：“注意是本来，不是专来。”'},
    {before:'笔记',after:'',original:'“笔记本”可以指记录文字的本子，也可以指笔记本电脑。这里沿用文稿提到的构词例子。',changed:'“笔记专”继续套用“本／专”替换。词语被重新组合，也为追问其中的比较关系提供了材料。'}
  ];
  let preset=0,swapped=false;
  function renderRemix(){
    const current=presets[preset];
    all('[data-preset]').forEach((button,index)=>button.setAttribute('aria-pressed',String(index===preset)));
    const word=one('#remix-word');word.replaceChildren(document.createTextNode(current.before));
    const letter=document.createElement('span');letter.className='changed-letter';letter.textContent=swapped?'专':'本';word.append(letter,document.createTextNode(current.after));
    one('#remix-state').textContent=swapped?'站内构词演示':'原词';
    one('#swap-word').setAttribute('aria-label',swapped?'将专还原为本':'将本替换为专');
    one('#remix-title').textContent=swapped?'词语换了，联想也跟着来了。':'先看一个熟悉的词。';
    one('#remix-description').textContent=swapped?current.changed:current.original;
    one('.remix-machine-hint').textContent=swapped?'再点一次，还原“本”。':'点一下开关，把“本”换成“专”。';
  }
  all('[data-preset]').forEach((button,index)=>button.addEventListener('click',()=>{preset=index;swapped=false;renderRemix();}));
  const swapButton=one('#swap-word');
  swapButton.addEventListener('click',()=>{swapped=!swapped;renderRemix();});
  one('#reset-remix').addEventListener('click',()=>{swapped=false;renderRemix();});

  enableMagneticHover(swapButton.closest('.magnetic-field'));
  showLab(0);updateLayers();renderReading();renderRemix();
})();
