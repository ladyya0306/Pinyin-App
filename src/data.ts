export type Word = {
  id: string;
  hanzi: string;
  pinyin: string;
  emoji: string;
};

// 一年级
const grade1Data = [
  "朋友|péng you|🤝", "睡觉|shuì jiào|😴", "眼睛|yǎn jing|👀", "耳朵|ěr duo|👂",
  "嘴巴|zuǐ ba|👄", "头发|tóu fa|💇", "肚子|dù zi|🤰", "星星|xīng xing|⭐",
  "月亮|yuè liang|🌙", "太阳|tài yáng|☀️", "云朵|yún duǒ|☁️", "下雨|xià yǔ|🌧️",
  "雪人|xuě rén|⛄", "苹果|píng guǒ|🍎", "香蕉|xiāng jiāo|🍌", "西瓜|xī guā|🍉",
  "草莓|cǎo méi|🍓", "小狗|xiǎo gǒu|🐶", "小猫|xiǎo māo|🐱", "兔子|tù zi|🐰",
  "老虎|lǎo hǔ|🐯", "大象|dà xiàng|🐘", "斑马|bān mǎ|🦓", "长颈鹿|cháng jǐng lù|🦒",
  "学校|xué xiào|🏫", "老师|lǎo shī|🧑‍🏫", "同学|tóng xué|👦", "书本|shū běn|📚",
  "铅笔|qiān bǐ|✏️", "橡皮|xiàng pí|🧽", "书包|shū bāo|🎒", "黑板|hēi bǎn|🏫",
  "吃饭|chī fàn|🍚", "喝水|hē shuǐ|💧", "起床|qǐ chuáng|🛏️", "刷牙|shuā yá|🪥",
  "洗脸|xǐ liǎn|🧼", "穿衣|chuān yī|👕", "鞋子|xié zi|👟", "袜子|wà zi|🧦",
  "冬天|dōng tiān|⛄", "春天|chūn tiān|🌸", "夏天|xià tiān|🌞", "秋天|qiū tiān|🍂",
  "红色|hóng sè|🔴", "黄色|huáng sè|🟡", "蓝色|lán sè|🔵", "绿色|lǜ sè|🟢",
  "爸爸|bà ba|👨", "妈妈|mā ma|👩", "哥哥|gē ge|👦", "姐姐|jiě jie|👧",
  "弟弟|dì di|👶", "妹妹|mèi mei|👧", "爷爷|yé ye|👴", "奶奶|nǎi nai|👵",
  "汽车|qì chē|🚗", "火车|huǒ chē|🚆", "飞机|fēi jī|✈️", "轮船|lún chuán|🚢",
  "桌子|zhuō zi|🪑", "椅子|yǐ zi|🪑", "门窗|mén chuāng|🚪", "电灯|diàn dēng|💡",
  "电视|diàn shì|📺", "电话|diàn huà|☎️", "电脑|diàn nǎo|💻", "手表|shǒu biǎo|⌚",
  "树木|shù mù|🌳", "花草|huā cǎo|🌷", "小鸟|xiǎo niǎo|🐦", "虫子|chóng zi|🐛",
  "快乐|kuài lè|😄", "伤心|shāng xīn|😢", "生气|shēng qì|😡", "害怕|hài pà|😱",
  "美丽|měi lì|✨", "聪明|cōng ming|🧠", "勇敢|yǒng gǎn|🦸", "可爱|kě ài|🥰",
  "公园|gōng yuán|🏞️", "马路|mǎ lù|🛣️", "桥梁|qiáo liáng|🌉", "河水|hé shuǐ|🌊",
  "大门|dà mén|🚪", "前门|qián mén|🚪", "后门|hòu mén|🚪", "开门|kāi mén|🚪",
  "白云|bái yún|☁️", "黑夜|hēi yè|🌃", "明天|míng tiān|🌅", "昨天|zuó tiān|🌇",
  "早上|zǎo shang|🌅", "晚上|wǎn shang|🌃", "中午|zhōng wǔ|☀️", "下午|xià wǔ|🌇",
  "中国|zhōng guó|🇨🇳", "北京|běi jīng|🏛️", "上海|shàng hǎi|🌆", "广州|guǎng zhōu|🏙️",
  "读书|dú shū|📖", "写字|xiě zì|✍️", "画画|huà huà|🎨", "唱歌|chàng gē|🎤",
  "跳舞|tiào wǔ|💃", "跑步|pǎo bù|🏃", "游泳|yóu yǒng|🏊", "打球|dǎ qiú|🏀",
  "皮球|pí qiú|⚽", "篮球|lán qiú|🏀", "足球|zú qiú|⚽", "排球|pái qiú|🏐",
  "水果|shuǐ guǒ|🍎", "蔬菜|shū cài|🥬", "牛奶|niú nǎi|🥛", "面包|miàn bāo|🍞",
  "米饭|mǐ fàn|🍚", "面条|miàn tiáo|🍜", "包子|bāo zi|🥟", "饺子|jiǎo zi|🥟",
  // 平翘舌音易混淆
  "做梦|zuò mèng|💭", "走路|zǒu lù|🚶", "竹子|zhú zi|🎋", "种花|zhòng huā|🌷",
  "操场|cāo chǎng|🏟️", "草地|cǎo dì|🌿", "窗户|chuāng hu|🪟", "出门|chū mén|🚪",
  "散步|sàn bù|🚶", "色彩|sè cǎi|🎨", "时钟|shí zhōng|🕐", "沙子|shā zi|🏖️",
  // 前后鼻音易混淆
  "班长|bān zhǎng|👨‍🎓", "帮忙|bāng máng|🤝", "金鱼|jīn yú|🐠", "拼图|pīn tú|🧩",
  "风筝|fēng zhēng|🪁", "灯笼|dēng lóng|🏮", "天亮|tiān liàng|🌅", "冰棍|bīng gùn|🍦",
  // n/l混淆
  "鸟巢|niǎo cháo|🪺", "年糕|nián gāo|🍡", "暖气|nuǎn qì|🌡️", "牛角|niú jiǎo|🐂",
  "路口|lù kǒu|🚦", "绿叶|lǜ yè|🌿", "雷声|léi shēng|⚡", "凉水|liáng shuǐ|🥶"
];

