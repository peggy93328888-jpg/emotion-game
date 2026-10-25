// 音效系統 (Web Audio API 免依賴音訊檔，純代碼即時合成可愛 8-bit / 動畫音效)
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(130, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playMagic() {
    if (!this.enabled) return;
    this.init();
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + i * 150, this.ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.06 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.15);
    }
  }
}

const sounds = new SoundManager();

// 遊戲狀態與資料
const gameState = {
  eq: 50,
  badges: [],
  currentChapter: 0,
  currentDialogueIdx: 0
};

// 關卡劇本與劇情設定 (擴充至 5 個完整關卡)
const storyData = [
  // 序章：特工集結
  {
    id: 'intro',
    title: '序章：心靈特工登場！',
    bg: 'assets/bg_playground.jpg',
    dialogues: [
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '哈囉！新加入的小特工，歡迎來到陽光國小！我是你的心靈嚮導「波波」✨',
        side: 'left'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '每個人心裡都有情緒精靈。但當遇到挫折、被取笑或被冒犯時，如果不知道怎麼處理，就會被「情緒怪獸」困住！',
        side: 'left'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '校園任務看板上有好多同學需要我們幫忙！拿起你的【同理心放大鏡】，我們出發吧！',
        side: 'left'
      }
    ]
  },

  // 關卡 1：操場上的暴怒怪（體育課的風波 - 輸不起）
  {
    id: 'level_1',
    levelNum: 1,
    title: '第一關：體育課的暴怒怪',
    tag: '憤怒與輸不起',
    desc: '躲避球被球砸中出局，小明暴跳如雷踢地板大吼：「裁判不公平！我不玩了！」',
    cardIcon: 'assets/monster_anger.jpg',
    cardBorder: 'border-red-400',
    cardBtnBg: 'bg-red-500 hover:bg-red-600',
    bg: 'assets/bg_playground.jpg',
    dialogues: [
      {
        speaker: '小明 (阿暴)',
        avatar: 'assets/monster_anger.jpg',
        text: '氣死我了！！😡 都是裁判亂判啦！憑什麼只有我出局？！我不玩了，大家也別想玩！',
        side: 'right',
        mood: 'angry'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '哇！小明身後出現了全身冒著怒火的「阿暴」！大家都被嚇得不敢說話...',
        side: 'left'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '小特工，身為情緒偵探，我們先來觀察小明身體發出的「求救訊號」吧！',
        side: 'left'
      }
    ],
    quiz1: {
      question: '【線索偵測】小明生氣時，身體通常會出現什麼生理反應？',
      options: [
        { text: 'A. 握緊拳頭、心跳加快、臉頰脖子漲紅發燙 🔥', correct: true, feedback: '太準確了！憤怒時大腦警報響起，血液會往四肢衝，讓人想打人或大吼！' },
        { text: 'B. 身體放鬆想打哈欠睡覺 💤', correct: false, feedback: '不太對喔，生氣時身體其實處於高度緊繃的備戰狀態！' },
        { text: 'C. 嘴角上揚、哼著喜歡的歌 🎵', correct: false, feedback: '這是開心時候的表現喔！' }
      ]
    },
    quiz2: {
      question: '【心靈透視】小明表面上在發脾氣，但他內心深處真正藏著什麼感受？',
      options: [
        { text: 'A. 他單純就是個沒教養、愛破壞氣氛的同學', correct: false, feedback: '別急著批判喔！每個人生氣背後往往有脆弱的一面。' },
        { text: 'B. 「挫折」與「不甘心」：他很想幫大家贏球，卻突然被淘汰感到很沒面子', correct: true, feedback: '賓果！很多時候「生氣」只是保護色，底層藏著害怕失敗與委屈！' },
        { text: 'C. 他只是覺得好玩在裝生氣', correct: false, feedback: '看他眼眶發紅呼吸急促，他心裡其實很痛苦。' }
      ]
    },
    minigame: 'breathing',
    purifiedDialogue: [
      {
        speaker: '平靜的阿暴',
        avatar: 'assets/monster_calm.jpg',
        text: '呼...（大口呼氣）跟著做完熊式深呼吸，感覺腦袋冷靜好多...我剛才太想贏球了，對不起大家。',
        side: 'right',
        mood: 'calm'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '太棒了！學會按下「大腦暫停鍵」，暴怒怪獸也能化為勇敢前進的守護精靈！',
        side: 'left'
      }
    ],
    badgeReward: '🌬️ 深呼吸降溫大師'
  },

  // 關卡 2：教室角落的紫色影子（考前焦慮）
  {
    id: 'level_2',
    levelNum: 2,
    title: '第二關：教室角落的紫色影子',
    tag: '焦慮與害怕失敗',
    desc: '明天要考英文背單字，小天一直咬手指、肚子痛，害怕考不好被媽媽罵...',
    cardIcon: 'assets/monster_fear.jpg',
    cardBorder: 'border-purple-400',
    cardBtnBg: 'bg-purple-500 hover:bg-purple-600',
    bg: 'assets/bg_classroom.jpg',
    dialogues: [
      {
        speaker: '小天 (小抖)',
        avatar: 'assets/monster_fear.jpg',
        text: '嗚嗚...明天的單字考試我一定背不完...如果考爛了，大家會不會笑我很笨？我現在肚子好痛喔...',
        side: 'right',
        mood: 'fear'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '你看！小天身邊縮著紫色長耳怪獸「小抖」，因為太緊張，身體甚至開始肚子絞痛了呢！',
        side: 'left'
      }
    ],
    quiz1: {
      question: '【線索偵測】面對考試時出現「肚子痛、手腳冰冷發抖」，這是什麼情緒？',
      options: [
        { text: 'A. 焦慮與害怕失敗 (Fear & Anxiety)', correct: true, feedback: '沒錯！焦慮會刺激腸胃神經與自律神經，讓人胃部翻滾疼痛。' },
        { text: 'B. 驕傲自滿', correct: false, feedback: '驕傲的人可不會緊張到手抖肚子痛喔！' },
        { text: 'C. 嫉妒同學', correct: false, feedback: '目前小天滿腦子都在擔心自己的表現。' }
      ]
    },
    quiz2: {
      question: '【特工法寶】小特工，你會送給小天哪一個心靈超能力法寶？',
      options: [
        { text: 'A. 「任務切碎刀 + 成長護盾」：把30個單字切成每次記5個；告訴自己「盡力準備，考試是檢查哪裡不會，不是證明我不聰明！」', correct: true, feedback: '太棒了！這就是心理學的成長型心態（Growth Mindset），能大幅降低無力感！' },
        { text: 'B. 「逃避請假卡」：明天直接裝病不要去學校', correct: false, feedback: '逃避只能躲過一天，下次還是會更加害怕喔！' },
        { text: 'C. 「隨便放棄藥水」：反正記不住就乾脆不要讀了', correct: false, feedback: '這樣只會讓自己陷入更大的自責與低自尊。' }
      ]
    },
    purifiedDialogue: [
      {
        speaker: '小天 (小抖)',
        avatar: 'assets/monster_fear.jpg',
        text: '對耶！切成每次5個單字，我剛剛已經記住第一組了！感覺沒那麼可怕了，謝謝特工！',
        side: 'right',
        mood: 'calm'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '小天的焦慮兔子放下了耳朵！記住：害怕是正常的，一步一步來就能跨過去！',
        side: 'left'
      }
    ],
    badgeReward: '🛡️ 成長型思維勇士'
  },

  // 關卡 3：考不好被同學取笑（悲傷、委屈與自我肯定）
  {
    id: 'level_3',
    levelNum: 3,
    title: '第三關：走廊上的雨雲（考差被取笑）',
    tag: '委屈與自我價值',
    desc: '數學考卷發下來只有 45 分，後面的同學大聲取笑：「哈哈你怎麼考這麼爛啊！」小華眼眶泛淚想找洞鑽...',
    cardIcon: 'assets/monster_sad.svg',
    cardBorder: 'border-sky-400',
    cardBtnBg: 'bg-sky-500 hover:bg-sky-600',
    bg: 'assets/bg_classroom.jpg',
    dialogues: [
      {
        speaker: '小華 (滴滴)',
        avatar: 'assets/monster_sad.svg',
        text: '嗚...我昨天明明有複習...但小胖他們當全班面前笑我「笨蛋才考45分」，我好想哭、好想消失喔...',
        side: 'right',
        mood: 'sad'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '小華頭上罩著一朵下著暴雨的烏雲，水滴怪獸「滴滴」眼淚一直掉...被同學當眾取笑真的超級傷心委屈！',
        side: 'left'
      }
    ],
    quiz1: {
      question: '【心理診斷】當努力後成果不如預期又被嘲笑，小華產生的心理傷口是什麼？',
      options: [
        { text: 'A. 「羞愧感（Shame）」與「自我懷疑」：誤以為考不好就代表自己是一個糟糕沒有價值的人', correct: true, feedback: '非常精闢！取笑會讓人的「羞愧感」爆發，讓人想把自己藏起來。' },
        { text: 'B. 他只是肚子餓想吃點心', correct: false, feedback: '小華現在心裡受了很深的語言傷害喔！' },
        { text: 'C. 覺得同學說得很有道理，很開心地笑了', correct: false, feedback: '被當眾嘲弄是沒有人會開心的！' }
      ]
    },
    quiz2: {
      question: '【特工解藥】如果你是小華，或是小華的好朋友，最好的應對方式是什麼？',
      options: [
        { text: 'A. 【內心金鐘罩】：「分數只是一次測驗，不能定義我是個怎樣的人；拿別人成績取笑的人，展現的是他們的不成熟，我不必用他們的話來懲罰自己。」', correct: true, feedback: '給小華滿滿的同理與自我肯定！分數能重考，善良與努力更重要！' },
        { text: 'B. 衝過去揍小胖一拳，打到他閉嘴', correct: false, feedback: '雖然生氣很正常，但動手打人會讓自己從受害者變成違規者，得不償失。' },
        { text: 'C. 把考卷撕成碎片吃下去裝沒事', correct: false, feedback: '壓抑傷害只會讓自己心裡的小雨雲越積越大。' }
      ]
    },
    purifiedDialogue: [
      {
        speaker: '小華 (滴滴)',
        avatar: 'assets/monster_sad.svg',
        text: '擦乾眼淚...特工你說得對！我雖然數學這次沒考好，但我很會畫畫、也很善良！我去找老師把訂正搞懂就好，不理他們的嘲笑了！',
        side: 'right',
        mood: 'calm'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '雨過天晴！小華頭上的烏雲散開，長出了美麗的彩虹！',
        side: 'left'
      }
    ],
    badgeReward: '🌈 自我肯定彩虹勛章'
  },

  // 關卡 4：無人理會的孤單角落（被排擠 / 小圈圈）
  {
    id: 'level_4',
    levelNum: 4,
    title: '第四關：孤單毛線球（被排擠孤立）',
    tag: '同儕排擠與友誼',
    desc: '下課大家在玩分組遊戲，小美想加入，帶頭同學卻說：「我們這組滿了，妳不要來啦！」轉身講悄悄話笑著走開...',
    cardIcon: 'assets/monster_lonely.svg',
    cardBorder: 'border-emerald-400',
    cardBtnBg: 'bg-emerald-600 hover:bg-emerald-700',
    bg: 'assets/bg_playground.jpg',
    dialogues: [
      {
        speaker: '小美 (球球)',
        avatar: 'assets/monster_lonely.svg',
        text: '他們又抱在一起說悄悄話，還看著我笑...大家都不要跟我同一組，我坐在操場邊邊好孤單，我是不是哪裡被討厭了？',
        side: 'right',
        mood: 'lonely'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '小美身邊出現了一隻像刺蝟毛線球的「球球」，縮成一團緊抱著膝蓋...「被排擠」是學校裡最讓人心痛的感受之一。',
        side: 'left'
      }
    ],
    quiz1: {
      question: '【心靈透視】面對排擠與小圈圈時，孩子最容易產生哪種錯誤自責想法？',
      options: [
        { text: 'A. 「一定是我不夠好、我不夠酷，大家才不要我」', correct: true, feedback: '是的！排擠往往是群體動力或不成熟行為，但被排擠者容易過度把問題全部怪在自己身上。' },
        { text: 'B. 「太好了，我一個人最輕鬆」', correct: false, feedback: '人類是群居動物，被同儕孤立是會讓人強烈難過的。' },
        { text: 'C. 「一定是大家嫉妒我長得太好看」', correct: false, feedback: '此時通常是深深的受挫與孤單，而非自信。' }
      ]
    },
    quiz2: {
      question: '【人際智慧】如果你遇到被某個小圈圈排擠，什麼是更健康的做法？',
      options: [
        { text: 'A. 【擴大生活圈 + 尋求支持】：「不需要委屈討好不尊重我的人。學校很大，我可以找其他同樣落單或溫和的同學做朋友，並告訴信任的老師或家人。」', correct: true, feedback: '太棒了！真正的朋友不需要你卑躬屈膝去乞求，轉個身世界很大！' },
        { text: 'B. 買昂貴的糖果禮物去巴結送給帶頭的人，求他們收留我', correct: false, feedback: '用討好換來的不是真友誼，對方反而可能予取予求喔！' },
        { text: 'C. 在網路上發文罵全班同學', correct: false, feedback: '這會引發更大的網路霸凌與班級衝突。' }
      ]
    },
    purifiedDialogue: [
      {
        speaker: '小美 (球球)',
        avatar: 'assets/monster_lonely.svg',
        text: '我看見坐在圖書館門口的阿雅也一個人看書，我決定拿著我的故事書去問阿雅要不要一起看！我們剛才聊得好開心！',
        side: 'right',
        mood: 'calm'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '哇！小美的毛線球刺蝟鬆開了刺，變成了柔軟又溫暖的心！主動踏出一步尋找真正的朋友！',
        side: 'left'
      }
    ],
    badgeReward: '🤝 真誠友誼破冰者'
  },

  // 關卡 5：未經同意亂拿東西（人際界線與我訊息）
  {
    id: 'level_5',
    levelNum: 5,
    title: '第五關：界線小狐狸（東西被亂拿）',
    tag: '個人界線與溝通',
    desc: '上美勞課時，旁邊同學一句話都沒說，直接伸手從小強桌上抓走剛買的高級彩色筆，還用力畫斷了筆頭！',
    cardIcon: 'assets/monster_boundary.svg',
    cardBorder: 'border-orange-400',
    cardBtnBg: 'bg-orange-500 hover:bg-orange-600',
    bg: 'assets/bg_classroom.jpg',
    dialogues: [
      {
        speaker: '小強 (跳跳)',
        avatar: 'assets/monster_boundary.svg',
        text: '喂！！那是媽媽送我的新彩色筆耶！你連問都沒問就自己拿去用，還把我的筆頭弄分岔了！你太過分了！！',
        side: 'right',
        mood: 'angry'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '小強身邊跳出雙手叉腰、尾巴豎起的「跳跳」！同學「未經同意擅自拿取」直接踩破了別人的【身體與物品個人界線】！',
        side: 'left'
      }
    ],
    quiz1: {
      question: '【界線意識】為什麼「未經同意拿別人的東西」會讓人如此憤怒與不舒服？',
      options: [
        { text: 'A. 因為這侵犯了「個人界線（Personal Boundaries）」與所有權，傳遞出不被尊重的感覺', correct: true, feedback: '答對了！不管是借筆、碰觸身體或看日記，未經允許就是缺乏邊界感的不尊重行為！' },
        { text: 'B. 單純因為那支筆很便宜不值錢', correct: false, feedback: '即使是普通橡皮擦，沒被尊重借用一樣會讓人生氣！' },
        { text: 'C. 因為學校規定上課不能畫畫', correct: false, feedback: '重點在於未經他人同意就動手拿取。' }
      ]
    },
    quiz2: {
      question: '【溝通大師】小強要如何堅定又有效地表達自己的界線？請選出最佳的【我訊息 (I-Message)】：',
      options: [
        { text: 'A. 「你沒問我就拿我的筆，筆頭壓壞了我很心疼也很生氣。下次如果要借，請一定要先問我；而且你現在需要跟我道歉並想辦法解決。」', correct: true, feedback: '超完美的「我訊息」！包含客觀事實＋個人感受＋明確界線與訴求，堅定而不失風度！' },
        { text: 'B. 算了我不敢講話，默默把筆收起來哭，假裝沒事', correct: false, feedback: '忍氣吞聲只會讓對方誤以為這樣做沒關係，下次還會再犯！' },
        { text: 'C. 直接把對方的鉛筆盒全部掃到地上踩碎', correct: false, feedback: '暴力破壞會讓事情失焦，反而變成你在欺負同學。' }
      ]
    },
    purifiedDialogue: [
      {
        speaker: '小強 (跳跳)',
        avatar: 'assets/monster_boundary.svg',
        text: '同學聽完我認真說的話，低下頭跟我道歉了，還借我他的備用筆。清楚說出自己的界線，真的比直接動手大罵有效多了！',
        side: 'right',
        mood: 'calm'
      },
      {
        speaker: '波波',
        avatar: 'assets/guide_bobo.jpg',
        text: '太了不起了！學會劃出保護自己的「心靈邊界」，我們就能做自己情緒的主人！',
        side: 'left'
      }
    ],
    badgeReward: '🛡️ 守護界線外交官'
  }
];

