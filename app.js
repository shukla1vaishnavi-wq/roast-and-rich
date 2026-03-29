/* ═══════════════════════════════════════════════════════════
   ROAST & RICH — Core Logic v8
   English only · No brand promotion · Unique goal strategies
   Fixed greetings · Clean neutral language throughout
═══════════════════════════════════════════════════════════ */

// ─── STATE ────────────────────────────────────────────────
const RR = {
  get profile()   { try{return JSON.parse(localStorage.getItem('rr_profile')||'null');}catch{return null;} },
  set profile(v)  { localStorage.setItem('rr_profile',JSON.stringify(v)); },
  get apiKey()    { return localStorage.getItem('rr_api')||''; },
  set apiKey(v)   { localStorage.setItem('rr_api',v); },
  get theme()     { return localStorage.getItem('rr_theme')||'dark'; },
  set theme(v)    { localStorage.setItem('rr_theme',v); },
  get dailyLog()  { try{return JSON.parse(localStorage.getItem('rr_daily')||'[]');}catch{return[];} },
  set dailyLog(v) { localStorage.setItem('rr_daily',JSON.stringify(v)); },
  get moodLog()   { try{return JSON.parse(localStorage.getItem('rr_mood')||'[]');}catch{return[];} },
  set moodLog(v)  { localStorage.setItem('rr_mood',JSON.stringify(v)); },
  get badges()    { try{return JSON.parse(localStorage.getItem('rr_badges')||'[]');}catch{return[];} },
  set badges(v)   { localStorage.setItem('rr_badges',JSON.stringify(v)); },
  get loggedIn()  { return localStorage.getItem('rr_logged')==='1'; },
  set loggedIn(v) { localStorage.setItem('rr_logged',v?'1':'0'); },
  logout(){ const t=this.theme; localStorage.clear(); localStorage.setItem('rr_theme',t); },
};

// ─── UNIVERSAL NAVBAR ─────────────────────────────────────
function injectNavbar(activeId) {
  const nb = document.getElementById('universal-navbar');
  if (!nb) return;
  nb.innerHTML = `
<div class="inner">
  <a href="index.html" class="nav-logo"><span class="g">Roast</span><span class="p">&</span><span class="g">Rich</span></a>
  <div class="nav-links">
    <button class="nav-link ${activeId==='dashboard'?'active':''}"  onclick="location.href='dashboard.html'">Dashboard</button>
    <button class="nav-link ${activeId==='roast'?'active':''}"      onclick="location.href='roast.html'">Roast</button>
    <button class="nav-link ${activeId==='fomo'?'active':''}"       onclick="location.href='fomo.html'">FOMO</button>
    <button class="nav-link ${activeId==='wealth'?'active':''}"     onclick="location.href='wealth.html'">Wealth</button>
    <button class="nav-link ${activeId==='budget'?'active':''}"     onclick="location.href='budget.html'">Budget</button>
    <button class="nav-link ${activeId==='goals'?'active':''}"      onclick="location.href='goals.html'">Goals</button>
    <button class="nav-link ${activeId==='tracker'?'active':''}"    onclick="location.href='tracker.html'">Tracker</button>
    <button class="nav-link ${activeId==='mood'?'active':''}"       onclick="location.href='mood.html'">Mood</button>
    <button class="nav-link ${activeId==='rewards'?'active':''}"    onclick="location.href='rewards.html'">Rewards</button>
    <button class="nav-link ${activeId==='chat'?'active':''}"       onclick="location.href='chat.html'">AI Chat</button>
    <button class="nav-link ${activeId==='blog'?'active':''}"       onclick="location.href='blog.html'">Blog</button>
    <button class="nav-link ${activeId==='vision'?'active':''}"     onclick="location.href='vision.html'">Vision</button>
    <button class="nav-link ${activeId==='mission'?'active':''}"    onclick="location.href='mission.html'">Mission</button>
  </div>
  <div class="nav-actions">
    <button class="btn btn-ghost btn-sm" id="theme-toggle" onclick="toggleTheme()">☀️</button>
    <button class="btn btn-ghost btn-sm" onclick="location.href='settings.html'" title="Settings">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.4"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</div>`;
}

// ─── THEME ────────────────────────────────────────────────
function applyTheme(){ document.body.classList.toggle('light',RR.theme==='light'); }
function toggleTheme(){
  RR.theme=RR.theme==='dark'?'light':'dark'; applyTheme();
  document.querySelectorAll('#theme-toggle').forEach(b=>{ if(b) b.textContent=RR.theme==='dark'?'☀️':'🌙'; });
}
document.addEventListener('DOMContentLoaded',()=>{
  applyTheme();
  document.querySelectorAll('#theme-toggle').forEach(b=>{ if(b) b.textContent=RR.theme==='dark'?'☀️':'🌙'; });
});

// ─── LOADER ───────────────────────────────────────────────
function hideLoader(){
  const el=document.getElementById('loading-screen'); if(!el) return;
  setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity .3s';setTimeout(()=>el&&el.remove(),320);},900);
}
document.addEventListener('DOMContentLoaded',hideLoader);

// ─── HELPERS ──────────────────────────────────────────────
const fmt    = n  => '₹'+Math.round(n||0).toLocaleString('en-IN');
const val    = id => { const e=document.getElementById(id);if(!e)return 0;const v=parseFloat(e.value);return isNaN(v)?0:v; };
const strVal = id => { const e=document.getElementById(id);return e?e.value.trim():''; };

function fmtShort(n){
  n=Math.round(n||0);
  if(n>=10000000) return '₹'+(n/10000000).toFixed(1).replace(/\.0$/,'')+'Cr';
  if(n>=100000)   return '₹'+(n/100000).toFixed(1).replace(/\.0$/,'')+'L';
  if(n>=1000)     return '₹'+(n/1000).toFixed(0)+'K';
  return '₹'+n.toLocaleString('en-IN');
}