// 二年级
const grade2Data = [
  "知道|zhī dào|💡", "迟到|chí dào|⏰", "自己|zì jǐ|👤", "仔细|zǐ xì|🔍",
  "总是|zǒng shì|🔄", "城市|chéng shì|🏙️", "祖国|zǔ guó|🇨🇳", "如果|rú guǒ|🤔",
  "虽然|suī rán|🤷", "突然|tū rán|⚡", "努力|nǔ lì|💪", "哪里|nǎ lǐ|📍",
  "脑筋|nǎo jīn|🧠", "老鹰|lǎo yīng|🦅", "牛奶|niú nǎi|🥛", "留恋|liú liàn|🥺",
  "亲切|qīn qiè|🥰", "心情|xīn qíng|❤️", "森林|sēn lín|🌲", "生病|shēng bìng|🤒",
  "认真|rèn zhēn|🧐", "人们|rén men|🧑‍🤝‍🧑", "怎么|zěn me|❓", "什么|shén me|❓",
  "告诉|gào su|🗣️", "故事|gù shi|📖", "喜欢|xǐ huan|😍", "漂亮|piào liang|✨",
  "眼睛|yǎn jing|👀", "眼镜|yǎn jìng|👓", "干净|gān jìng|✨", "安静|ān jìng|🤫",
  "欢迎|huān yíng|👋", "原因|yuán yīn|❓", "愿意|yuàn yì|👌", "医院|yī yuàn|🏥",
  "蝴蝶|hú dié|🦋", "蜜蜂|mì fēng|🐝", "蜻蜓|qīng tíng|🚁", "蚂蚁|mǎ yǐ|🐜",
  "泥土|ní tǔ|🌱", "礼物|lǐ wù|🎁", "奶奶|nǎi nai|👵", "爷爷|yé ye|👴",
  "早晨|zǎo chén|🌅", "晚上|wǎn shang|🌙", "中午|zhōng wǔ|☀️", "夜里|yè li|🌌",
  "帮助|bāng zhù|🤝", "保护|bǎo hù|🛡️", "感谢|gǎn xiè|🙏", "道歉|dào qiàn|🙇",
  "颜色|yán sè|🎨", "图画|tú huà|🖼️", "音乐|yīn yuè|🎵", "唱歌|chàng gē|🎤",
  "跳舞|tiào wǔ|💃", "跑步|pǎo bù|🏃", "游泳|yóu yǒng|🏊", "骑车|qí chē|🚴",
  "风景|fēng jǐng|🏞️", "照片|zhào piàn|📸", "照相机|zhào xiàng jī|📷", "旅行|lǚ xíng|🧳",
  "世界|shì jiè|🌍", "地点|dì diǎn|📍", "方向|fāng xiàng|🧭", "东南|dōng nán|↘️",
  "西北|xī běi|↖️", "左右|zuǒ yòu|↔️", "前后|qián hòu|↕️", "上下|shàng xià|↕️",
  "因为|yīn wèi|💡", "所以|suǒ yǐ|➡️", "但是|dàn shì|✋", "可是|kě shì|🤔",
  "拼音|pīn yīn|🔡", "拼写|pīn xiě|✍️", "音节|yīn jié|🎵", "声调|shēng diào|📉",
  "前面|qián miàn|⬆️", "后面|hòu miàn|⬇️", "生字|shēng zì|📝", "生词|shēng cí|📖",
  "旁边|páng biān|➡️", "中间|zhōng jiān|🎯", "内外|nèi wài|⭕", "远近|yuǎn jìn|📏",
  "高矮|gāo ǎi|📏", "胖瘦|pàng shòu|⚖️", "长短|cháng duǎn|📏", "粗细|cū xì|📏",
  "黑白|hēi bái|☯️", "男女|nán nǚ|🚻", "老少|lǎo shào|👨‍🦳", "多少|duō shǎo|🔢",
  "早晚|zǎo wǎn|🌗", "真假|zhēn jiǎ|⚖️", "对错|duì cuò|❌", "好坏|hǎo huài|👍",
  "新旧|xīn jiù|✨", "冷热|lěng rè|🌡️", "干净|gān jìng|✨", "肮脏|āng zāng|🗑️",
  "安全|ān quán|🛡️", "危险|wēi xiǎn|⚠️", "简单|jiǎn dān|✅", "困难|kùn nán|🧗",
  "快乐|kuài lè|😄", "悲伤|bēi shāng|😢", "勇敢|yǒng gǎn|🦸", "胆小|dǎn xiǎo|🐭",
  // 平翘舌音易混淆
  "做操|zuò cāo|🤸", "杂技|zá jì|🎪", "自然|zì rán|🌿", "走失|zǒu shī|😰",
  "珍贵|zhēn guì|💎", "整齐|zhěng qí|📐", "主角|zhǔ jué|🌟", "指南|zhǐ nán|🧭",
  "词语|cí yǔ|📝", "从前|cóng qián|📖", "春节|chūn jié|🧨", "成长|chéng zhǎng|🌱",
  "四季|sì jì|🗓️", "思考|sī kǎo|🤔", "松树|sōng shù|🌲", "速度|sù dù|⚡",
  "神奇|shén qí|✨", "收获|shōu huò|🌾", "生长|shēng zhǎng|🌱", "手册|shǒu cè|📓",
  // 前后鼻音易混淆
  "感觉|gǎn jué|💭", "钢笔|gāng bǐ|🖊️", "信心|xìn xīn|💪", "影子|yǐng zi|👤",
  // n/l混淆
  "农村|nóng cūn|🌾", "年级|nián jí|📅", "练习|liàn xí|📝", "乐趣|lè qù|🎉"
];