// 核心控制器
class GameController {
  constructor() {
    this.stage = document.getElementById('game-stage');
    this.bg = document.getElementById('game-bg');
    this.hudSubtitle = document.getElementById('hud-subtitle');
    this.eqVal = document.getElementById('eq-val');
    this.eqBar = document.getElementById('eq-bar');
    this.btnSound = document.getElementById('btn-sound');

    this.initEvents();
    this.showTitleScreen();
  }

  initEvents() {
    this.btnSound.addEventListener('click', () => {
      sounds.enabled = !sounds.enabled;
      this.btnSound.textContent = sounds.enabled ? '🔊' : '🔇';
      this.btnSound.classList.toggle('opacity-50', !sounds.enabled);
    });
  }

  updateEQ(delta) {
    gameState.eq = Math.max(0, Math.min(100, gameState.eq + delta));
    this.eqVal.textContent = gameState.eq;
    this.eqBar.style.width = `${gameState.eq}%`;
  }

  // 畫面 1：遊戲標題主畫面
  showTitleScreen() {
    this.bg.style.backgroundImage = "url('assets/bg_playground.jpg')";
    this.hudSubtitle.textContent = '歡迎來到陽光國小情緒大冒險！';

    this.stage.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center text-center p-4">
        <!-- 漂浮嚮導 -->
        <div class="relative mb-5">
          <img src="assets/guide_bobo.jpg" alt="波波" class="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-amber-300 shadow-xl object-cover animate-bounce-slow">
          <span class="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 font-bold px-3 py-1 rounded-full text-xs shadow-md">嚮導波波</span>
        </div>

        <h1 class="font-cute text-3xl sm:text-4xl text-white drop-shadow-md mb-2 tracking-wide">
          心靈特工隊：情緒大冒險
        </h1>
        <p class="text-amber-200 text-sm sm:text-base max-w-lg mb-6 drop-shadow">
          5 大校園實戰關卡：面對生氣、考前緊張、被嘲笑、被排擠與東西被亂拿！
        </p>

        <!-- 開始按鈕 -->
        <button id="btn-start" class="font-cute text-lg px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
          <span>🚀</span> 開始特工任務！
        </button>
      </div>
    `;

    document.getElementById('btn-start').addEventListener('click', () => {
      sounds.playSuccess();
      this.startIntro();
    });
  }

  // 畫面 2：序章對白播放
  startIntro() {
    gameState.currentChapter = 0;
    gameState.currentDialogueIdx = 0;
    this.playDialogueSequence(storyData[0].dialogues, () => {
      this.showLevelSelect();
    });
  }

  // 關卡選擇畫面 (5 個關卡卡片)
  showLevelSelect() {
    this.bg.style.backgroundImage = "url('assets/bg_classroom.jpg')";
    this.hudSubtitle.textContent = '請選擇你想調查的校園情緒事件：';

    const levels = storyData.slice(1);

    this.stage.innerHTML = `
      <div class="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full py-1">
        <div class="flex items-center justify-between mb-3 px-2">
          <h2 class="font-cute text-xl sm:text-2xl text-white drop-shadow flex items-center gap-2">
            <span>🏫</span> 校園任務看板 (共 5 關)
          </h2>
          <span class="text-xs bg-amber-400/90 text-amber-950 font-bold px-3 py-1 rounded-full shadow">
            已收集勳章: ${gameState.badges.length} / 5
          </span>
        </div>

        <!-- 5 大關卡水平滑動或網格佈局 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-[420px] p-2 pr-1 custom-scroll">
          ${levels.map((lvl) => {
            const isCompleted = gameState.badges.includes(lvl.badgeReward);
            return `
              <div class="bg-white/95 rounded-2xl p-4 shadow-lg border-2 ${lvl.cardBorder} hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between relative group" data-level-id="${lvl.id}">
                ${isCompleted ? `
                  <div class="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    ✓ 已淨化
                  </div>
                ` : ''}
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <img src="${lvl.cardIcon}" class="w-12 h-12 rounded-xl border border-slate-300 object-cover bg-white">
                    <div>
                      <span class="text-[10px] font-bold text-slate-500">關卡 ${lvl.levelNum}・${lvl.tag}</span>
                      <h3 class="font-bold text-slate-800 text-sm leading-tight">${lvl.title.split('：')[1]}</h3>
                    </div>
                  </div>
                  <p class="text-xs text-slate-600 line-clamp-2 mb-3">${lvl.desc}</p>
                </div>
                <button class="w-full py-1.5 ${lvl.cardBtnBg} text-white rounded-xl text-xs font-bold shadow transition group-hover:brightness-110">
                  ${isCompleted ? '再次挑戰 ➔' : '出發調查 ➔'}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        ${gameState.badges.length > 0 ? `
          <div class="mt-2 p-3 bg-amber-500/20 backdrop-blur-md rounded-2xl border border-amber-300/40 flex items-center justify-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-amber-200">🏆 榮譽勛章牆：</span>
            ${gameState.badges.map(b => `<span class="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full shadow">${b}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;

    document.querySelectorAll('[data-level-id]').forEach(card => {
      card.addEventListener('click', () => {
        sounds.playPop();
        const levelId = card.getAttribute('data-level-id');
        const levelData = storyData.find(l => l.id === levelId);
        if (levelData) this.startLevel(levelData);
      });
    });
  }

  // 關卡流程啟動
  startLevel(levelData) {
    this.bg.style.backgroundImage = `url('${levelData.bg}')`;
    this.hudSubtitle.textContent = levelData.title;

    // 先跑關卡開場對話
    this.playDialogueSequence(levelData.dialogues, () => {
      // 接著進行線索偵測題 1
      this.showQuiz(levelData.quiz1, () => {
        // 線索題 2 (或迷你遊戲)
        if (levelData.minigame === 'breathing') {
          this.showBreathingMinigame(() => {
            this.showQuiz(levelData.quiz2, () => {
              this.finishLevel(levelData);
            });
          });
        } else {
          this.showQuiz(levelData.quiz2, () => {
            this.finishLevel(levelData);
          });
        }
      });
    });
  }

  // 對話播放引擎
  playDialogueSequence(dialogues, onComplete) {
    let currentIdx = 0;

    const render = () => {
      if (currentIdx >= dialogues.length) {
        onComplete();
        return;
      }

      const d = dialogues[currentIdx];
      sounds.playPop();

      this.stage.innerHTML = `
        <div class="flex-1 flex flex-col justify-end">
          
          <!-- 立繪展示區 -->
          <div class="flex items-end justify-between px-6 sm:px-12 mb-4">
            <!-- 左側角色 -->
            <div class="transition-all duration-300 ${d.side === 'left' ? 'scale-105 opacity-100' : 'opacity-40 scale-95'}">
              ${d.side === 'left' ? `
                <img src="${d.avatar}" class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-amber-300 shadow-2xl object-cover bg-white animate-bounce-slow">
              ` : '<div class="w-28 sm:w-36"></div>'}
            </div>

            <!-- 右側角色 -->
            <div class="transition-all duration-300 ${d.side === 'right' ? 'scale-105 opacity-100' : 'opacity-40 scale-95'}">
              ${d.side === 'right' ? `
                <img src="${d.avatar}" class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 ${d.mood === 'angry' ? 'border-red-400 animate-flame' : 'border-amber-300'} shadow-2xl object-cover bg-white">
              ` : '<div class="w-28 sm:w-36"></div>'}
            </div>
          </div>

          <!-- 對話文字方塊 (RPG Style) -->
          <div class="bg-white/95 rounded-2xl p-5 sm:p-6 shadow-2xl border-4 border-amber-300 relative cursor-pointer" id="dialogue-box">
            <div class="flex items-center justify-between mb-2">
              <span class="font-cute font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full text-sm">
                ${d.speaker}
              </span>
              <span class="text-xs text-slate-400 animate-pulse">點擊任意處繼續 ▶</span>
            </div>
            <p class="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
              ${d.text}
            </p>
          </div>

        </div>
      `;

      document.getElementById('dialogue-box').addEventListener('click', () => {
        currentIdx++;
        render();
      });
    };

    render();
  }

  // 選擇題機制
  showQuiz(quizData, onCorrect) {
    this.stage.innerHTML = `
      <div class="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div class="bg-white/95 rounded-3xl p-6 shadow-2xl border-4 border-amber-300">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">💡</span>
            <h3 class="font-bold text-slate-900 text-base sm:text-lg">${quizData.question}</h3>
          </div>

          <div class="space-y-3 mt-4" id="options-container">
            ${quizData.options.map((opt, idx) => `
              <button data-idx="${idx}" class="opt-btn w-full text-left p-3.5 rounded-xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-slate-800 text-sm font-semibold transition active:scale-[0.98] shadow-sm">
                ${opt.text}
              </button>
            `).join('')}
          </div>

          <div id="feedback-area" class="hidden mt-4 p-4 rounded-xl text-sm font-bold"></div>
        </div>
      </div>
    `;

    const buttons = document.querySelectorAll('.opt-btn');
    const feedbackArea = document.getElementById('feedback-area');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const option = quizData.options[idx];

        if (option.correct) {
          sounds.playSuccess();
          this.updateEQ(15);
          btn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
          feedbackArea.className = 'mt-4 p-4 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 block';
          feedbackArea.innerHTML = `
            <div>🌟 ${option.feedback}</div>
            <button id="btn-next-step" class="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700">繼續前進 ➔</button>
          `;
          buttons.forEach(b => b.disabled = true);
          document.getElementById('btn-next-step').addEventListener('click', () => {
            onCorrect();
          });
        } else {
          sounds.playError();
          this.updateEQ(-5);
          btn.classList.add('bg-rose-100', 'border-rose-400', 'text-rose-900');
          feedbackArea.className = 'mt-4 p-4 rounded-xl text-sm font-bold bg-rose-100 text-rose-800 border border-rose-300 block';
          feedbackArea.textContent = `💡 ${option.feedback}，再想想看喔！`;
        }
      });
    });
  }

  // 深呼吸迷你遊戲 (Cool-down)
  showBreathingMinigame(onFinish) {
    sounds.playMagic();
    let timeLeft = 10;

    this.stage.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <div class="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 w-full flex flex-col items-center">
          <span class="bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-bold mb-3">特工應急冷靜術</span>
          <h3 class="font-cute text-xl sm:text-2xl text-slate-800 mb-2">🐻 熊式深呼吸法</h3>
          <p class="text-xs text-slate-600 mb-6">跟著圓圈的節奏：變大時「深吸氣」、變小時「慢慢吐氣」</p>

          <!-- 呼吸動態圓圈 -->
          <div class="relative w-44 h-44 flex items-center justify-center my-4">
            <div class="absolute inset-0 bg-gradient-to-tr from-sky-400 to-emerald-300 rounded-full breathing-anim blur-sm"></div>
            <div class="relative z-10 w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
              <span id="breath-text" class="text-base font-bold text-sky-700">深吸氣...</span>
              <span id="breath-timer" class="text-xs text-slate-400 font-bold mt-1">倒數 10 秒</span>
            </div>
          </div>

          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div id="breath-progress" class="bg-emerald-500 h-full w-full transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    `;

    const breathText = document.getElementById('breath-text');
    const timerText = document.getElementById('breath-timer');
    const progressBar = document.getElementById('breath-progress');

    let isInhaling = true;
    const interval = setInterval(() => {
      timeLeft--;
      timerText.textContent = `倒數 ${timeLeft} 秒`;
      progressBar.style.width = `${(timeLeft / 10) * 100}%`;

      if (timeLeft % 4 === 0) {
        isInhaling = !isInhaling;
        breathText.textContent = isInhaling ? '深吸氣...' : '慢慢吐氣...';
        sounds.playPop();
      }

      if (timeLeft <= 0) {
        clearInterval(interval);
        sounds.playSuccess();
        this.updateEQ(20);
        onFinish();
      }
    }, 1000);
  }

  // 關卡結算與頒發勳章
  finishLevel(levelData) {
    sounds.playMagic();
    if (!gameState.badges.includes(levelData.badgeReward)) {
      gameState.badges.push(levelData.badgeReward);
    }

    this.playDialogueSequence(levelData.purifiedDialogue, () => {
      this.stage.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div class="bg-white/95 rounded-3xl p-8 shadow-2xl border-4 border-amber-300 max-w-md w-full">
            <span class="text-5xl mb-4 block animate-bounce-slow">🎉</span>
            <h2 class="font-cute text-2xl text-slate-800 font-bold mb-2">任務圓滿達成！</h2>
            <p class="text-sm text-slate-600 mb-6">你成功幫助了同學認識情緒，並找回平靜！</p>

            <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 mb-6">
              <span class="text-xs font-bold text-amber-800">獲得新特工榮譽勳章：</span>
              <div class="font-cute text-lg text-amber-900 font-black mt-1">
                ${levelData.badgeReward}
              </div>
            </div>

            <button id="btn-back-menu" class="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-bold rounded-xl shadow-lg transition active:scale-95">
              返回校園任務板 ➔
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-back-menu').addEventListener('click', () => {
        sounds.playPop();
        this.showLevelSelect();
      });
    });
  }
}

// 啟動遊戲
window.addEventListener('DOMContentLoaded', () => {
  new GameController();
});