function today(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// No Hindi pronouns — always English
function pronoun(){ return 'you'; }

function profileStr(){
  const p=RR.profile; if(!p) return 'No profile.';
  const goals=(p.goals||[]).map(g=>`${g.name}(${fmt(g.amount)} in ${g.years}yr)`).join(', ');
  return `Name:${p.name} Age:${p.age} Gender:${p.gender||'?'} Situation:${p.situation} City:${p.city} `+
    `Income:${fmt(p.income)}/mo CanSave:${fmt(p.canSave)}/mo Saved:${fmt(p.saved)} `+
    `Spend:${fmt(p.spend)}/mo Retire:${p.retire} Goals:[${goals||'None'}]`;
}

// ─── NAV GUARD ────────────────────────────────────────────
function requireProfile(){ if(!RR.profile||!RR.loggedIn){window.location.href='onboarding.html';return false;}return true; }
function softRequire(){ return RR.profile; }

// ─── FOMO ENGINE ──────────────────────────────────────────
function smartFomoEngine(item,amount,spent,why){
  const p=RR.profile||{},income=Math.max(p.income||0,1),canSave=p.canSave||0;
  const remaining=Math.max(income-spent,0),after=remaining-amount;
  const pct=Math.round((amount/Math.max(remaining,1))*100);
  const iL=item.toLowerCase();

  if(amount<=50) return{verdict:'GO FOR IT',headline:`₹${amount}? That's nothing.`,reason:`At ₹${amount}, this barely registers on your budget. Don't overthink small amounts.`,alt:null,delay_weeks:0,budgetPct:pct};

  const ess=['fee','fees','tuition','college','school','exam','medicine','medical','doctor','hospital','rent','hostel','electricity','wifi','grocery','groceries','milk','transport','bus','metro','book','course','insurance','emi','loan','tax'];
  if(ess.some(k=>iL.includes(k))) return{verdict:'GO FOR IT',headline:'Essential expense — go ahead.',reason:`${item} is a necessity, not an impulse purchase. If budget is tight, cut discretionary spending instead — not this.`,alt:'Find the best price available, but do not delay essential expenses.',delay_weeks:0,budgetPct:pct};

  let dw=0,dn='';
  if(p.goals&&p.goals.length>0){
    const near=p.goals.slice().sort((a,b)=>a.years-b.years)[0];
    dw=Math.round((amount/(near.amount/(near.years*12)))*4.33);
    if(dw>0) dn=`This would delay your ${near.name} goal by approximately ${dw} week${dw!==1?'s':''}.`;
  }

  if(after<0) return{verdict:'BAD IDEA',headline:`You do not have ₹${amount.toLocaleString('en-IN')} left this month.`,reason:`You have spent ₹${spent.toLocaleString('en-IN')} already and only ₹${remaining.toLocaleString('en-IN')} remains. This would put you ₹${Math.abs(after).toLocaleString('en-IN')} in the negative. ${dn}`,alt:'Wait until next month when your budget resets.',delay_weeks:dw,budgetPct:pct};
  if(pct>60) return{verdict:'BAD IDEA',headline:`This would take up ${pct}% of your remaining budget.`,reason:`₹${amount.toLocaleString('en-IN')} is ${pct}% of what you have left this month (₹${remaining.toLocaleString('en-IN')}). Very little would remain for other needs. ${dn}`,alt:'Look for a cheaper alternative or spread the cost across two months.',delay_weeks:dw,budgetPct:pct};
  if(pct>35&&after<canSave) return{verdict:'WAIT A BIT',headline:'Doable, but it cuts into your savings target.',reason:`After this purchase, you would have ₹${after.toLocaleString('en-IN')} remaining — below your monthly savings target of ₹${canSave.toLocaleString('en-IN')}. ${dn}`,alt:'Consider cutting one non-essential this month to compensate.',delay_weeks:dw,budgetPct:pct};

  const imp=['bored','yolo','everyone','sale','discount'];
  if(imp.some(r=>why.toLowerCase().includes(r))&&dw>2) return{verdict:'WAIT A BIT',headline:'Affordable — but is it worth the goal delay?',reason:`Your budget can handle ₹${amount.toLocaleString('en-IN')} (${pct}% of remaining), but the reason "${why}" suggests this might be impulse-driven. ${dn}`,alt:'Sleep on it. If you still want it tomorrow with full information, go ahead.',delay_weeks:dw,budgetPct:pct};
  return{verdict:'GO FOR IT',headline:'Your budget allows this.',reason:`₹${amount.toLocaleString('en-IN')} is ${pct}% of your remaining budget. ${after>canSave?'You will still hit your savings target this month. ':''}${dn||'Enjoy your purchase!'}`,alt:dw>0?`Keep in mind: this delays your nearest goal by ${dw} week${dw!==1?'s':''}.`:null,delay_weeks:dw,budgetPct:pct};
}

// ─── DAILY LOG ────────────────────────────────────────────
function getTodayLog(){ const d=today(),log=RR.dailyLog; return log.find(l=>l.date===d)||{date:d,entries:[],total:0}; }
function saveTodayEntry(cat,amount,note){
  const d=today(),log=RR.dailyLog.filter(l=>l.date!==d),e=getTodayLog();
  e.entries.push({id:Date.now(),category:cat,amount,note,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});
  e.total=e.entries.reduce((s,x)=>s+x.amount,0); log.push(e); RR.dailyLog=log; checkBadges();
}
function deleteEntry(id){
  const d=today(),log=RR.dailyLog,e=log.find(l=>l.date===d);if(!e)return;
  e.entries=e.entries.filter(x=>x.id!==id); e.total=e.entries.reduce((s,x)=>s+x.amount,0); RR.dailyLog=log;
}
function getMonthTotal(){ const ym=today().slice(0,7); return RR.dailyLog.filter(l=>l.date.startsWith(ym)).reduce((s,l)=>s+(l.total||0),0); }

// ─── MOOD ─────────────────────────────────────────────────
function saveMoodEntry(rating,regret,saved,note){
  const log=RR.moodLog,i=log.findIndex(l=>l.date===today()),e={date:today(),rating,regret,saved,note,ts:Date.now()};
  if(i>=0)log[i]=e;else log.push(e); if(log.length>90)log.shift(); RR.moodLog=log; checkBadges();
}
function getMoodInsight(){
  const log=RR.moodLog.slice(-14);if(log.length<3)return null;
  const avg=(log.reduce((s,l)=>s+l.rating,0)/log.length).toFixed(1);
  const reg=log.filter(l=>l.regret).length,sav=log.filter(l=>l.saved).length;
  if(reg>log.length*0.5) return `You have been regretting purchases on ${reg} out of ${log.length} tracked days. This points to an emotional spending pattern — try waiting 48 hours before any non-essential purchase over ₹300.`;
  if(parseFloat(avg)<2.5) return `Your financial mood has been low lately (average ${avg}/5). Low-mood days often trigger impulse spending as a form of comfort. Be especially mindful on difficult days.`;
  if(sav>log.length*0.7)  return `You have been saving consistently — ${sav} out of ${log.length} days tracked. That discipline is building real momentum. Keep it going.`;
  return `You have logged ${log.length} days. Average mood: ${avg}/5. Spending patterns usually become visible after two weeks of tracking — keep going.`;
}

// ─── STREAK ───────────────────────────────────────────────
function getStreak(){
  const dates=[...new Set(RR.dailyLog.map(l=>l.date))].sort().reverse(); let streak=0;
  for(let i=0;i<dates.length;i++){ const d=new Date(dates[i]+'T12:00:00'),e=new Date();e.setDate(e.getDate()-i); if(d.toDateString()===e.toDateString())streak++;else break; }
  return streak;
}

// ─── BADGES ───────────────────────────────────────────────
const BADGE_DEFS=[
  {id:'first_log',   name:'Money Moves',      desc:'Logged your first expense'},
  {id:'streak_3',    name:'On a Roll',         desc:'Tracked 3 days straight'},
  {id:'streak_7',    name:'Locked In',         desc:'7 days of consistent tracking'},
  {id:'saved_today', name:'Bag Secured',       desc:'Chose to save money today'},
  {id:'mood_5',      name:'Vibe Check Pro',    desc:'Logged 5 financial mood entries'},
  {id:'fomo_beaten', name:'Anti-FOMO Legend',  desc:'Resisted a purchase via FOMO Filter'},
  {id:'budget_ninja',name:'Budget God',        desc:'Monthly spend under 80% of income'},
];
function checkBadges(){
  const earned=new Set(RR.badges),streak=getStreak();
  if(RR.dailyLog.length>=1)earned.add('first_log');
  if(streak>=3)earned.add('streak_3'); if(streak>=7)earned.add('streak_7');
  if(RR.moodLog.length>=5)earned.add('mood_5');
  if(RR.moodLog.some(l=>l.saved))earned.add('saved_today');
  const p=RR.profile; if(p&&p.income&&getMonthTotal()<p.income*0.8)earned.add('budget_ninja');
  RR.badges=[...earned];
}
function awardFomoBadge(){ const s=new Set(RR.badges);s.add('fomo_beaten');RR.badges=[...s]; }

// ─── PERSONALITY ──────────────────────────────────────────
function getPersonality(){
  const p=RR.profile;if(!p)return null;
  const sr=p.income?(p.canSave/Math.max(p.income,1))*100:0;
  let score=Math.min(sr*2,40)+Math.min(RR.badges.length*3,20)+Math.min(RR.moodLog.length*2,20);
  if(p.income>0){const r=getMonthTotal()/p.income;score+=r<0.6?20:r<0.8?10:r<1?5:0;}else score+=10;
  score=Math.round(Math.min(score,100));
  let type,desc;
  if(score>=80){type='Budget God';desc='You control your money. Top-tier financial habits for your age.';}
  else if(score>=60){type='Careful Planner';desc='Solid habits in place. A few refinements will take you to the next level.';}
  else if(score>=40){type='Growing Saver';desc='You are heading in the right direction. Small consistent changes will accelerate your progress.';}
  else if(score>=20){type='Impulse Explorer';desc='Life is fun, but the bank balance is struggling. Adding structure will change things quickly.';}
  else{type='Spender in Denial';desc='No judgment — but a conversation is needed. Starting to track today makes a real difference.';}
  return{score,type,desc};
}

// ─── AI CALL ──────────────────────────────────────────────
async function callAI(prompt,maxTokens=500){
  const key=RR.apiKey;if(!key)return mockAI(prompt);
  try{
    if(key.startsWith('sk-ant')){
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},
        body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:maxTokens,messages:[{role:'user',content:prompt}]})});
      const d=await r.json();return d.content?.[0]?.text||d.error?.message||'No response.';
    }else{
      const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
        body:JSON.stringify({model:'gpt-3.5-turbo',max_tokens:maxTokens,messages:[{role:'user',content:prompt}]})});
      const d=await r.json();return d.choices?.[0]?.message?.content||d.error?.message||'No response.';
    }
  }catch(e){return mockAI(prompt);}
}