// 三年级
const grade3Data = [
  "琴弦|qín xián|🎻", "旋转|xuán zhuǎn|🔄", "血液|xuè yè|🩸", "穴位|xué wèi|🦵",
  "骨髓|gǔ suǐ|🦴", "甚至|shèn zhì|❗", "既然|jì rán|🤷", "即使|jí shǐ|🤔",
  "立即|lì jí|⚡", "犹豫|yóu yù|🤔", "忧虑|yōu lǜ|😟", "允许|yǔn xǔ|✅",
  "贪婪|tān lán|🤤", "勉强|miǎn qiǎng|😓", "坚强|jiān qiáng|💪", "滋润|zī rùn|💦",
  "湿润|shī rùn|💧", "干燥|gān zào|🏜️", "急躁|jí zào|😤", "暴躁|bào zào|😡",
  "舞蹈|wǔ dǎo|💃", "捣乱|dǎo luàn|🐒", "岛屿|dǎo yǔ|🏝️", "熟悉|shú xī|🤝",
  "特殊|tè shū|🌟", "普通|pǔ tōng|😐", "谱写|pǔ xiě|✍️", "成绩|chéng jì|💯",
  "书籍|shū jí|📚", "曾经|céng jīng|🕰️", "尽管|jǐn guǎn|🤷", "尽量|jìn liàng|💪",
  "似乎|sì hū|🤔", "似的|shì de|🤔", "比较|bǐ jiào|⚖️", "计较|jì jiào|😠",
  "发酵|fā jiào|🍞", "教授|jiào shòu|👨‍🏫", "清脆|qīng cuì|🔔", "清晨|qīng chén|🌅",
  "倾听|qīng tīng|👂", "轻重|qīng zhòng|⚖️", "蜻蜓|qīng tíng|🚁", "情绪|qíng xù|🎭",
  "情况|qíng kuàng|📋", "晴天|qíng tiān|☀️", "眼睛|yǎn jing|👀", "眼镜|yǎn jìng|👓",
  "尊敬|zūn jìng|🫡", "遵守|zūn shǒu|🚦", "昨天|zuó tiān|📅", "作业|zuò yè|📝",
  "座位|zuò wèi|🪑", "做梦|zuò mèng|💭", "作品|zuò pǐn|🖼️", "作为|zuò wéi|👤",
  "充满|chōng mǎn|🔋", "充分|chōng fèn|💯", "冲锋|chōng fēng|⚔️", "冲突|chōng tū|💥",
  "重叠|chóng dié|🥞", "重复|chóng fù|🔁", "重量|zhòng liàng|⚖️", "重要|zhòng yào|❗",
  "中央|zhōng yāng|🎯", "中华|zhōng huá|🇨🇳", "终于|zhōng yú|🏁", "钟表|zhōng biǎo|🕒",
  "种类|zhǒng lèi|🗂️", "种植|zhòng zhí|🌱", "种子|zhǒng zi|🌰", "肿胀|zhǒng zhàng|🎈",
  "燃烧|rán shāo|🔥", "燃料|rán liào|🛢️", "染发|rǎn fà|💇", "传染|chuán rǎn|🦠",
  "偶尔|ǒu ěr|🎲", "偶然|ǒu rán|🎲", "呕吐|ǒu tù|🤮", "欧洲|ōu zhōu|🌍",
  "海鸥|hǎi ōu|🕊️", "殴打|ōu dǎ|👊", "歌颂|gē sòng|🎤", "背诵|bèi sòng|📖",
  "诉说|sù shuō|🗣️", "宿舍|sù shè|🏠", "严肃|yán sù|😐", "塑料|sù liào|🛍️",
  "迅速|xùn sù|⚡", "驯凉|xùn liáng|🦓", "询问|xún wèn|❓", "寻找|xún zhǎo|🔍",
  "巡逻|xún luó|🚓", "循环|xún huán|🔄", "遵守|zūn shǒu|🚦", "尊严|zūn yán|👑",
  "砖块|zhuān kuài|🧱", "专家|zhuān jiā|👨‍🔬", "转动|zhuǎn dòng|🔄", "传达|chuán dá|🗣️",
  "传统|chuán tǒng|🏮", "船只|chuán zhī|🚢", "喘气|chuǎn qì|😮‍💨", "穿衣服|chuān yī fu|👕",
  // 平翘舌音易混淆
  "组长|zǔ zhǎng|👨‍🏫", "字典|zì diǎn|📖", "资料|zī liào|📄", "总结|zǒng jié|📋",
  "庄稼|zhuāng jia|🌾", "桌椅|zhuō yǐ|🪑", "壮观|zhuàng guān|🏔️", "转弯|zhuǎn wān|↩️",
  "粗心|cū xīn|😅", "催促|cuī cù|⏩", "超市|chāo shì|🛒", "船长|chuán zhǎng|🧑‍✈️",
  "酸甜|suān tián|🍬", "随便|suí biàn|🤷", "山寨|shān zhài|🏯", "神仙|shén xiān|🧙",
  // 前后鼻音易混淆
  "担心|dān xīn|😟", "当然|dāng rán|✅", "品味|pǐn wèi|🍷", "平静|píng jìng|🧘",
  "根本|gēn běn|🌳", "工程|gōng chéng|🏗️",
  // n/l混淆
  "泥巴|ní bā|🏖️", "旅游|lǚ yóu|🧳"
];

