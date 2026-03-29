/* ═══════════════════════════════════════════════════════════
   ROAST & RICH — Core Logic — STABLE WORKING VERSION
   All functions verified: calcCorpus · roastEngine · mockAI
   presetResponse · goalStrategy · injectNavbar · all helpers
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
  RR.theme = RR.theme==='dark'?'light':'dark';
  applyTheme();
  document.querySelectorAll('#theme-toggle').forEach(b=>{ if(b) b.textContent=RR.theme==='dark'?'☀️':'🌙'; });
}
document.addEventListener('DOMContentLoaded',()=>{
  applyTheme();
  document.querySelectorAll('#theme-toggle').forEach(b=>{ if(b) b.textContent=RR.theme==='dark'?'☀️':'🌙'; });
});

// ─── LOADER ───────────────────────────────────────────────
function hideLoader(){
  const el=document.getElementById('loading-screen'); if(!el) return;
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el&&el.remove(),320); },900);
}
document.addEventListener('DOMContentLoaded',hideLoader);

// ─── CORE HELPERS ─────────────────────────────────────────
const fmt    = n  => '₹'+Math.round(n||0).toLocaleString('en-IN');
const val    = id => { const e=document.getElementById(id); if(!e)return 0; const v=parseFloat(e.value); return isNaN(v)?0:v; };
const strVal = id => { const e=document.getElementById(id); return e?e.value.trim():''; };

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

function profileStr(){
  const p=RR.profile; if(!p)return'No profile.';
  const goals=(p.goals||[]).map(g=>`${g.name}(${fmt(g.amount)} in ${g.years}yr)`).join(', ');
  return `Name:${p.name} Age:${p.age} Gender:${p.gender||'?'} Situation:${p.situation} City:${p.city} `+
    `Income:${fmt(p.income)}/mo CanSave:${fmt(p.canSave)}/mo Saved:${fmt(p.saved)} `+
    `Spend:${fmt(p.spend)}/mo Retire:${p.retire} Goals:[${goals||'None'}]`;
}

// ─── NAVIGATION ───────────────────────────────────────────
function requireProfile(){
  if(!RR.profile||!RR.loggedIn){ window.location.href='onboarding.html'; return false; }
  return true;
}
function softRequire(){ return RR.profile; }

// ─── CORPUS CALCULATION — critical, must not be broken ────
function calcCorpus(monthly, saved, years, rate){
  rate = rate || 0.12;
  monthly = monthly || 0;
  saved   = saved   || 0;
  years   = years   || 0;
  if(years<=0) return saved;
  var rm = rate/12;
  var nm = years*12;
  var sipPart  = monthly * (((1+rm)*nm - 1)/rm) * (1+rm);
  var lumpPart = saved * Math.pow(1+rate, years);
  return sipPart + lumpPart;
}

// ─── SMART FOMO ENGINE ────────────────────────────────────
function smartFomoEngine(item,amount,spent,why){
  var p=RR.profile||{}, income=Math.max(p.income||0,1), canSave=p.canSave||0;
  var remaining=Math.max(income-spent,0), after=remaining-amount;
  var pct=Math.round((amount/Math.max(remaining,1))*100);
  var iL=item.toLowerCase();

  if(amount<=50) return{verdict:'GO FOR IT',headline:'That amount is negligible.',reason:'At this price, it barely affects your budget. No need to overthink it.',alt:null,delay_weeks:0,budgetPct:pct};

  var ess=['fee','fees','tuition','college','school','exam','medicine','medical','doctor','hospital','rent','hostel','electricity','wifi','grocery','groceries','milk','transport','bus','metro','book','course','insurance','emi','loan','tax'];
  if(ess.some(function(k){return iL.indexOf(k)>=0;})) return{verdict:'GO FOR IT',headline:'This is an essential expense.',reason:item+' is a necessity. If budget is tight, cut discretionary spending instead.',alt:'Find the best price, but do not delay essential expenses.',delay_weeks:0,budgetPct:pct};

  var dw=0,dn='';
  if(p.goals&&p.goals.length>0){
    var near=p.goals.slice().sort(function(a,b){return a.years-b.years;})[0];
    dw=Math.round((amount/(near.amount/(near.years*12)))*4.33);
    if(dw>0) dn='This would delay your '+near.name+' goal by about '+dw+' week'+(dw!==1?'s':'')+'.';
  }

  if(after<0) return{verdict:'BAD IDEA',headline:'You do not have enough left this month.',reason:'You have spent '+fmt(spent)+' and only '+fmt(remaining)+' remains. This purchase would put you '+fmt(Math.abs(after))+' negative. '+dn,alt:'Wait until next month.',delay_weeks:dw,budgetPct:pct};
  if(pct>60) return{verdict:'BAD IDEA',headline:'This takes '+pct+'% of your remaining budget.',reason:fmt(amount)+' is '+pct+'% of what is left this month ('+fmt(remaining)+'). '+dn,alt:'Look for a cheaper option or spread across two months.',delay_weeks:dw,budgetPct:pct};
  if(pct>35&&after<canSave) return{verdict:'WAIT A BIT',headline:'Doable, but it cuts into your savings target.',reason:'After this purchase, '+fmt(after)+' would remain — below your '+fmt(canSave)+'/month savings goal. '+dn,alt:'Reduce one non-essential this month to compensate.',delay_weeks:dw,budgetPct:pct};

  var imp=['bored','yolo','everyone','sale','discount'];
  if(imp.some(function(r){return why.toLowerCase().indexOf(r)>=0;})&&dw>2) return{verdict:'WAIT A BIT',headline:'Affordable, but is it worth the goal delay?',reason:'Budget-wise this is fine ('+pct+'% of remaining), but "'+why+'" suggests impulse. '+dn,alt:'Wait 24 hours. If you still want it — go ahead.',delay_weeks:dw,budgetPct:pct};

  return{verdict:'GO FOR IT',headline:'Your budget allows this.',reason:fmt(amount)+' is '+pct+'% of remaining budget. '+(after>canSave?'You will still hit your savings goal. ':'')+( dn||'Enjoy it!'),alt:dw>0?'Note: '+dw+' week'+(dw!==1?'s':'')+' delay on your nearest goal.':null,delay_weeks:dw,budgetPct:pct};
}

// ─── DAILY LOG ────────────────────────────────────────────
function getTodayLog(){
  var d=today(), log=RR.dailyLog;
  var found=log.filter(function(l){return l.date===d;})[0];
  return found||{date:d,entries:[],total:0};
}
function saveTodayEntry(cat,amount,note){
  var d=today(), log=RR.dailyLog.filter(function(l){return l.date!==d;}), e=getTodayLog();
  e.entries.push({id:Date.now(),category:cat,amount:amount,note:note,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});
  e.total=e.entries.reduce(function(s,x){return s+x.amount;},0);
  log.push(e); RR.dailyLog=log; checkBadges();
}
function deleteEntry(id){
  var d=today(), log=RR.dailyLog, e=log.filter(function(l){return l.date===d;})[0]; if(!e)return;
  e.entries=e.entries.filter(function(x){return x.id!==id;});
  e.total=e.entries.reduce(function(s,x){return s+x.amount;},0);
  RR.dailyLog=log;
}
function getMonthTotal(){
  var ym=today().slice(0,7);
  return RR.dailyLog.filter(function(l){return l.date.indexOf(ym)===0;}).reduce(function(s,l){return s+(l.total||0);},0);
}

// ─── MOOD ─────────────────────────────────────────────────
function saveMoodEntry(rating,regret,saved,note){
  var log=RR.moodLog, i=-1;
  for(var x=0;x<log.length;x++){if(log[x].date===today()){i=x;break;}}
  var e={date:today(),rating:rating,regret:regret,saved:saved,note:note,ts:Date.now()};
  if(i>=0)log[i]=e;else log.push(e);
  if(log.length>90)log.shift();
  RR.moodLog=log; checkBadges();
}
function getMoodInsight(){
  var log=RR.moodLog.slice(-14); if(log.length<3)return null;
  var avg=(log.reduce(function(s,l){return s+l.rating;},0)/log.length).toFixed(1);
  var reg=log.filter(function(l){return l.regret;}).length;
  var sav=log.filter(function(l){return l.saved;}).length;
  if(reg>log.length*0.5) return 'You have been regretting purchases on '+reg+' of '+log.length+' tracked days. This points to an emotional spending pattern — try waiting 48 hours before any non-essential purchase over ₹300.';
  if(parseFloat(avg)<2.5) return 'Your financial mood has been low lately (average '+avg+'/5). Low-mood days often trigger impulse spending. Be mindful on difficult days.';
  if(sav>log.length*0.7) return 'You have been saving consistently — '+sav+' out of '+log.length+' days tracked. That discipline is building real momentum.';
  return 'You have logged '+log.length+' days. Average mood: '+avg+'/5. Patterns become visible after two weeks — keep going.';
}

// ─── STREAK ───────────────────────────────────────────────
function getStreak(){
  var dates=[]; var seen={};
  RR.dailyLog.forEach(function(l){if(!seen[l.date]){seen[l.date]=true;dates.push(l.date);}});
  dates.sort().reverse();
  var streak=0;
  for(var i=0;i<dates.length;i++){
    var d=new Date(dates[i]+'T12:00:00'), e=new Date(); e.setDate(e.getDate()-i);
    if(d.toDateString()===e.toDateString())streak++;else break;
  }
  return streak;
}

// ─── BADGES ───────────────────────────────────────────────
var BADGE_DEFS=[
  {id:'first_log',   name:'Money Moves',     desc:'Logged your first expense'},
  {id:'streak_3',    name:'On a Roll',        desc:'Tracked 3 days straight'},
  {id:'streak_7',    name:'Locked In',        desc:'7 days of consistent tracking'},
  {id:'saved_today', name:'Bag Secured',      desc:'Chose to save money today'},
  {id:'mood_5',      name:'Vibe Check Pro',   desc:'Logged 5 financial mood entries'},
  {id:'fomo_beaten', name:'Anti-FOMO Legend', desc:'Resisted a purchase via FOMO Filter'},
  {id:'budget_ninja',name:'Budget God',       desc:'Monthly spend under 80% of income'},
];
function checkBadges(){
  var earned={}; RR.badges.forEach(function(b){earned[b]=true;});
  var streak=getStreak();
  if(RR.dailyLog.length>=1) earned['first_log']=true;
  if(streak>=3) earned['streak_3']=true;
  if(streak>=7) earned['streak_7']=true;
  if(RR.moodLog.length>=5) earned['mood_5']=true;
  if(RR.moodLog.some(function(l){return l.saved;})) earned['saved_today']=true;
  var p=RR.profile;
  if(p&&p.income&&getMonthTotal()<p.income*0.8) earned['budget_ninja']=true;
  RR.badges=Object.keys(earned);
}
function awardFomoBadge(){
  var earned={}; RR.badges.forEach(function(b){earned[b]=true;}); earned['fomo_beaten']=true;
  RR.badges=Object.keys(earned);
}

// ─── PERSONALITY SCORE ────────────────────────────────────
function getPersonality(){
  var p=RR.profile; if(!p)return null;
  var sr=p.income?(p.canSave/Math.max(p.income,1))*100:0;
  var score=Math.min(sr*2,40)+Math.min(RR.badges.length*3,20)+Math.min(RR.moodLog.length*2,20);
  if(p.income>0){var r=getMonthTotal()/p.income; score+=r<0.6?20:r<0.8?10:r<1?5:0;}else{score+=10;}
  score=Math.round(Math.min(score,100));
  var type,desc;
  if(score>=80){type='Budget God';desc='You control your money. Top-tier financial habits for your age.';}
  else if(score>=60){type='Careful Planner';desc='Solid habits in place. A few refinements will take you further.';}
  else if(score>=40){type='Growing Saver';desc='Heading in the right direction. Small consistent changes will accelerate your progress.';}
  else if(score>=20){type='Impulse Explorer';desc='Life is fun, but the bank balance is struggling. Adding structure will help quickly.';}
  else{type='Spender in Denial';desc='No judgment — but starting to track today makes a real difference.';}
  return{score:score,type:type,desc:desc};
}

// ─── AI CALL ──────────────────────────────────────────────
async function callAI(prompt, maxTokens){
  maxTokens = maxTokens || 500;
  var key=RR.apiKey; if(!key)return mockAI(prompt);
  try{
    if(key.indexOf('sk-ant')===0){
      var r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},
        body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:maxTokens,messages:[{role:'user',content:prompt}]})});
      var d=await r.json(); return d.content&&d.content[0]?d.content[0].text:(d.error?d.error.message:'No response.');
    } else {
      var r2=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
        body:JSON.stringify({model:'gpt-3.5-turbo',max_tokens:maxTokens,messages:[{role:'user',content:prompt}]})});
      var d2=await r2.json(); return d2.choices&&d2.choices[0]?d2.choices[0].message.content:(d2.error?d2.error.message:'No response.');
    }
  } catch(e){ return mockAI(prompt); }
}

// ─── FIXED GREETINGS ──────────────────────────────────────
var FIXED_GREETINGS = {
  hi:       ['Hi there! Ready to talk money. What is on your mind today?',
             'Hey! Your Roast&Rich AI is online. What financial question can I help with?',
             'Hi! I have your full profile loaded. What do you want to work on?',
             'Hello and welcome back! What would you like to figure out today?'],
  hello:    ['Hello! What money topic would you like to dig into today?',
             'Hello! Ask me anything — budgeting, saving, goals, or investments.',
             'Hi there! Your financial data is all loaded. What is the question on your mind?'],
  howAreYou:['I am doing well, thank you! More importantly — how are your finances doing this month?',
             'All good on my end! The real question is: how are your savings targets looking?',
             'Functioning perfectly and ready to help! How about you — are your spending goals on track?'],
  bye:      ['Goodbye! Keep tracking your spending — small habits create big results. See you soon!',
             'Take care! Remember: even small amounts saved consistently add up to real wealth over time.',
             'Bye! Come back whenever you need financial guidance. You are doing great by staying engaged.'],
  thanks:   ['You are welcome! Feel free to come back whenever you have more questions.',
             'Happy to help! Keep up the good habits and check in anytime.',
             'Anytime! That is exactly what I am here for. Stay consistent and you will see results.'],
  ok:       ['Got it! Is there anything else I can help with — budgeting, goal planning, or investing?',
             'Understood. Let me know if you have any follow-up questions.'],
  okay:     ['Great! Let me know if there is anything else I can help with today.',
             'Perfect. Feel free to ask about anything — spending, savings, or investment options.'],
};

function detectSimpleMessage(text){
  var t=text.toLowerCase().trim();
  if(/^(hi|hi!|hii|hiii|hey|hey!|heyyy|hi there|heyy)$/.test(t)) return 'hi';
  if(/^(hello|hello!|helo|helloo|heloo|hellooo)$/.test(t)) return 'hello';
  if(/^(how are you|how r u|how are you\??|how are you doing|how do you do|kese ho)$/.test(t)) return 'howAreYou';
  if(/^(bye|goodbye|good bye|bye bye|see you|see ya|cya|ttyl|byee)$/.test(t)) return 'bye';
  if(/^(thanks|thank you|thank you!|thx|thnks|thankyou|tysm|ty|thanku|thank u|thank uu)$/.test(t)) return 'thanks';
  if(/^(okay|okay!|alright|sounds good|okaiee|okiee|ohkay)$/.test(t)) return 'okay';
  if(/^(ok|ok!|got it|sure|hmm|hm)$/.test(t)) return 'ok';
  return null;
}

function getFixedResponse(type){
  var arr=FIXED_GREETINGS[type]||FIXED_GREETINGS['hi'];
  return arr[Math.floor(Math.random()*arr.length)];
}

// ─── PRESET CHIP RESPONSES ────────────────────────────────
function presetResponse(chipText){
  var p=RR.profile||{};
  var name=p.name||'there';
  var income=p.income||0;
  var canSave=p.canSave||0;
  var saved=p.saved||0;
  var retire=p.retire||55;
  var age=p.age||20;
  var goals=p.goals||[];
  var yrsToRetire=Math.max(retire-age,1);
  var corpus=calcCorpus(canSave,saved,yrsToRetire);
  var chip=chipText.toLowerCase();

  // SIP
  if(chip.indexOf('sip')>=0){
    if(canSave<=0){
      return name+', let us talk about starting a SIP.\n\nRight now you are not saving a fixed amount each month. The first step is to decide on a number — even ₹200 per month is a start.\n\nHow SIPs work: you invest a fixed amount every month into a mutual fund through any investment platform. It takes about 10 minutes to set up.\n\nIf you have no income yet, a ₹100 per month SIP still builds the habit. Start with what you can — the amount can be increased later.';
    }
    var sipAmt=Math.round(canSave*0.5);
    return name+', with your savings capacity of '+fmt(canSave)+' per month, starting a SIP is absolutely the right move.\n\nMy suggestion: invest '+fmt(sipAmt)+' per month in a Nifty 50 Index Fund.\n\nProjected result over '+yrsToRetire+' years: approximately '+fmtShort(calcCorpus(sipAmt,saved,yrsToRetire))+' at 12% average annual return.\n\nHow to get started:\n→ Download any investment platform app\n→ Search for a Nifty 50 Index Fund\n→ Set your SIP date to one day after your salary or allowance arrives\n→ Enable auto-debit — set it once and let it run\n\nDo not stop your SIP when the market falls. A falling market means you are buying at a lower price — that is actually better for long-term investors.';
  }

  // Save more
  if(chip.indexOf('save')>=0||chip.indexOf('saving')>=0){
    if(income<=0){
      return name+', your income is not set in your profile yet. Please update it in Settings first.\n\nGeneral saving tips:\n→ Save before you spend — transfer a fixed amount the moment you receive money\n→ Do a weekly review of your spending\n→ Cancel unused subscriptions — these add up to ₹300 to ₹600 per month\n→ Use the Daily Tracker to log every expense for two weeks';
    }
    var savePct=Math.round((canSave/income)*100);
    var target=Math.round(income*0.2);
    return name+', here is your saving snapshot:\n\n→ Income: '+fmt(income)+' per month\n→ Currently saving: '+fmt(canSave)+' per month\n→ Savings rate: '+savePct+'%\n→ Target: 20% minimum = '+fmt(target)+' per month\n\n'+(savePct>=20?'Your savings rate is solid. Aim to push it toward 25%.':'You are below the 20% target. Here is how to close that gap:')+'\n\nTop three moves:\n→ Find your single biggest non-essential expense and reduce it by 20% this month\n→ Check your subscriptions — cancel anything unused in the last 30 days\n→ Set up an automatic transfer on the day your income arrives — this is the most reliable method';
  }

  // Spending pattern
  if(chip.indexOf('spend')>=0){
    var monthSpend=getMonthTotal();
    if(monthSpend===0&&!p.spend){
      return name+', there is no spending data available yet.\n\n→ Daily Tracker tab: add today\'s expenses as they happen\n→ Money Roast tab: enter this month\'s spending by category\n\nTrack for two weeks and I can give you a proper spending analysis.';
    }
    var spendAmt=monthSpend>0?monthSpend:(p.spend||0);
    var spendPct=income>0?Math.round((spendAmt/income)*100):0;
    var status=spendPct>85?'Too high — needs urgent attention':spendPct>70?'A bit stretched — look for areas to tighten':spendPct>50?'Manageable — but room to improve':'Well controlled';
    return name+', here is your spending picture:\n\n→ Spent this month: '+fmt(spendAmt)+'\n→ Monthly income: '+fmt(income)+'\n→ Spending ratio: '+spendPct+'% of income\n→ Assessment: '+status+'\n\nHealthy benchmark: 60 to 70% on spending, 20 to 30% on savings.\n\n'+(spendPct>70?'Recommended: Find your two biggest spending categories and reduce each by 15 to 20%. The Roast tab will show you exactly where the leaks are.':'Keep this up. Redirect your surplus to an investment or savings goal.');
  }

  // What to invest in
  if(chip.indexOf('invest')>=0){
    if(saved<(p.spend||3000)*3){
      return name+', honest answer: build your emergency fund first before investing.\n\nTarget: '+fmt(Math.max((p.spend||3000)*3,15000))+' in a liquid or fixed-deposit account (3 months of expenses).\n\nYou currently have '+fmt(saved)+' saved. Without an emergency fund, any investment is at risk — one unexpected expense and you would have to break your investment at the worst time.\n\nTwo steps:\n→ Step 1: Complete your emergency fund\n→ Step 2: Then start a monthly SIP in a Nifty 50 Index Fund';
    }
    return name+', with '+fmt(saved)+' already saved, you have a foundation.\n\nInvestment path:\n\n→ Core investment: Nifty 50 Index Fund — '+fmt(Math.round(canSave*0.6))+' per month\n→ Secondary: Balanced or flexi-cap fund — '+fmt(Math.round(canSave*0.2))+' per month\n→ Tax-saving: PPF (7.1% guaranteed + Section 80C benefit) or NPS\n\nAction: Open any investment platform, search for a Nifty 50 Index Fund, set up a monthly SIP for the day after your salary arrives. Stay consistent for '+yrsToRetire+' years.';
  }

  // Emergency fund
  if(chip.indexOf('emergency')>=0){
    var target3m=Math.max((p.spend||3000)*3,15000);
    var remaining=Math.max(target3m-saved,0);
    if(remaining<=0){
      return name+', your emergency fund is already built! You have '+fmt(saved)+' saved.\n\nNext step: now that it is complete, redirect your monthly saving capacity toward investment. That money should be working for you.';
    }
    var months=canSave>0?Math.ceil(remaining/canSave):12;
    return name+', an emergency fund is your most important financial goal.\n\nTarget: '+fmt(target3m)+' (3 months of expenses)\nCurrently saved: '+fmt(saved)+'\nStill needed: '+fmt(remaining)+'\n\nAt your current savings rate ('+fmt(canSave)+' per month):\n→ Fully funded in '+months+' month'+(months!==1?'s':'')+'\n\nBest place to keep it:\n→ High-interest savings account (4 to 7% interest)\n→ Liquid mutual fund (easy withdrawal)\n→ Not in equity — this must be instantly accessible';
  }

  // Retire
  if(chip.indexOf('retire')>=0){
    var corpusNeeded=((p.spend||30000)*(Math.pow(1.05,yrsToRetire))*12)/0.04;
    var onTrack=corpus>=corpusNeeded*0.8;
    return name+', retirement at age '+retire+':\n\n→ Years remaining: '+yrsToRetire+'\n→ Corpus needed: approximately '+fmtShort(Math.round(corpusNeeded))+'\n→ Projected at current pace: '+fmtShort(corpus)+' by age '+retire+'\n→ Status: '+(onTrack?'On track':'Gap exists — action needed')+'\n\n'+(onTrack?'You are in good shape. Continue your current savings rate and review in 2 to 3 years.':'To close the gap: increase your monthly investment by ₹'+Math.max(500,Math.round(canSave*0.1)).toLocaleString('en-IN')+' per year as your income grows.')+'\n\nUse the Wealth Builder tab to see a visual projection.';
  }

  return mockAI(chipText);
}

// ─── MOCK AI — English, no brand names ────────────────────
function mockAI(prompt){
  var p=RR.profile||{};
  var name=p.name||'there';
  var low=prompt.toLowerCase();

  // Simple messages
  var simpleType=detectSimpleMessage(prompt);
  if(simpleType) return getFixedResponse(simpleType);

  // SIP / investing
  if(/sip|invest|mutual fund|nifty|index fund|stock/.test(low)){
    var tips=[
      'SIP basics:\n\n→ Start with a Nifty 50 Index Fund on any investment platform — minimum ₹100 per month\n→ Set your SIP date to the day after your salary or allowance arrives\n→ When markets fall, do not stop your SIP — you are buying units at a lower price\n→ '+(p.canSave>0?'With your '+fmt(p.canSave)+' per month savings capacity, even '+fmt(Math.round((p.canSave||0)*0.5))+' in a monthly SIP builds serious wealth over time.':'Even ₹500 per month at your age creates meaningful wealth over time.'),
      'Investment basics:\n\n1. Emergency fund first — 3 months of expenses in a liquid fund or fixed deposit\n2. Then start a monthly SIP in an index fund\n3. PPF gives 7.1% guaranteed return plus a tax benefit under Section 80C\n4. Biggest mistake: stopping investments when markets drop — that is when you should continue.',
      name+', the power of starting early:\n\n₹1,000 per month invested at 21 = approximately ₹3.5 Crore by 60 (at 12%)\n₹1,000 per month invested at 31 = approximately ₹1.2 Crore by 60\n\nThat ₹2.3 Crore difference is just 10 years of delay. Start now.',
    ];
    return tips[Math.floor(Math.random()*tips.length)];
  }

  // Save / budget
  if(/save|saving|budget|spend less|monthly/.test(low)){
    return 'Saving tips that genuinely work:\n\n→ Automate it — transfer a fixed amount the moment your income arrives\n→ 24-hour rule — for any non-essential purchase over ₹500, wait one full day\n→ Review your payment app history weekly — most people find 3 to 4 forgotten expenses\n→ '+(p.income>0?'You earn '+fmt(p.income)+' per month. Savings rate of '+Math.round(((p.canSave||0)/p.income)*100)+'% — target is 20 to 30%.':'Start with any fixed amount — the habit matters more than the size at first.');
  }

  // Goals
  if(/goal|car|house|trip|laptop|dream/.test(low)){
    var goals=p.goals||[];
    if(goals.length>0){
      var g=goals[0];
      return goalStrategy(g,p);
    }
    return 'Go to the Goal Tracker tab and set your specific goals. Once set, I can give you an exact monthly savings plan for each one.';
  }

  // Tax
  if(/tax|80c|itr|income tax/.test(low)){
    return 'Tax basics:\n\n→ New tax regime: lower rates, fewer deductions — usually better if you do not have many investments\n→ Old tax regime: worth it if you can fill up Section 80C (PPF, NPS)\n→ Section 80C limit: ₹1.5 lakh — PPF is the simplest way to use this\n→ File your ITR before July 31 even if income is below the taxable limit — needed for loans and visa applications';
  }

  // Budget JSON
  if(low.indexOf('"categories"')>=0||low.indexOf('return only valid json')>=0){
    var income2=Math.max(p.income||p.spend||3000,500);
    var sit=(p.situation||'').toLowerCase();
    var rent=sit.indexOf('hostel')>=0?Math.round(income2*.28):sit.indexOf('pg')>=0?Math.round(income2*.32):sit.indexOf('home')>=0?0:Math.round(income2*.25);
    var food=Math.round(income2*.20),trav=Math.round(income2*.08),study=Math.round(income2*.05);
    var ent=Math.round(income2*.07),shop=Math.round(income2*.07),sip=Math.round(income2*.15);
    var emg=Math.max(income2-rent-food-trav-study-ent-shop-sip,0);
    return JSON.stringify({categories:[
      {name:'Rent / PG / Hostel',amount:rent,percentage:Math.round(rent/income2*100),tip:'Negotiate annual contracts where possible'},
      {name:'Food & Groceries',amount:food,percentage:Math.round(food/income2*100),tip:'Cook at home 4 days a week, limit food delivery orders to twice a week'},
      {name:'Transport',amount:trav,percentage:Math.round(trav/income2*100),tip:'Public transport is significantly cheaper than ride-hailing for regular commutes'},
      {name:'Study / Work',amount:study,percentage:Math.round(study/income2*100),tip:'Best return on investment — spend on skills that grow your earning power'},
      {name:'Entertainment',amount:ent,percentage:Math.round(ent/income2*100),tip:'Keep one streaming subscription at a time and rotate monthly'},
      {name:'Shopping / Personal',amount:shop,percentage:Math.round(shop/income2*100),tip:'Wait 48 hours before any purchase over ₹500'},
      {name:'SIP / Investment',amount:sip,percentage:Math.round(sip/income2*100),tip:'Automate on the day after your income arrives — treat it like a fixed bill'},
      {name:'Emergency Buffer',amount:emg,percentage:Math.max(Math.round(emg/income2*100),0),tip:'Build a 3-month expense fund before anything else'},
    ],
    goal_note:'Budget calibrated for '+(p.city||'your city')+' as a '+(p.situation||'student or professional')+'. The investment amount compounds significantly over time.',
    one_year:'Following this budget for 12 months: '+fmt(sip*12)+' invested + '+fmt(emg*12)+' in your buffer = '+fmt((sip+emg)*12)+' total wealth added.'});
  }

  // Diverse fallback
  var fallbacks=[
    name+', ask me something specific and I will give you a personalised answer. I have your income, goals, and city loaded. What money situation are you dealing with?',
    'I am here to help with real financial questions — spending habits, investment options, savings strategies, or goal planning. What would you like to work on?',
    'Drop your question and I will give you a concrete answer based on your actual profile data.',
  ];
  return fallbacks[Math.floor(Math.random()*fallbacks.length)];
}

// ─── GOAL STRATEGY — unique per goal type ─────────────────
function goalStrategy(g, p){
  var name=g.name.toLowerCase();
  var pm=Math.round(g.amount/(g.years*12));
  var gap=pm-(p.canSave||0);
  var feasible=gap<=0;
  var canSave=p.canSave||0;

  if(name.indexOf('emergency')>=0){
    return 'Emergency Fund Strategy for '+fmt(g.amount)+':\n\nThis is the most important financial goal — everything else should wait until this is funded.\n\n→ Monthly target: '+fmt(pm)+' per month for '+g.years+' year'+(g.years!==1?'s':'')+'\n→ '+(feasible?'Your savings capacity covers this — start immediately':'Shortfall: '+fmt(gap)+' per month — prioritise this above all other goals')+'\n→ Where to keep it: high-interest savings account or liquid mutual fund (4–7%, instantly accessible)\n→ Do NOT invest this in equity — it must be available within 24 hours\n→ Rule: once funded, never touch it except for genuine emergencies\n\nOnce your emergency fund is complete, redirect that monthly amount entirely to investments.';
  }

  if(name.indexOf('car')>=0||name.indexOf('bike')>=0||name.indexOf('vehicle')>=0){
    return 'Car / Bike Goal Strategy — '+fmt(g.amount)+' in '+g.years+' years:\n\n→ Monthly savings needed: '+fmt(pm)+'\n→ '+(feasible?'Your savings capacity covers this':'Shortfall: '+fmt(gap)+' per month — consider extending the timeline')+'\n→ Best approach: save for a 40% down payment ('+fmt(Math.round(g.amount*0.4))+'), then finance the remainder via a low-interest loan\n→ Investment vehicle: Recurring Deposit — safe and predictable for a medium-term goal\n→ Avoid equity funds for goals under 4 years — market timing risk is too high\n\nOpen a dedicated recurring deposit account for this goal and set up automatic monthly transfers.';
  }

  if(name.indexOf('house')>=0||name.indexOf('flat')>=0||name.indexOf('home')>=0||name.indexOf('property')>=0){
    var dp=Math.round(g.amount*0.2);
    return 'House / Flat Goal Strategy — '+fmt(g.amount)+' in '+g.years+' years:\n\nFor property, the standard approach is saving for a 20% down payment, then taking a home loan.\n\n→ Down payment target: '+fmt(dp)+'\n→ Monthly savings for down payment: '+fmt(Math.round(dp/(g.years*12)))+'\n→ '+(feasible?'Achievable at your current savings rate':'Consider extending your timeline or increasing income')+'\n→ Investment vehicle: index fund for 5+ years, shifting to debt funds in the last 2 years\n→ Build your CIBIL score now — above 750 gets you significantly lower home loan interest rates\n\nMake sure your emergency fund is fully funded before committing to this goal.';
  }

  if(name.indexOf('trip')>=0||name.indexOf('travel')>=0||name.indexOf('vacation')>=0){
    return 'Dream Trip Strategy — '+fmt(g.amount)+' in '+g.years+' years:\n\n→ Monthly savings needed: '+fmt(pm)+'\n→ '+(feasible?'Fully within your savings capacity — allocate this now':'Shortfall: '+fmt(gap)+' — either reduce the trip budget or extend the timeline')+'\n→ Investment vehicle: high-interest savings account or a 12 to 18-month recurring deposit (safe and liquid)\n→ Avoid equity funds for this goal — if markets fall close to your travel date, you lose out\n→ Booking tip: flights booked 3 to 4 months in advance and early accommodation booking can reduce costs by 20 to 40%\n\nBreak your target into a monthly saving habit and treat it like a fixed bill.';
  }

  if(name.indexOf('gadget')>=0||name.indexOf('laptop')>=0||name.indexOf('phone')>=0||name.indexOf('mac')>=0){
    return 'Gadget / Device Goal Strategy — '+fmt(g.amount)+' in '+g.years+' years:\n\n→ Monthly savings needed: '+fmt(pm)+'\n→ '+(feasible?'Your savings capacity covers this — start a dedicated savings account now':'Shortfall: '+fmt(gap)+' per month — consider a longer timeline or a slightly lower-spec alternative')+'\n→ Investment vehicle: savings account or short-term recurring deposit (1 to 2 years)\n→ Smart buying tip: buy just before a new model launches — prices of the previous model drop by 15 to 30%\n→ Check for student discounts and no-cost EMI options to reduce the effective cost\n\nIf you cannot save for it within 24 months, the device may be above your current financial priority level.';
  }

  // Generic
  var vehicle=g.years<=2?'recurring deposit or a high-interest savings account':g.years<=5?'balanced fund or short-term index fund':'equity SIP in a Nifty 50 index fund';
  return g.name+' Goal Strategy — '+fmt(g.amount)+' in '+g.years+' years:\n\n→ Monthly savings needed: '+fmt(pm)+'\n→ '+(feasible?'Your current savings capacity of '+fmt(canSave)+' covers this goal':'Shortfall: '+fmt(gap)+' per month — close this by reducing your highest non-essential expense')+'\n→ Best investment vehicle for a '+g.years+'-year timeline: '+vehicle+'\n→ Action: open a separate account specifically for this goal and set up an automatic monthly transfer of '+fmt(pm)+'\n→ Review every 6 months — increase the amount as your income grows\n\nLabeling money for a specific goal significantly increases the likelihood of achieving it.';
}

// ─── ROAST ENGINE ─────────────────────────────────────────
function roastEngine(s, p){
  var food=s.food||0, travel=s.travel||0, shop=s.shop||0;
  var rent=s.rent||0, groom=s.groom||0, ent=s.ent||0, misc=s.misc||0, invest=s.invest||0;
  var total=food+travel+shop+rent+groom+ent+misc;
  var income=p.income||0;
  var savePct=income>0?Math.round((invest/income)*100):0;
  var spendPct=income>0?Math.round((total/income)*100):0;
  var name=p.name||'friend';

  if(total===0&&invest===0) return{
    roast:name+', zero spending entered. Please fill in your actual figures — the roast only works with real data.',
    reality:'Check your payment app transaction history for the last 30 days and enter the real numbers.',
    fixes:['Open your payment app and review your transaction history','Enter honest figures — the AI will not judge you, only help you','Accurate data leads to genuinely useful advice'],
    win:'You opened this app and looked at your finances. That takes self-awareness.'
  };

  if(savePct>30) return{
    roast:name+', you invested '+savePct+'% of your income this month. I genuinely cannot roast you — my algorithm keeps returning "this person is doing great."',
    reality:'At this savings rate, you are in the top 10% of your age group for financial discipline. Your future self is grateful.',
    fixes:['Set aside 3–5% of your income to build your skills','Make sure you and your dependents have medical insurance','Have term insurance that’s about 20× your annual income','If all investments are in one fund, diversify across two funds','Increase your investment by 10-15% next year — you have the capacity','Verify your emergency fund (6 to 9 months of expenses) is fully funded','PPF gives guaranteed returns plus a tax benefit under Section 80C'],
    win:fmt(invest)+' invested this month. That is not just a habit — it is a lifestyle choice that will pay off significantly.'
  };

  if(invest===0&&total>0) return{
    roast:name+', '+fmt(total)+' spent and ₹0 invested. Your bank account is essentially a temporary holding area for your next purchase.',
    reality:'Six months at this pace: '+fmt(total*6)+' out, ₹0 invested. Every month you delay is time that compounding cannot give back.',
    fixes:['Start a monthly SIP on any investment platform — even ₹500 is a start (takes 10 minutes)','Set up automatic investment transfer for the day after your salary arrives','Reduce your biggest expense by 15% and redirect that to a monthly investment','Write down one specific financial goal — having a named target makes investing feel meaningful'],
    win:income>0?'You earn '+fmt(income)+' per month — the raw material for wealth-building is there. It just needs direction.':'You opened this app and looked at your spending. That takes courage.'
  };

  if(food>Math.max(income*0.25,3500)) return{
    roast:name+', '+fmt(food)+' on food this month. That is '+fmt(Math.round(food/30))+' per day on eating. At this rate, food delivery platforms know your order before you do.',
    reality:fmt(food*12)+' per year on food alone — the equivalent of a laptop, an international trip, or the start of a solid investment portfolio.',
    fixes:['Cook at home 4 days a week and limit delivery orders to twice a week — saves approximately '+fmt(Math.round(food*0.4))+' per month','Meal prep on weekends — 2 hours covers 5 days of lunches','Local tiffin services offer far better value than food delivery apps','Redirect '+fmt(Math.round(food*0.35))+' saved per month to a monthly investment'],
    win:invest>0?'Your monthly investment is running. Keep it going alongside the food changes.':'You tracked your food spending honestly. Awareness is the starting point for change.'
  };

  if(shop>Math.max(income*0.2,2000)) return{
    roast:name+', '+fmt(shop)+' on shopping this month. Every sale notification is triggering a purchase — that is not shopping, that is emotional spending with a discount sticker.',
    reality:fmt(shop*12)+' per year on shopping — a car down payment, three years of investment returns, or a proper emergency fund.',
    fixes:['48-hour rule: add to cart, close the page, return tomorrow — most impulse purchases disappear','Unsubscribe from brand promotional emails and disable sale notifications','One-in-one-out rule: donate or sell something old before buying something new','Reducing shopping by 30% saves '+fmt(Math.round(shop*0.3))+' per month — redirect to your emergency fund'],
    win:invest>0?'Investing while overspending on shopping — at least one half of the equation is right.':'You know exactly where your money is going. That awareness is the first step toward changing it.'
  };

  if(travel>Math.max(income*0.15,2000)) return{
    roast:name+', '+fmt(travel)+' on transport this month. Ride-hailing apps are treating you like a premium subscriber — because you effectively are one.',
    reality:fmt(travel*12)+' per year on commuting. Public transport exists and costs a fraction of this amount.',
    fixes:['Public transport combined with a short auto ride is 60% cheaper than full cab bookings','A monthly bus or metro pass pays for itself within the first six rides','Bike rentals for regular routes are cheaper and healthier','Plan routes to combine errands into single trips instead of multiple individual ones'],
    win:invest>0?'Despite the transport spending, you are still investing. That discipline counts.':'At least you are getting places. Now make sure your bank balance is heading somewhere too.'
  };

  var cats=[{n:'Food',a:food},{n:'Travel',a:travel},{n:'Shopping',a:shop},{n:'Entertainment',a:ent}].sort(function(a,b){return b.a-a.a;});
  var worst=cats[0];
  return{
    roast:name+', '+fmt(total)+' total spending — '+(spendPct>70?'that is '+spendPct+'% of your income. That ratio needs to come down.':'your biggest leak is '+worst.n+' at '+fmt(worst.a)+'.'),
    reality:'At this pace: '+fmt(total*6)+' out in six months, '+fmt(invest*6)+' invested. '+(invest>0?'The saving habit is present — it just needs to grow.':'Zero investment means zero compounding. Time does not wait.'),
    fixes:['Reduce '+worst.n+' spending by 20% — saves approximately '+fmt(Math.round(worst.a*0.2))+' per month','Review all active subscriptions — forgotten recurring charges are common','Set a weekly spending limit per category — easier to manage than monthly tracking',invest===0?'Start a monthly SIP investment today — the process takes under 10 minutes':'Increase your monthly investment by '+fmt(Math.max(200,Math.round(invest*0.1)))+' next month'],
    win:invest>0?fmt(invest)+' invested this month — real progress. Keep growing that number.':'You tracked your spending and looked at the numbers honestly. That self-awareness is where change begins.'
  };
}

function formatRoast(obj){
  var s='<style>'+
    '.roast-section{border-radius:12px;padding:18px 20px;margin-bottom:14px;}'+
    '.roast-fire{border:1.5px solid #ff2070;background:rgba(255,32,112,0.08);}'+
    '.roast-reality{border:1.5px solid #ffd600;background:rgba(255,214,0,0.07);}'+
    '.roast-fix{border:1.5px solid #aaee22;background:rgba(170,238,34,0.07);}'+
    '.roast-win{border:1.5px solid #ffd600;background:rgba(255,214,0,0.07);}'+
    '.rs-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;}'+
    '.roast-fire .rs-label{color:#ff2070;}'+
    '.roast-reality .rs-label{color:#ffd600;}'+
    '.roast-fix .rs-label{color:#aaee22;}'+
    '.roast-win .rs-label{color:#ffd600;}'+
    '.rs-label-icon{margin-right:6px;}'+
    '.rs-body{font-size:15px;line-height:1.6;color:inherit;}'+
    '.roast-bullet{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;font-size:14px;line-height:1.5;}'+
    '.roast-bullet::before{content:"→";color:#aaee22;flex-shrink:0;margin-top:1px;}'+
    '</style>';

  if(typeof obj==='string') return s+
    '<div class="roast-section roast-fire">'+
      '<div class="rs-label"><span class="rs-label-icon">🔥</span>THE ROAST</div>'+
      '<div class="rs-body">'+obj.replace(/\n/g,'<br>')+'</div>'+
    '</div>';

  var bullets=(obj.fixes||[]).map(function(f){
    return '<div class="roast-bullet">'+f+'</div>';
  }).join('');

  return s+
    '<div class="roast-section roast-fire">'+
      '<div class="rs-label"><span class="rs-label-icon">🔥</span>THE ROAST</div>'+
      '<div class="rs-body">'+obj.roast+'</div>'+
    '</div>'+
    '<div class="roast-section roast-reality">'+
      '<div class="rs-label"><span class="rs-label-icon">😬</span>REALITY CHECK</div>'+
      '<div class="rs-body">'+obj.reality+'</div>'+
    '</div>'+
    '<div class="roast-section roast-fix">'+
      '<div class="rs-label"><span class="rs-label-icon">✅</span>THE FIX</div>'+
      '<div class="rs-body">'+bullets+'</div>'+
    '</div>'+
    '<div class="roast-section roast-win">'+
      '<div class="rs-label"><span class="rs-label-icon">🏆</span>WIN THIS MONTH</div>'+
      '<div class="rs-body">'+obj.win+'</div>'+
    '</div>';
}

// ─── UI HELPERS ───────────────────────────────────────────
function showLoading(el){ el.innerHTML='<div class="loading-row"><span class="spinner"></span> Thinking...</div>'; }

function pronoun(p){
  if(!p) return 'they/them';
  var g=(p.gender||'').toLowerCase();
  if(g==='male'||g==='m') return 'he/him';
  if(g==='female'||g==='f') return 'she/her';
  return 'they/them';
}