// ─── FIXED GREETINGS — natural, predefined ────────────────
const FIXED_GREETINGS = {
  hi: [
    `Hi there! Ready to talk money. What's on your mind today — spending, saving, or investing?`,
    `Hey! Your Roast&Rich AI is online. What financial question can I help you with?`,
    `Hi! I already have your full profile loaded — income, goals, city. What do you want to work on?`,
    `Hello and welcome back! What would you like to figure out today?`,
  ],
  hello: [
    `Hello! Great to have you here. What money topic would you like to dig into today?`,
    `Hello! I'm your personal finance AI. Ask me anything — budgeting, saving, goals, or investments.`,
    `Hi there! Your financial data is all loaded up. What's the question on your mind?`,
  ],
  howAreYou: [
    `I'm doing well, thank you for asking! More importantly — how is your financial situation this month? Any spending or saving goals I can help you with?`,
    `All good on my end! The real question is: how are your finances doing? Let's make sure everything is on track.`,
    `Functioning perfectly and ready to help! How about you — are your savings targets looking good this month?`,
  ],
  bye: [
    `Goodbye! Keep tracking your spending — small habits create big results. See you soon!`,
    `Take care! Remember: even small amounts saved consistently add up to real wealth over time.`,
    `Bye! Come back whenever you need financial guidance. You're doing great by staying engaged with your money.`,
  ],
  thanks: [
    `You're welcome! Feel free to come back whenever you have more questions. Good luck with your financial goals!`,
    `Happy to help! Keep up the good habits and check in anytime you need guidance.`,
    `Anytime! That's exactly what I'm here for. Stay consistent with your savings and you'll see real results.`,
  ],
  ok: [
    `Got it! Is there anything else you'd like help with — budgeting, goal planning, or investing basics?`,
    `Understood. Let me know if you have any follow-up questions about your finances.`,
  ],
  okay: [
    `Great! Let me know if there's anything else I can help you with today.`,
    `Perfect. Feel free to ask about anything — spending analysis, savings tips, or investment options.`,
  ],
};

// ─── DETECT SIMPLE CHAT MESSAGES ─────────────────────────
function detectSimpleMessage(text) {
  const t = text.toLowerCase().trim();
  // Exact or near-exact greetings
  if (/^(hi|hi!|hii|hiii|hey|hey!|heyyy|hi there|heyy)$/.test(t)) return 'hi';
  if (/^(hello|hello!|helo|helloo|hellooo)$/.test(t)) return 'hello';
  if (/^(how are you|how r u|how are you\??|how are you doing|how do you do|you doing well\??)$/.test(t)) return 'howAreYou';
  if (/^(bye|goodbye|good bye|bye bye|see you|see ya|cya|ttyl|byeeee|byee)$/.test(t)) return 'bye';
  if (/^(thanks|thank you|thank you!|thx|thnks|thankyou|tysm|ty|thanku|thank u|thank uu)$/.test(t)) return 'thanks';
  if (/^(ok|ok!|okay|okay!|alright|got it|sure|sounds good|okiee|okie|ohkaiee)$/.test(t)) return t.startsWith('ok')&&!t.startsWith('okay')?'ok':'okay';
  return null;
}