// 四年级
const grade4Data = [
  "模样|mú yàng|👤", "模型|mó xíng|🧱", "提供|tí gōng|🤲", "供品|gòng pǐn|🍎",
  "处理|chǔ lǐ|🛠️", "到处|dào chù|🗺️", "恶劣|è liè|👎", "厌恶|yàn wù|🤮",
  "恶心|ě xin|🤢", "调节|tiáo jié|🎛️", "空调|kōng tiáo|❄️", "调动|diào dòng|🚚",
  "调查|diào chá|🕵️", "参加|cān jiā|🏃", "人参|rén shēn|🌱", "参差|cēn cī|〰️",
  "差别|chā bié|➖", "差不多|chà bu duō|🤷", "出差|chū chāi|✈️", "折腾|zhē teng|🤸",
  "打折|dǎ zhé|🏷️", "折本|shé běn|📉", "强迫|qiǎng pò|😠", "勉强|miǎn qiǎng|😓",
  "倔强|jué jiàng|😤", "剥削|bō xuē|🔪", "剥皮|bāo pí|🍌", "削铅笔|xiāo qiān bǐ|✏️",
  "薄荷|bò he|🌿", "单薄|dān bó|🍃", "薄饼|báo bǐng|🥞", "缝隙|féng xì|🕳️",
  "缝补|féng bǔ|🪡", "裂缝|liè fèng|⚡", "缝纫|féng rèn|🧵", "的确|dí què|✅",
  "目的|mù dì|🎯", "打车|dǎ chē|🚕", "打量|dǎ liang|👀", "结实|jiē shi|🧱",
  "结束|jié shù|🏁", "结果|jié guǒ|🍎", "结合|jié hé|🔗", "首都|shǒu dū|🏙️",
  "都市|dū shì|🌆", "都有|dōu yǒu|🤝", "方便|fāng biàn|👍", "便宜|pián yi|💰",
  "便利|biàn lì|🏪", "更正|gēng zhèng|✅", "更好|gèng hǎo|👍", "更变|gēng biàn|🔄",
  "倒车|dǎo chē|🔙", "倒影|dào yǐng|👤", "倒立|dào lì|🤸", "摔倒|shuāi dǎo|🤕",
  "答应|dā ying|🆗", "答应|dá yìng|🗣️", "反应|fǎn yìng|🤔", "应当|yīng dāng|✅",
  "假装|jiǎ zhuāng|🎭", "放假|fàng jià|🏖️", "真假|zhēn jiǎ|⚖️", "假若|jiǎ ruò|🤔",
  "关系|guān xì|🔗", "系鞋带|jì xié dài|👟", "联系|lián xì|☎️", "体系|tǐ xì|🏗️",
  "记载|jì zǎi|📝", "载重|zài zhòng|🚚", "一年半载|yī nián bàn zǎi|⏳", "满载|mǎn zài|🈵",
  "朝阳|zhāo yáng|🌅", "朝向|cháo xiàng|➡️", "朝气|zhāo qì|✨", "朝代|cháo dài|👑",
  "看守|kān shǒu|💂", "看见|kàn jiàn|👀", "看病|kàn bìng|🏥", "看板|kàn bǎn|📋",
  "弹琴|tán qín|🎹", "子弹|zǐ dàn|🔫", "弹性|tán xìng|🪀", "弹弓|dàn gōng|🏹",
  "降落|jiàng luò|🛬", "投降|tóu xiáng|🏳️", "下降|xià jiàng|📉", "降雨|jiàng yǔ|🌧️",
  "要求|yāo qiú|🙏", "重要|zhòng yào|❗", "要把|yào bǎ|✊", "要塞|yào sài|🏰",
  "难过|nán guò|😢", "灾难|zāi nàn|🌋", "困难|kùn nán|🧗", "逃难|táo nàn|🏃",
  "喝水|hē shuǐ|💧", "喝彩|hè cǎi|👏", "喝醉|hē zuì|🍺", "吆喝|yāo he|📢",
  "因为|yīn wèi|💡", "作为|zuò wéi|👤", "为了|wèi le|🎯", "为人|wéi rén|👥",
  "脏水|zāng shuǐ|💩", "心脏|xīn zàng|❤️", "弄脏|nòng zāng|🗑️", "五脏|wǔ zàng|🫀",
  "背心|bèi xīn|🎽", "背包|bēi bāo|🎒", "背书|bèi shū|📖", "背着|bēi zhe|🚶",
  // 平翘舌音易混淆
  "自信|zì xìn|💪", "造句|zào jù|✍️", "增加|zēng jiā|➕", "杂志|zá zhì|📰",
  "占领|zhàn lǐng|🚩", "阵地|zhèn dì|🏰", "制造|zhì zào|🏭", "招待|zhāo dài|🤝",
  "残忍|cán rěn|😈", "灿烂|càn làn|✨", "采访|cǎi fǎng|🎤", "操练|cāo liàn|🏋️",
  "抵达|dǐ dá|📍", "丝绸|sī chóu|🧣", "思维|sī wéi|🧠", "碎片|suì piàn|💥",
  "深浅|shēn qiǎn|📏", "手艺|shǒu yì|🎨", "闪亮|shǎn liàng|✨", "伸展|shēn zhǎn|🧘",
  // 前后鼻音易混淆
  "展览|zhǎn lǎn|🖼️", "战场|zhàn chǎng|⚔️", "奖章|jiǎng zhāng|🏅", "简单|jiǎn dān|✅",
  // n/l混淆
  "闹钟|nào zhōng|⏰", "理解|lǐ jiě|💡", "年龄|nián líng|📅", "力气|lì qì|💪",
  // 易错题库导入：轻声词（四年级常见）
  "扫帚|sào zhou|🧹", "清楚|qīng chu|🔍", "知识|zhī shi|📚", "算术|suàn shu|🔢",
  "收拾|shōu shi|🧹", "消息|xiāo xi|📰", "规矩|guī ju|📐", "地道|dì dao|🛣️",
  // 易错题库导入：日常多音字（四年级难度）
  "亚洲|yà zhōu|🌏", "卑鄙|bēi bǐ|😤", "伎俩|jì liǎng|🤹", "悄然|qiǎo rán|🤫",
  "颤栗|zhàn lì|😨", "奇数|jī shù|🔢", "关卡|guān qiǎ|🚧", "省悟|xǐng wù|💡",
  "旋风|xuàn fēng|🌪️", "涨潮|zhǎng cháo|🌊", "弹力|tán lì|🪀", "相称|xiāng chèn|⚖️",
  "缝纫机|féng rèn jī|🧵", "草率|cǎo shuài|🤷", "茶几|chá jī|☕",
  // 易错题库导入：易读错词和成语
  "搏击|bó jī|👊", "炮制|páo zhì|🧪", "威吓|wēi hè|⚠️",
  "哄堂大笑|hōng táng dà xiào|😂", "以己度人|yǐ jǐ duó rén|🤔",
  "差强人意|chā qiáng rén yì|😤", "无声无臭|wú shēng wú xiù|👃",
  "调解|tiáo jiě|🤝", "弄脏|nòng zāng|🗑️", "胆小|dǎn xiǎo|🐭"
];

// 五年级
const grade5Data = [
  "机械|jī xiè|⚙️", "解剖|jiě pōu|🔪", "剖析|pōu xī|🔍", "胆怯|dǎn qiè|😨",
  "惬意|qiè yì|😌", "提防|dī fáng|🛡️", "脂肪|zhī fáng|🥓", "潜水|qián shuǐ|🤿",
  "潜力|qián lì|💪", "气氛|qì fēn|🎉", "氛围|fēn wéi|🎆", "勉强|miǎn qiǎng|😓",
  "粗犷|cū guǎng|🦍", "宽广|kuān guǎng|🌌", "角色|jué sè|🎭", "角落|jiǎo luò|📐",
  "倔强|jué jiàng|😤", "强求|qiǎng qiú|🙏", "宁可|nìng kě|😤", "安宁|ān níng|🤫",
  "惩罚|chéng fá|⚖️", "乘车|chéng chē|🚌", "澄清|chéng qīng|💧", "呈现|chéng xiàn|🎁",
  "塑料|sù liào|🛍️", "塑造|sù zào|🗿", "溯源|sù yuán|🌊", "似乎|sì hū|🤔",
  "档案|dàng àn|🗂️", "阻挡|zǔ dǎng|✋", "逮捕|dài bǔ|🚓", "拘捕|jū bǔ|🔒",
  "记载|jì zǎi|📝", "下载|xià zǎi|⬇️", "怨声载道|yuàn shēng zài dào|🗣️", "混淆|hùn xiáo|🌪️",
  "比较|bǐ jiào|⚖️", "发酵|fā jiào|🍞", "酵母|jiào mǔ|🦠", "咆哮|páo xiào|🦁",
  "呼啸|hū xiào|🌪️", "细胞|xì bāo|🔬", "同胞|tóng bāo|👬", "拥抱|yōng bào|🤗",
  "抱怨|bào yuàn|😒", "报复|bào fù|😠", "抱负|bào fù|🎯", "胸怀|xiōng huái|💗",
  "汹涌|xiōng yǒng|🌊", "凶狠|xiōng hěn|🐺", "虚伪|xū wěi|🎭", "枯萎|kū wěi|🥀",
  "推诿|tuī wěi|🚫", "虽然|suī rán|🤷", "遂心|suì xīn|❤️", "深邃|shēn suì|🕳️",
  "隧道|suì dào|🚇", "纯粹|chún cuì|💎", "憔悴|qiáo cuì|🥀", "粉碎|fěn suì|💥",
  "猝死|cù sǐ|💀", "荟萃|huì cuì|🌟", "悲怆|bēi chuàng|😭", "创伤|chuāng shāng|🤕",
  "创造|chuàng zào|🛠️", "仓促|cāng cù|🏃", "沧桑|cāng sāng|🕰️", "苍茫|cāng máng|🌫️",
  "隐藏|yǐn cáng|🙈", "蕴藏|yùn cáng|📦", "宝藏|bǎo zàng|💎", "西藏|xī zàng|🏔️",
  "提供|tí gōng|🤲", "供认|gòng rèn|🗣️", "供给|gōng jǐ|📦", "口供|kǒu gòng|📜",
  "即使|jí shǐ|🤔", "既然|jì rán|🤷", "即刻|jí kè|⚡", "既而|jì ér|➡️",
  "针灸|zhēn jiǔ|🪡", "咎由自取|jiù yóu zì qǔ|🤦", "内疚|nèi jiù|😔", "究竟|jiū jìng|🔍",
  "狙击|jū jī|🔫", "沮丧|jǔ sàng|😞", "阻击|zǔ jī|🛡️", "咀嚼|jǔ jué|👄",
  "编纂|biān zuǎn|✍️", "篡改|cuàn gǎi|📝", "赚钱|zhuàn qián|💰", "嫌怨|xián yuàn|😒",
  "谦虚|qiān xū|🙇", "歉意|qiàn yì|🙏", "赚钱|zhuàn qián|💰", "廉洁|lián jié|💎",
  "竣工|jùn gōng|🏗️", "严峻|yán jùn|😠", "险峻|xiǎn jùn|⛰️", "俊俏|jùn qiào|✨",
  // 平翘舌音易混淆
  "自私|zì sī|😒", "纯粹|chún cuì|💎", "阻碍|zǔ ài|⛔", "杂乱|zá luàn|🗑️",
  "振奋|zhèn fèn|💪", "证实|zhèng shí|✅", "挖掘|wā jué|⛏️", "主张|zhǔ zhāng|📣",
  "辞职|cí zhí|📋", "措施|cuò shī|🛠️", "厨师|chú shī|👨‍🍳", "充沛|chōng pèi|🔋",
  "丝毫|sī háo|🔬", "手势|shǒu shì|🤚", "说服|shuō fú|🗣️", "梳头|shū tóu|💇",
  // 前后鼻音易混淆
  "辨别|biàn bié|🔍", "标兵|biāo bīng|🎖️", "芬芳|fēn fāng|🌸", "风波|fēng bō|🌊",
  // n/l混淆
  "内幕|nèi mù|🎭", "流畅|liú chàng|🌊", "弄巧|nòng qiǎo|🤹", "领悟|lǐng wù|💡",
  // 易错多音字（来自易错题库）
  "掂量|diān liang|⚖️", "嫉妒|jí dù|😤", "慰藉|wèi jiè|🙏", "连累|lián lěi|😢",
  "给予|jǐ yǔ|🤲", "畸形|jī xíng|🏥", "标识|biāo zhì|🏷️", "一模一样|yì mú yí yàng|🪞",
  "参差不齐|cēn cī bù qí|〰️", "呕心沥血|ǒu xīn lì xuè|❤️", "一曝十寒|yī pù shí hán|🌡️",
  "大腹便便|dà fù pián pián|🤰", "心宽体胖|xīn kuān tǐ pán|😌",
  "翘首|qiáo shǒu|👀", "奇葩|qī pā|🌺", "挑剔|tiāo tī|🔍", "字帖|zì tiè|📄",
  "笨拙|bèn zhuō|🐢", "洁癖|jié pǐ|✨", "泯灭|mǐn miè|💔", "宁静|níng jìng|🤫",
  "参差|cēn cī|〰️", "埋怨|mán yuàn|😒", "混水摸鱼|hún shuǐ mō yú|🐟",
  "翻天覆地|fān tiān fù dì|🌍", "牵强附会|qiǎn qiǎng fù huì|🔗"
];