function getFixedResponse(type) {
  const arr = FIXED_GREETINGS[type] || FIXED_GREETINGS.hi;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── PRESET CHIP RESPONSES — context-aware, English only ──
function presetResponse(chipText) {
  const p = RR.profile || {};
  const name = p.name || 'there';
  const income = p.income || 0;
  const canSave = p.canSave || 0;
  const saved = p.saved || 0;
  const retire = p.retire || 55;
  const age = p.age || 20;
  const goals = p.goals || [];
  const yrsToRetire = Math.max(retire - age, 1);
  const corpus = calcCorpus(canSave, saved, yrsToRetire);
  const chip = chipText.toLowerCase();

  // ── Should I start a SIP? ──
  if (chip.includes('sip')) {
    if (canSave <= 0) {
      return `${name}, let us talk about starting a SIP.\n\nRight now you are not saving a fixed amount each month. The first step is to decide on a number — even ₹200 per month is a start.\n\nHow SIPs work: you invest a fixed amount every month into a mutual fund through any investment platform. It takes about 10 minutes to set up.\n\nIf you have no income yet: a ₹100 per month SIP still builds the habit. Start with what you can — the amount can be increased later.`;
    }
    const sipAmt = Math.round(canSave * 0.5);
    return `${name}, with your current savings capacity of ${fmt(canSave)} per month, starting a SIP is absolutely the right move.\n\nMy suggestion: invest ${fmt(sipAmt)} per month in a Nifty 50 Index Fund.\n\nProjected result over ${yrsToRetire} years: approximately ${fmtShort(calcCorpus(sipAmt, saved, yrsToRetire))} at 12% average annual return.\n\nHow to get started:\n→ Download any investment platform app\n→ Search for a Nifty 50 Index Fund\n→ Set your SIP date to one day after your salary or allowance arrives\n→ Enable auto-debit — set it once and let it run\n\nImportant: Do not stop your SIP when the market falls. A falling market means you are buying at a lower price — that is actually better for long-term investors.`;
  }

  // ── How to save more? ──
  if (chip.includes('save more') || chip.includes('saving')) {
    if (income <= 0) {
      return `${name}, your income is not set in your profile yet. Please update it in Settings or Onboarding first.\n\nGeneral saving tips that work regardless of income:\n→ Save before you spend — transfer a fixed amount the moment you receive money\n→ Do a weekly review of your spending — most people find 3 to 4 unnecessary expenses they had forgotten about\n→ Cancel unused subscriptions — these add up to ₹300 to ₹600 per month for most people\n→ Use the Daily Tracker to log every expense for two weeks — patterns become very clear`;
    }
    const savePct = Math.round((canSave / income) * 100);
    const target = Math.round(income * 0.2);
    return `${name}, here is your current saving snapshot:\n\n→ Income: ${fmt(income)} per month\n→ Saving: ${fmt(canSave)} per month\n→ Savings rate: ${savePct}%\n→ Target: 20% minimum = ${fmt(target)} per month\n\n${savePct >= 20 ? 'Your savings rate is solid. Aim to push it toward 25%.' : 'You are below the 20% target. Here is how to close that gap:'}\n\nTop three saving moves:\n→ Identify your single biggest non-essential expense and reduce it by 20% this month\n→ Check your subscriptions — cancel anything you have not used in the past 30 days\n→ Set up an automatic transfer on the day your salary or allowance arrives — this is the most reliable method\n\nUse the Tracker tab to see exactly where your money goes. Two weeks of data will reveal patterns you were not aware of.`;
  }

  // ── Is my spending okay? ──
  if (chip.includes('spending')) {
    const monthSpend = getMonthTotal();
    if (monthSpend === 0 && !p.spend) {
      return `${name}, there is no spending data available yet.\n\nHere is how to get started:\n→ Daily Tracker tab: add today's expenses as they happen\n→ Money Roast tab: enter this month's spending by category\n\nTrack for two weeks and I can give you a proper spending analysis with specific recommendations.`;
    }
    const spendAmt = monthSpend > 0 ? monthSpend : (p.spend || 0);
    const spendPct = income > 0 ? Math.round((spendAmt / income) * 100) : 0;
    const status = spendPct > 85 ? 'This is too high — needs urgent attention' :
                   spendPct > 70 ? 'A bit stretched — look for areas to tighten' :
                   spendPct > 50 ? 'Manageable — but there is room to improve' :
                                   'Well controlled — spending is under control';
    return `${name}, here is your spending picture:\n\n→ Spent this month: ${fmt(spendAmt)}\n→ Monthly income: ${fmt(income)}\n→ Spending ratio: ${spendPct}% of income\n→ Assessment: ${status}\n\nHealthy benchmark: 60 to 70% on spending, 20 to 30% on savings.\n\n${spendPct > 70 ? 'Recommended action: Find your two biggest spending categories and reduce each by 15 to 20%. The Roast tab will show you exactly where the leaks are.' : 'Keep this up. Redirect your surplus to an investment or savings goal.'}`;
  }

  // ── What should I invest in? ──
  if (chip.includes('invest')) {
    if (saved < (p.spend || 3000) * 3) {
      return `${name}, here is an honest answer: build your emergency fund first before investing.\n\nThe rule: 3 months of expenses = ${fmt(Math.max((p.spend || 3000) * 3, 15000))} in a liquid or fixed-deposit account.\n\nYou currently have ${fmt(saved)} saved. Without an emergency fund, any investment you make is at risk — one unexpected expense and you would have to break your investment at the wrong time.\n\nTwo steps to follow:\n→ Step 1: Complete your emergency fund in a high-interest savings account or liquid fund\n→ Step 2: Then start a monthly SIP in a Nifty 50 Index Fund\n\nThese two steps together create a proper financial foundation.`;
    }
    return `${name}, with ${fmt(saved)} already saved, you have a foundation to work from.\n\nInvestment path based on your profile:\n\n→ Foundation (done): Emergency fund\n→ Core investment: Nifty 50 Index Fund — ${fmt(Math.round(canSave * 0.6))} per month via any investment platform\n→ Secondary: Balanced or flexi-cap fund — ${fmt(Math.round(canSave * 0.2))} per month\n→ Tax-saving option: PPF (7.1% guaranteed + tax benefit under 80C) or NPS\n\nSimplest action: Open an account on any investment platform, search for a Nifty 50 Index Fund, set up a monthly SIP for the day after your salary arrives.\n\nDo not try to time the market. Just stay consistent over ${yrsToRetire} years.`;
  }

  // ── How to build emergency fund? ──
  if (chip.includes('emergency')) {
    const target3m = Math.max((p.spend || 3000) * 3, 15000);
    const remaining = Math.max(target3m - saved, 0);
    if (remaining <= 0) {
      return `${name}, your emergency fund is already built! You have ${fmt(saved)} saved — you are covered.\n\nNext step: now that the emergency fund is complete, redirect your monthly saving capacity toward investment. That money should be working for you, not just sitting idle.`;
    }
    const months = canSave > 0 ? Math.ceil(remaining / canSave) : 12;
    return `${name}, an emergency fund is your financial safety net — the most important thing to build before anything else.\n\nYour target: ${fmt(target3m)} (3 months of your ₹${(p.spend || 3000).toLocaleString('en-IN')} monthly expenses)\nCurrently saved: ${fmt(saved)}\nStill needed: ${fmt(remaining)}\n\nAt your current savings rate (${fmt(canSave)} per month):\n→ Fully funded in ${months} month${months !== 1 ? 's' : ''}\n\nBest place to keep it:\n→ High-interest savings account (4 to 7% interest)\n→ Liquid mutual fund (slightly better returns, still easy to withdraw)\n→ Not in equity or index funds — this money must be instantly accessible\n\nDo not invest your emergency fund. This is your financial stability, not a wealth-building tool.`;
  }

  // ── How much to retire at goal age? ──
  if (chip.includes('retire')) {
    const monthlyAtRetire = Math.max(p.spend || 30000, 10000) * (1.05 ** yrsToRetire);
    const corpusNeeded = (monthlyAtRetire * 12) / 0.04;
    const onTrack = corpus >= corpusNeeded * 0.8;
    return `${name}, here is the retirement math based on your profile:\n\n→ Target retirement age: ${retire}\n→ Years remaining: ${yrsToRetire}\n→ Corpus needed: approximately ${fmtShort(Math.round(corpusNeeded))} (based on 4% safe withdrawal rule)\n→ Projected at current pace: ${fmtShort(corpus)} by age ${retire}\n→ Status: ${onTrack ? 'On track' : 'Gap exists — action needed'}\n\n${onTrack ? 'You are in good shape. Continue your current savings rate and review again in 2 to 3 years.' : 'To close the gap:\n→ Increase your monthly investment by ₹' + Math.max(500, Math.round(canSave * 0.1)).toLocaleString('en-IN') + ' per year as your income grows\n→ Even a small increase compounded over ' + yrsToRetire + ' years makes a significant difference'}\n\nUse the Wealth Builder tab to see a visual projection of your retirement corpus.`;
  }

  // Fallback
  return mockAI(chipText);
}

// ─── MOCK AI — English only, no brand names ───────────────
function mockAI(prompt) {
  const p = RR.profile || {};
  const name = p.name || 'there';
  const low = prompt.toLowerCase();

  // ── Detect simple messages first ──
  const simpleType = detectSimpleMessage(prompt);
  if (simpleType) return getFixedResponse(simpleType);

  // ── SIP / investing ──
  if (/sip|invest|mutual fund|nifty|index fund|stock|shares?/i.test(low)) {
    const canSave = p.canSave || 0;
    const tips = [
      `Here are the SIP basics that actually matter:\n\n→ Start with a Nifty 50 Index Fund on any investment platform — minimum ₹100 per month\n→ Set your SIP date to the day after your salary or allowance arrives — this ensures you invest before spending\n→ When markets fall, do not stop your SIP — you are buying units at a lower price, which helps you long-term\n→ ${canSave > 0 ? `With your ${fmt(canSave)} per month savings capacity, even ${fmt(Math.round(canSave * 0.5))} in a monthly SIP builds serious wealth over ${Math.max((p.retire || 55) - (p.age || 20), 10)} years.` : 'Even ₹500 per month invested at your age creates meaningful wealth over time.'}`,
      `Investment basics that are actually useful:\n\n1. Emergency fund first — keep 3 months of expenses in a liquid fund or fixed deposit\n2. Then start a monthly SIP in an index fund — do not try to pick individual stocks without proper research\n3. PPF gives you a guaranteed 7.1% return plus a tax benefit under Section 80C — great for conservative investors\n4. The biggest mistake beginners make: stopping investments when markets drop. That is precisely when you should continue.`,
      `${name}, here is the power of starting early:\n\n₹1,000 per month invested at age 21 = approximately ₹3.5 Crore by age 60 (at 12% average return)\n₹1,000 per month invested at age 31 = approximately ₹1.2 Crore by age 60\n\nThat ₹2.3 Crore difference comes from just 10 years of delay.\n\nThe best time to start was yesterday. The second best time is today. Which investment platform would you like guidance on?`,
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // ── Saving / budget ──
  if (/save|saving|budget|spend less|monthly|expenses/i.test(low)) {
    const income = p.income || 0;
    const tips = [
      `Saving tips that genuinely work:\n\n→ Automate it — transfer a fixed amount the moment your income arrives, before you can spend it\n→ 24-hour rule — for any non-essential purchase over ₹500, wait one full day before buying\n→ Digital payments make money feel abstract — try keeping a weekly cash limit for discretionary spending\n→ ${income > 0 ? `You earn ${fmt(income)} per month and save ${Math.round(((p.canSave || 0) / income) * 100)}%. Target: 20 to 30% minimum.` : 'Start with any fixed amount — the habit of saving matters more than the size of the amount at first.'}`,
      `A simple budget framework:\n\n→ 50% on needs: rent, food, transport, utility bills\n→ 30% on wants: dining out, entertainment, shopping\n→ 20% on savings and investments\n\nFor students in Indian cities, 60-20-20 is more realistic. The key is to track every expense for two weeks — most people are genuinely surprised where their money goes when they see it written down.\n\n${p.spend ? `Your current spending is ${fmt(p.spend)} per month versus income of ${fmt(income)}. That is a ${Math.round((p.spend / Math.max(income, 1)) * 100)}% spending ratio.` : ''}`,
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // ── Goals ──
  if (/goal|car|house|trip|laptop|dream|plan for/i.test(low)) {
    const goals = p.goals || [];
    if (goals.length > 0) {
      const g = goals[0], pm = Math.round(g.amount / (g.years * 12));
      return `Your ${g.name} goal: ${fmt(g.amount)} in ${g.years} years.\n\n→ Monthly amount needed: ${fmt(pm)}\n→ Current savings capacity: ${fmt(p.canSave || 0)} — ${(p.canSave || 0) >= pm ? 'your savings cover this goal' : 'shortfall of ' + fmt(pm - (p.canSave || 0)) + ' per month'}\n→ Best investment vehicle for a ${g.years}-year timeline: ${g.years <= 3 ? 'recurring deposit or liquid fund (safe, accessible)' : g.years <= 7 ? 'balanced fund or index fund' : 'equity SIP in a Nifty 50 index fund'}\n→ Practical tip: open a separate savings account specifically for this goal — labeling money for a specific purpose increases goal completion rates significantly`;
    }
    return `To plan for a specific goal, go to the Goal Tracker tab. You can set a target amount and timeline, and the system will calculate exactly how much you need to save per month.\n\nGeneral guideline:\n→ Under 3 years: Fixed deposit or recurring deposit\n→ 3 to 7 years: Debt fund or balanced fund\n→ Over 7 years: Equity SIP in an index fund`;
  }

  // ── Tax ──
  if (/tax|80c|itr|income tax|deduction/i.test(low)) {
    return `Tax basics for young earners in India:\n\n→ New tax regime: lower rates with fewer deductions — usually better if you do not have many investments or loans\n→ Old tax regime: worth it if you can fill up 80C (PPF, NPS) and have health insurance or a home loan\n→ Section 80C limit: ₹1.5 lakh — PPF or NPS are the most straightforward ways to use this\n→ File your Income Tax Return before July 31 even if your income is below the taxable limit — it is required for loan applications, visa applications, and credit cards\n\nFor precise tax calculations, speak to a tax professional or use the official government tax portal.`;
  }

  // ── Stress / help ──
  if (/stress|anxious|worried|overwhelmed|don.t know|help me/i.test(low)) {
    return `${name}, financial stress is real and extremely common — especially when you are young and just figuring out how money works.\n\nHere is what actually helps:\n→ Write down your three biggest money worries in specific terms — vague anxiety becomes manageable when it is broken into concrete problems\n→ Focus on one thing at a time: usually that means building a small buffer of ₹5,000 to ₹10,000, then thinking about longer-term goals\n→ Most people who appear financially sorted online are not — they are either spending on credit or receiving family support\n\nWhat specifically is worrying you? If you share the details, I can give you something concrete to work with.`;
  }

  // ── Budget JSON (for budget.html) ──
  if (low.includes('"categories"') || low.includes('return only valid json')) {
    const income = Math.max(p.income || p.spend || 3000, 500);
    const sit = (p.situation || '').toLowerCase();
    const rent = sit.includes('hostel') ? Math.round(income * .28) : sit.includes('pg') ? Math.round(income * .32) : sit.includes('home') ? 0 : Math.round(income * .25);
    const food = Math.round(income * .20), trav = Math.round(income * .08), study = Math.round(income * .05);
    const ent = Math.round(income * .07), shop = Math.round(income * .07), sip = Math.round(income * .15);
    const emg = Math.max(income - rent - food - trav - study - ent - shop - sip, 0);
    return JSON.stringify({
      categories: [
        { name: 'Rent / PG / Hostel',    amount: rent,  percentage: Math.round(rent  / income * 100), tip: 'Negotiate annual contracts where possible — this saves significantly' },
        { name: 'Food & Groceries',      amount: food,  percentage: Math.round(food  / income * 100), tip: 'Cook at home 4 days a week and limit food delivery orders to twice a week' },
        { name: 'Transport',             amount: trav,  percentage: Math.round(trav  / income * 100), tip: 'Public transport is significantly cheaper than ride-hailing for regular commutes' },
        { name: 'Study / Work',          amount: study, percentage: Math.round(study / income * 100), tip: 'The best return on investment — spend on skills that grow your earning power' },
        { name: 'Entertainment',         amount: ent,   percentage: Math.round(ent   / income * 100), tip: 'Keep one streaming subscription at a time and rotate them monthly' },
        { name: 'Shopping / Personal',   amount: shop,  percentage: Math.round(shop  / income * 100), tip: 'Wait 48 hours before any purchase over ₹500 — reduces impulse buying significantly' },
        { name: 'SIP / Investment',      amount: sip,   percentage: Math.round(sip   / income * 100), tip: 'Automate this on the day after your income arrives — treat it like a fixed bill' },
        { name: 'Emergency Buffer',      amount: emg,   percentage: Math.max(Math.round(emg / income * 100), 0), tip: 'Build a 3-month expense fund before putting money anywhere else' },
      ],
      goal_note: `Budget calibrated for ${p.city || 'your city'} as a ${p.situation || 'student or professional'}. The investment amount compounds significantly over time — do not skip it.`,
      one_year: `Following this budget for 12 months: ${fmt(sip * 12)} invested + ${fmt(emg * 12)} in your buffer = ${fmt((sip + emg) * 12)} total wealth added.`
    });
  }

  // ── Roast ──
  if (/roast|this month:/i.test(low)) {
    const foodM = prompt.match(/Food[^₹]*₹([\d,]+)/i);
    const travM = prompt.match(/Travel[^₹]*₹([\d,]+)/i);
    const shopM = prompt.match(/Shopping[^₹]*₹([\d,]+)/i);
    const totalM = prompt.match(/Total[^₹]*₹([\d,]+)/i);
    const invM = prompt.match(/Invested[^₹]*₹([\d,]+)/i);
    const food = foodM ? parseInt(foodM[1].replace(',', '')) : 0;
    const trav = travM ? parseInt(travM[1].replace(',', '')) : 0;
    const shop = shopM ? parseInt(shopM[1].replace(',', '')) : 0;
    const total = totalM ? parseInt(totalM[1].replace(',', '')) : food + trav + shop;
    const invest = invM ? parseInt(invM[1].replace(',', '')) : 0;
    if (total === 0) return `🔥 THE ROAST\n\nZero spending? Either you are on a strict fast or you forgot to fill in honest numbers. Try again with your real figures — the roast only works if the data is accurate.\n\n✅ Quick tip: Check your payment app history for the last 30 days. That is your actual spending.`;
    return roastEngine({ food, travel: trav, shop, rent: 0, groom: 0, ent: 0, misc: 0, invest }, p);
  }

  // ── Goal strategy ──
  if (/goal|strategy|prioriti/i.test(low)) {
    const goals = p.goals || [];
    if (!goals.length) return `No goals set yet. Go to the Goal Tracker tab and add your specific goals. Once set, I can give you a precise monthly savings plan for each one.`;
    const g = goals[0], pm = Math.round(g.amount / (g.years * 12));
    return goalStrategy(g, p);
  }

  // ── General fallback — English, diverse ──
  const fallbacks = [
    `${name}, ask me something specific and I will give you a specific answer. I have your full financial profile loaded — income, goals, city. What money situation are you dealing with?`,
    `I am here to help with real financial questions. Spending habits, investment options, savings strategies, goal planning — all covered. What would you like to work on?`,
    `Drop your question and I will give you a concrete, personalised answer based on your actual profile data — not generic advice.`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ─── UNIQUE GOAL STRATEGIES ───────────────────────────────
/* Each goal type gets a completely different strategy */
function goalStrategy(g, p) {
  const name = g.name.toLowerCase();
  const pm = Math.round(g.amount / (g.years * 12));
  const gap = pm - (p.canSave || 0);
  const feasible = gap <= 0;
  const canSave = p.canSave || 0;
  const income = p.income || 0;

  // ── Emergency fund strategy ──
  if (name.includes('emergency')) {
    return `Emergency Fund Strategy for ${fmt(g.amount)}:\n\nThis is the most important financial goal — everything else should wait until this is funded.\n\n→ Monthly target: ${fmt(pm)} per month for ${g.years} year${g.years !== 1 ? 's' : ''}\n→ ${feasible ? 'Your savings capacity covers this — start immediately' : 'Shortfall: ' + fmt(gap) + ' per month — prioritise this above all other goals first'}\n→ Where to keep it: high-interest savings account or liquid mutual fund (4–7% return, instantly accessible)\n→ Do NOT invest your emergency fund in equity — it must be available within 24 hours without loss of value\n→ Rule: once this is funded, never touch it except for genuine emergencies\n\nOnce your emergency fund is complete, redirect that monthly amount entirely to investments.`;
  }

  // ── Car or bike strategy ──
  if (name.includes('car') || name.includes('bike') || name.includes('vehicle')) {
    const loanEmi = Math.round(g.amount * 0.6 / (g.years * 12)); // 60% financed
    return `Car / Bike Goal Strategy — ${fmt(g.amount)} in ${g.years} years:\n\n→ Monthly savings needed: ${fmt(pm)}\n→ ${feasible ? 'Your savings capacity covers this goal' : 'Gap: ' + fmt(gap) + ' per month — reduce other expenses or extend the timeline'}\n→ Best approach: save for a 40% down payment (${fmt(Math.round(g.amount * 0.4))}), then finance the rest via a low-interest loan\n→ This reduces the monthly saving burden to approximately ${fmt(Math.round(g.amount * 0.4 / (g.years * 12)))} per month for the down payment\n→ Investment vehicle: Recurring Deposit (safe, predictable) — this is a medium-term goal where capital protection matters more than high returns\n→ Avoid using an equity SIP for goals under 4 years — market timing risk is too high\n\nPractical tip: open a dedicated recurring deposit account for this goal. Automated monthly transfers make it effortless.`;
  }

  // ── House or flat strategy ──
  if (name.includes('house') || name.includes('flat') || name.includes('home') || name.includes('property')) {
    const downPayment = Math.round(g.amount * 0.2);
    return `House / Flat Goal Strategy — ${fmt(g.amount)} in ${g.years} years:\n\nFor property, the standard approach is saving for a down payment (20%), then taking a home loan for the rest.\n\n→ Down payment target: ${fmt(downPayment)} (20% of property value)\n→ Monthly savings for down payment: ${fmt(Math.round(downPayment / (g.years * 12)))}\n→ ${feasible ? 'Achievable at your current savings rate' : 'Gap exists — consider extending your timeline or increasing income'}\n→ Investment vehicle: Balanced fund or index fund (for timelines over 5 years), shifting to debt funds in the last 2 years before purchase\n→ Credit score: start building now — a CIBIL score above 750 gives you access to lower interest rates on your home loan\n→ Do not lock all savings in one place — keep liquidity in case property deals require quick movement\n\nLong-term perspective: property is an illiquid asset. Make sure your emergency fund is fully funded before committing to this goal.`;
  }

  // ── Travel / trip strategy ──
  if (name.includes('trip') || name.includes('travel') || name.includes('vacation')) {
    const smallSteps = Math.round(pm / 4);
    return `Dream Trip Strategy — ${fmt(g.amount)} in ${g.years} years:\n\nTravel goals are best funded with short-term, low-risk savings.\n\n→ Monthly savings needed: ${fmt(pm)}\n→ ${feasible ? 'Fully within your savings capacity — allocate this immediately' : 'Shortfall: ' + fmt(gap) + ' — either reduce the trip budget or extend the timeline by ' + Math.round(gap / canSave * g.years) + ' months'}\n→ Investment vehicle: high-interest savings account or a 12–18 month recurring deposit (safe, liquid)\n→ Avoid equity funds for this goal — if markets fall close to your travel date, you lose out\n→ Booking strategy: flights booked 3–4 months in advance and accommodation booked early can reduce costs by 20–40%\n\nExtra tip: break your weekly budget into a small daily limit of about ${fmt(smallSteps)} and avoid lifestyle inflation in the months before the trip. Small consistent savings feel painless but add up fast.`;
  }

  // ── Gadget / laptop / electronics strategy ──
  if (name.includes('gadget') || name.includes('laptop') || name.includes('phone') || name.includes('mac') || name.includes('iphone')) {
    return `Gadget / Device Goal Strategy — ${fmt(g.amount)} in ${g.years} years:\n\nShort-term goal — keep it simple and liquid.\n\n→ Monthly savings needed: ${fmt(pm)}\n→ ${feasible ? 'Your savings capacity covers this — start a dedicated savings account immediately' : 'Shortfall: ' + fmt(gap) + '/month — consider a longer timeline or a slightly lower-spec alternative'}\n→ Investment vehicle: savings account or short-term recurring deposit (1–2 years) — this is not the place for equity\n→ Smart purchase tip: buy at the end of a product cycle (just before a new model launches) — prices of the previous model typically drop by 15 to 30%\n→ Check for student discounts, cashback offers, and no-cost EMI options — these can effectively reduce the real cost\n→ Avoid using credit cards impulsively — if you must use EMI, ensure it does not eat into your SIP contributions\n\nRule of thumb: if you cannot save for it in under 24 months, the device may be above your current financial priority level.`;
  }

  // ── Generic / other goal strategy ──
  const vehicle = g.years <= 2 ? 'recurring deposit or a high-interest savings account' :
                  g.years <= 5 ? 'balanced fund or a short-term index fund' :
                                 'equity SIP in a Nifty 50 index fund';
  return `${g.name} Goal Strategy — ${fmt(g.amount)} in ${g.years} years:\n\n→ Monthly savings needed: ${fmt(pm)}\n→ ${feasible ? 'Your current savings capacity of ' + fmt(canSave) + ' covers this goal' : 'Shortfall: ' + fmt(gap) + ' per month — close this by reducing your highest non-essential expense'}\n→ Best investment vehicle for a ${g.years}-year timeline: ${vehicle}\n→ Action step: open a separate account specifically for this goal and set up an automatic monthly transfer of ${fmt(pm)}\n→ Review progress every 6 months — if your income increases, increase the monthly amount proportionally\n\nLabeling money for a specific goal dramatically increases the likelihood of achieving it. Treat this like a non-negotiable monthly bill.`;
}

// ─── ROAST ENGINE (FIXED — income-relative logic) ─────────────────────────────
function getRatios(s, income) {
  const total = s.food + s.travel + s.shop + s.rent + s.groom + s.ent + s.misc;
  const safe  = income > 0 ? income : 1;
  return {
    total,
    totalPct:  Math.round((total    / safe) * 100),
    foodPct:   Math.round((s.food   / safe) * 100),
    travelPct: Math.round((s.travel / safe) * 100),
    shopPct:   Math.round((s.shop   / safe) * 100),
    rentPct:   Math.round((s.rent   / safe) * 100),
    groomPct:  Math.round((s.groom  / safe) * 100),
    entPct:    Math.round((s.ent    / safe) * 100),
    miscPct:   Math.round((s.misc   / safe) * 100),
    investPct: Math.round((s.invest / safe) * 100),
    leftover:  income - total - s.invest,
  };
}

function getBiggest(s) {
  const cats = [
    { name: '🍔 Food',      val: s.food   },
    { name: '🚇 Travel',    val: s.travel },
    { name: '🛍️ Shopping',  val: s.shop   },
    { name: '🏠 Rent',      val: s.rent   },
    { name: '💄 Grooming',  val: s.groom  },
    { name: '🎬 Entertain', val: s.ent    },
    { name: '🎲 Misc',      val: s.misc   },
  ];
  return cats.reduce((a, b) => b.val > a.val ? b : a, { name: 'Misc', val: 0 });
}

function roastEngine(s, p) {
  const income  = (p && p.income) ? p.income : 0;
  const name    = (p && p.name)   ? p.name   : 'friend';
  const r       = getRatios(s, income);
  const biggest = getBiggest(s);

  // ── No income set ──
  if (!income) {
    return {
      roast:   `${name}, you haven't set your income in your profile. Without that, ₹3,000 spend could be nothing (on a ₹5L salary) or catastrophic (on ₹15K). Update your profile first so this roast actually means something.`,
      reality: 'Without income context, spending numbers are meaningless. Go to Settings → Profile → set monthly income.',
      fixes:   ['Update your income in Profile/Settings', 'Then come back for a proper roast 😈'],
      win:     'At least you opened the app.',
      mode:    'neutral'
    };
  }

  // ── Everything zero ──
  if (r.total === 0 && s.invest === 0) {
    return {
      roast:   `${name}, zero everything? Either you forgot to fill this in, or you survived the whole month on air and vibes. Open your UPI/bank app, check last 30 days, and enter real numbers.`,
      reality: 'No data = no roast. Check your payment app transaction history.',
      fixes:   ['Open Google Pay / PhonePe / bank app', 'Check last 30 days of transactions', 'Enter honest numbers — the roast won\'t kill you 😈'],
      win:     'You opened the app. Step one done.',
      mode:    'neutral'
    };
  }

  // ── BALLER MODE: spending ≤5% of income ──
  if (r.totalPct <= 5 && r.total > 0) {
    const idle = r.leftover;
    return {
      roast:   `${name}, you're spending ${r.totalPct}% of your income. That's not a spending problem — that's a "what are you doing with the other ${100 - r.totalPct - r.investPct}%?" problem. Are you hoarding cash under a mattress?`,
      reality: `₹${fmtN(idle)} sits idle every month. In a year that's ₹${fmtN(idle * 12)} quietly losing 6% to inflation while doing nothing for you.`,
      fixes:   [
        `You're only investing ${r.investPct}% — with this income you could easily do 40–50%`,
        'Park idle cash in liquid mutual funds or index ETFs — takes 10 minutes to set up',
        'Max out your PPF limit (₹1.5L/year) for guaranteed tax-free returns',
        'You\'re allowed to spend a little more on experiences too — you\'ve earned it'
      ],
      win:     `Spending ${r.totalPct}% of income is genuinely elite. ${r.investPct >= 20 ? 'And that SIP? Respect.' : 'Now put that idle cash to work.'}`,
      mode:    'baller'
    };
  }

  // ── GREAT SAVER: saving ≥30% and total spend ≤60% ──
  if (r.investPct >= 30 && r.totalPct <= 60) {
    return {
      roast:   `${name}, investing ${r.investPct}% of income? You absolute nerd 🤓 — while everyone else is crying about money you're quietly building wealth like a silent assassin. My roast algorithm keeps returning "this person is doing great."`,
      reality: `Keep this up for 10 years and compounding turns ₹${fmtN(s.invest)}/month into something genuinely shocking. You're doing better than 95% of people your age.`,
      fixes:   [
        r.rentPct > 40 ? `Rent is ${r.rentPct}% of income — the golden rule is ≤30%. Explore flatmate options` : `Diversify SIP across both equity and debt funds if not already done`,
        r.foodPct > 15 ? `Food at ${r.foodPct}% — slight trim possible, but not critical at your savings rate` : `Ensure you have term insurance worth 20× annual income`,
        'Build an emergency fund of 6–9 months of expenses if not done yet',
        'Consider ELSS for tax-saving under Section 80C'
      ],
      win:     `${r.investPct}% savings rate. You're the main character of your own financial story.`,
      mode:    'win'
    };
  }

  // ── OVERSPENT: spent more than income ──
  if (r.leftover < 0) {
    const overBy = Math.abs(r.leftover);
    return {
      roast:   `${name}, you spent ₹${fmtN(overBy)} MORE than your income this month 🚨 You're not living paycheck to paycheck — you're living BEYOND paycheck. That money came from savings, debt, or magic, none of which are sustainable.`,
      reality: `Overshoot ₹${fmtN(overBy)}/month × 6 months = ₹${fmtN(overBy * 6)} of savings burned or debt accumulated. In a year: ₹${fmtN(overBy * 12)}. This is a genuine emergency.`,
      fixes:   [
        `${biggest.name} is your biggest drain at ₹${fmtN(biggest.val)} (${Math.round(biggest.val / income * 100)}% of income) — cut this first`,
        `Entertainment ₹${fmtN(s.ent)} + Misc ₹${fmtN(s.misc)} = pure discretionary — halve both immediately`,
        s.shop > 0 ? `Shopping ₹${fmtN(s.shop)} — implement a 48-hour rule before any purchase` : `Set a hard daily spend limit in the Budget tab`,
        'You need a strict monthly cap — set it in Budget tab right now'
      ],
      win:     'You tracked your spending. Awareness is step one. Now act on it before next month.',
      mode:    'fire'
    };
  }

  // ── ZERO SAVINGS on real income ──
  if (s.invest === 0 && income > 15000) {
    return {
      roast:   `${name}, ₹${fmtN(income)} income and ₹0 invested. Zero. Zilch. The market was open every single day this month and you didn't participate once. ${biggest.name} alone swallowed ₹${fmtN(biggest.val)} (${Math.round(biggest.val / income * 100)}% of your income).`,
      reality: `In 5 years at 0% savings rate: ₹0 invested. If you'd put just 10% (₹${fmtN(Math.round(income * 0.10))}) in an index fund monthly, that's ~₹${fmtN(Math.round(income * 0.10 * 12 * 5 * 1.76))} in 5 years at 12% CAGR. You're leaving that on the table.`,
      fixes:   [
        `Start a SIP of ₹${fmtN(Math.round(income * 0.15))} today (15% of income) — takes 10 minutes on any investment app`,
        `${biggest.name} at ₹${fmtN(biggest.val)} is your biggest leak — trim it by 20% and redirect to SIP`,
        s.misc > 0 ? `Misc ₹${fmtN(s.misc)} = ₹${fmtN(s.misc * 12)}/year on things you can't even name` : `Review all UPI autopay subscriptions — forgotten ones add up`,
        'Automate savings transfer on salary day so you can\'t spend it first'
      ],
      win:     `₹${fmtN(income)} income — the raw material for wealth-building is there. It just needs direction.`,
      mode:    'fire'
    };
  }

  // ── HIGH RENT WARNING ──
  const rentDominates = r.rentPct > 40;

  // ── STANDARD ROAST — intensity based on totalPct ──
  const intensity = r.totalPct > 80 ? 'high' : r.totalPct > 55 ? 'medium' : 'low';
  let roast, reality;

  if (intensity === 'high') {
    roast   = `${name}, you're burning ${r.totalPct}% of your income — ${r.totalPct > 90 ? 'that\'s not a budget, that\'s a bonfire. You have more month than money.' : 'leaving almost nothing for future you. Present you is robbing future you daily.'} ${biggest.name} alone is eating ${Math.round(biggest.val / income * 100)}% of your income (₹${fmtN(biggest.val)}).`;
    reality = `Spending ${r.totalPct}% of income with only ${r.investPct}% invested — in 10 years you'll have ₹${fmtN(Math.round(s.invest * 12 * 10 * 1.8))} vs a potential ₹${fmtN(Math.round(income * 0.20 * 12 * 10 * 2.1))} if you rebalanced today. That gap is your lifestyle compounding against you.`;
  } else if (intensity === 'medium') {
    roast   = `${name}, ${r.totalPct}% of income spent — not catastrophic, but not winning either. ${biggest.name} at ₹${fmtN(biggest.val)} (${Math.round(biggest.val / income * 100)}% of income) is the main leak. Middle-of-the-road budgeting = middle-of-the-road results.`;
    reality = `Saving ${r.investPct}% — ${r.investPct < 10 ? 'below the bare minimum. Most experts recommend 20%+.' : 'okay, but 25% is achievable with small cuts.'} The gap between ${r.investPct}% and 25% savings rate compounds to lakhs over 10 years.`;
  } else {
    roast   = `${name}, spending only ${r.totalPct}% of income — actually solid! ${biggest.name} is your biggest category at ${Math.round(biggest.val / income * 100)}% of income. ${r.investPct < 10 ? 'But you\'re barely investing — fix that and you\'re genuinely doing great.' : 'Keep this discipline going.'}`;
    reality = `You have ₹${fmtN(r.leftover)} left after spending and saving. The question is: what's happening to that money? Idle cash loses ~6% per year to inflation silently.`;
  }

  const fixes = [];
  if (rentDominates)      fixes.push(`Rent is ${r.rentPct}% of income (rule: ≤30%) — explore a flatmate, negotiate, or relocate`);
  if (r.foodPct > 15)     fixes.push(`Food at ${r.foodPct}% of income — cook 3 days a week and save ~₹${fmtN(Math.round(s.food * 0.3))}/month instantly`);
  if (r.shopPct > 10)     fixes.push(`Shopping ₹${fmtN(s.shop)} — enforce a 48-hour rule before any purchase`);
  if (r.miscPct > 8)      fixes.push(`Misc ₹${fmtN(s.misc)} (${r.miscPct}% of income) — cap it at ₹${fmtN(Math.round(income * 0.04))}/month`);
  if (r.investPct < 15)   fixes.push(`Only investing ${r.investPct}% — bump SIP to ₹${fmtN(Math.round(income * 0.20))} (20% of income)`);
  if (r.entPct > 10)      fixes.push(`Entertainment ${r.entPct}% of income — one fewer outing/month saves ₹${fmtN(Math.round(s.ent * 0.35))}`);
  if (fixes.length < 3)   fixes.push('Automate savings transfer on salary day before you can spend it');
  if (fixes.length < 3)   fixes.push('Track daily spend for 1 week in Tracker tab — awareness alone cuts spending ~15%');

  const win =
    r.investPct >= 20 ? `${r.investPct}% savings rate — top tier. Compounding is working for you right now.`
  : r.investPct >= 10 ? `${r.investPct}% invested is a real start. Push to 20% and you'll feel the difference in 2 years.`
  : r.totalPct < 50   ? `Spending only ${r.totalPct}% of income — the discipline is there. Now redirect the idle cash.`
  : 'You tracked your spending and that alone puts you ahead of 70% of people. Now act on it.';

  return { roast, reality, fixes: fixes.slice(0, 4), win, mode: intensity === 'high' ? 'fire' : 'neutral' };
}

// ─── helper used inside roastEngine (in case fmt() isn't available here) ───
function fmtN(n) {
  if (!n && n !== 0) return '0';
  return '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN');
}

// ─── FORMAT ROAST ─────────────────────────────────────────
function formatRoast(obj) {
  if (typeof obj === 'string') {
    return `<div class="roast-section roast-fire"><div class="rs-label">The Roast</div><div class="rs-body">${obj.replace(/\n/g, '<br>')}</div></div>`;
  }
  const bullets   = (obj.fixes || []).map(f => `<div class="roast-bullet">${f}</div>`).join('');
  const fireClass = obj.mode === 'baller' ? 'roast-calm' : obj.mode === 'win' ? 'roast-win' : 'roast-fire';
  return `
    <div class="roast-section ${fireClass}"><div class="rs-label">🔥 The Roast</div><div class="rs-body">${obj.roast}</div></div>
    ${obj.reality ? `<div class="roast-section roast-reality"><div class="rs-label">😬 Reality Check</div><div class="rs-body">${obj.reality}</div></div>` : ''}
    <div class="roast-section roast-fix"><div class="rs-label">✅ The Fix</div>${bullets}</div>
    <div class="roast-section roast-win"><div class="rs-label">🏆 Win This Month</div><div class="rs-body">${obj.win}</div></div>`;
}

// ─── UI HELPERS ───────────────────────────────────────────
function showLoading(el) { el.innerHTML = '<div class="loading-row"><span class="spinner"></span> Thinking...</div>'; }
function calcCorpus(monthly, saved, years, rate = 0.12) {
  if (years <= 0) return saved || 0;
  const rm = rate / 12, nm = years * 12;
  return monthly * (((1 + rm) ** nm - 1) / rm) * (1 + rm) + (saved || 0) * ((1 + rate) ** years);
}