// 六年级
const grade6Data = [
  "按捺|àn nà|✋", "阻挠|zǔ náo|⛔", "妖娆|yāo ráo|💃", "绕道|rào dào|↪️",
  "静谧|jìng mì|🤫", "分泌|fēn mì|💦", "甜蜜|tián mì|🍯", "风靡|fēng mǐ|🌪️",
  "萎靡|wěi mǐ|🥀", "奢靡|shē mí|💎", "蓓蕾|bèi lěi|🌷", "烘焙|hōng bèi|🥐",
  "陪伴|péi bàn|🤝", "培养|péi yǎng|🌱", "蕴含|yùn hán|📦", "酝酿|yùn niàng|🍷",
  "晕眩|yūn xuàn|💫", "炫耀|xuàn yào|✨", "渲染|xuàn rǎn|🎨", "寒暄|hán xuān|🗣️",
  "喧哗|xuān huá|📢", "唾弃|tuò qì|💦", "沉睡|chén shuì|😴", "锤炼|chuí liàn|🔨",
  "瞻仰|zhān yǎng|👀", "屋檐|wū yán|🏠", "蟾蜍|chán chú|🐸", "谵语|zhān yǔ|🗣️",
  "睿智|ruì zhì|🧠", "深邃|shēn suì|🕳️", "隧道|suì dào|🚇", "荟萃|huì cuì|🌟",
  "纯粹|chún cuì|💎", "憔悴|qiáo cuì|🥀", "粉碎|fěn suì|💥", "猝死|cù sǐ|💀",
  "诡谲|guǐ jué|🎭", "决断|jué duàn|⚖️", "咀嚼|jǔ jué|👄", "倒嚼|dǎo jiào|🐄",
  "咬文嚼字|yǎo wén jiáo zì|📖", "倔强|jué jiàng|😤", "挖掘|wā jué|⛏️", "孑然|jié rán|👤",
  "果决|guǒ jué|⚡", "抉择|jué zé|🤔", "联袂|lián mèi|🤝", "诀别|jué bié|👋",
  "魅力|mèi lì|✨", "鬼魅|guǐ mèi|👻", "精湛|jīng zhàn|🛠️", "甚至|shèn zhì|❗",
  "斟酌|zhēn zhuó|🍷", "勘探|kān tàn|🔍", "不堪|bù kān|😫", "难堪|nán kān|😳",
  "粗糙|cū cāo|🧱", "创造|chuàng zào|🛠️", "焦躁|jiāo zào|😤", "暴躁|bào zào|😡",
  "噪音|zào yīn|📢", "干燥|gān zào|🏜️", "洗澡|xǐ zǎo|🛁", "体操|tǐ cāo|🤸",
  "召开|zhào kāi|📢", "照耀|zhào yào|☀️", "预兆|yù zhào|🔮", "肇事|zhào shì|💥",
  "沼泽|zhǎo zé|🐊", "诏书|zhào shū|📜", "卓越|zhuó yuè|🌟", "着陆|zhuó lù|🛬",
  "着凉|zháo liáng|🤧", "着急|zháo jí|😰", "高着|gāo zhāo|✨", "顺着|shùn zhe|🚶",
  "附和|fù hè|🗣️", "和好|hé hǎo|🤝", "和面|huó miàn|🥟", "和牌|hú pái|🀄",
  "掺和|chān huo|🌪️", "和睦|hé mù|👨‍👩‍👧‍👦", "暖和|nuǎn huo|☀️", "和平|hé píng|🕊️",
  "针砭|zhēn biān|🪡", "贬低|biǎn dī|📉", "眨眼|zhǎ yǎn|😉", "缺乏|quē fá|😫",
  "惩戒|chéng jiè|⚖️", "驰骋|chí chěng|🐎", "聘请|pìn qǐng|🤝", "寒碜|hán chen|🥶",
  "炽热|chì rè|🔥", "交织|jiāo zhī|🕸️", "旗帜|qí zhì|🚩", "识别|shí bié|👁️",
  "憧憬|chōng jǐng|💭", "瞳孔|tóng kǒng|👁️", "撞击|zhuàng jī|💥", "幢幢|chuáng chuáng|👻",
  "鬼鬼祟祟|guǐ guǐ suì suì|👻", "作祟|zuò suì|👻", "崇高|chóng gāo|🏔️", "崇拜|chóng bài|🙏",
  "颠簸|diān bǒ|🌊", "巅峰|diān fēng|🏔️", "癫痫|diān xián|🏥", "大腹便便|dà fù pián pián|🤰",
  // 平翘舌音易混淆
  "遵从|zūn cóng|📜", "字符|zì fú|🔤", "组织|zǔ zhī|🧶", "综合|zōng hé|📊",
  "忠诚|zhōng chéng|❤️", "治疗|zhì liáo|🏥", "主导|zhǔ dǎo|🎬", "质量|zhì liàng|💯",
  "搏击|cá jī|👏", "残局|cán jú|♟️", "源泉|yuán quán|💧", "购买|gòu mǎi|🛒",
  "撵取|sōng qǔ|📦", "缩小|suō xiǎo|🔍", "梦想|mèng xiǎng|💭", "颂扬|sòng yáng|🎤",
  // 前后鼻音易混淆
  "芬达|fēn dá|🌸", "风光|fēng guāng|☀️", "辰光|chén guāng|🌅", "沉没|chén mò|🌊",
  // n/l混淆
  "弄虞作假|nòng xū zuò jiǎ|🎭", "流离失所|liú lí shī suǒ|😢", "泥泊|ní pō|💧", "理论|lǐ lùn|📚",
  // 高年级易错题库精选（多音字·成语·专有名词）
  "揣摩|chuǎi mó|🤔", "刽子手|guì zǐ shǒu|⚔️", "友谊|yǒu yì|🤝",
  "通缉|tōng jī|🚓", "投奔|tóu bèn|🏃", "蹊跷|qī qiāo|🤨",
  "压轴|yā zhòu|🎭", "混水摸鱼|hún shuǐ mō yú|🐟", "一哄而散|yī hòng ér sàn|🏃",
  "汗流浃背|hàn liú jiā bèi|💦", "龟裂|jūn liè|🏜️", "揩油|kāi yóu|😏",
  "框架|kuàng jià|🏗️", "埋怨|mán yuàn|😒", "泯灭|mǐn miè|💔",
  "莘莘学子|shēn shēn xué zǐ|👨‍🎓", "吞噬|tūn shì|🌑", "徇私|xùn sī|⚖️",
  "自怨自艾|zì yuàn zì yì|😞", "号啕大哭|háo táo dà kū|😭", "引吭高歌|yǐn háng gāo gē|🎤",
  "打烊|dǎ yàng|🔒", "执拗|zhí niù|😤", "薄荷|bò he|🌿",
  "可恶|kě wù|😡", "倾轧|qīng yà|⚙️", "殷实|yīn shí|💰", "番茄|fān qié|🍅",
  "扒手|pá shǒu|🧤", "屏气|bǐng qì|🫁", "弄堂|lòng táng|🏘️", "暴露|bào lù|👁️",
  "湖泊|hú pō|🏞️", "思量|sī liáng|💭", "纷至沓来|fēn zhì tà lái|🌊", "曝光|bào guāng|📸",
  "不省人事|bù xǐng rén shì|😵", "垂头丧气|chuí tóu sàng qì|😞", "挣扎|zhēng zhá|💪",
  "传记|zhuàn jì|📖", "涨红|zhàng hóng|😳", "冠冕堂皇|guān miǎn táng huáng|👑",
  "没收|mò shōu|🚫", "恐吓|kǒng hè|😱", "空闲|kòng xián|😌", "朝气|zhāo qì|☀️",
  "句读|jù dòu|📖", "骨髓|gǔ suǐ|🦴", "单于|chán yú|🗡️", "吐蕃|tǔ bō|🏔️",
  "复辟|fù bì|👑", "巷道|hàng dào|⛏️", "星宿|xīng xiù|⭐",
  "附和|fù hè|🗣️", "度德量力|duó dé liàng lì|⚖️", "大腹便便|dà fù pián pián|🤰",
  "参差不齐|cēn cī bù qí|〰️", "和稀泥|huò xī ní|🌊", "引吭高歌|yǐn háng gāo gē|🎤"
];

const parseWords = (rawData: string[]): Word[] => {
  return rawData.map((item, i) => {
    const [hanzi, pinyin, emoji] = item.split('|');
    return { id: String(i + 1), hanzi, pinyin, emoji };
  });
};

export const wordsByGrade: Record<number, Word[]> = {
  1: parseWords(grade1Data),
  2: parseWords(grade2Data),
  3: parseWords(grade3Data),
  4: parseWords(grade4Data),
  5: parseWords(grade5Data),
  6: parseWords(grade6Data),
};

export const getWordsByGrade = (grade: number): Word[] => {
  return wordsByGrade[grade] || wordsByGrade[1];
};
