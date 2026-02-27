# 猫咪养成系统参数调整指南

这套猫咪养成系统的数值散布在 3 个核心文件中。你可以根据需求，通过修改以下文件中的对应数字来调整游戏的难度和物价。

修改完毕后，由于 `npm run dev` 正在运行，**保存文件后刷新浏览器即可直接在游戏内生效！**

---

## 1. 调整“商店物价”与“回复效果”
文件所在位置： **`src/components/CatHome.tsx`**

### 修改物品价格
在文件的底部（大约 206 行附近），找到 `<ShopItem>` 组件的调用。你可以直接修改 `cost` 属性和界面显示的数字：

```tsx
// 比如想把高级猫粮降价到 10 积分：
<ShopItem 
    name="高级猫粮" 
    desc="恢复 30 点饥饿度" 
    cost={10} // <-- 修改这里的实际扣款金额
    icon="🐟" 
    onBuy={() => handleBuy('food', 10)} // <-- 同步修改这里传递给函数的扣除数字
    canAfford={score >= 10} // <-- 修改这里的判断条件
/>
// 同理，玩具 (toy) 和 特效药 (medicine) 也在下方，遵循一样的修改规则。
```

### 修改使用道具后的回复量
在文件约 39 行的 `handleUse` 函数中：

```tsx
// 找到 action === 'feed' (喂食逻辑)
cat: { ...prev.cat, hunger: Math.min(100, prev.cat.hunger + 30) } 
// 这里的 + 30 就是每次喂食恢复的饥饿度，最高不超过 100。想要食物更顶饿，可以改成 + 50。

// 找到 action === 'play' (玩耍逻辑)
cat: { ...prev.cat, happiness: Math.min(100, prev.cat.happiness + 30) }
// 这里的 + 30 是每次玩耍恢复的心情值。
```

---

## 2. 调整“离线扣血速度 / 饥饿速度”
文件所在位置： **`src/store.ts`**

在文件的最底部，找到 `calculateOfflineProgress` 函数（大约 100 行以后），这里控制着时间流逝的心跳逻辑：

```typescript
// 基于现实时间（小时）的衰减速度
const HUNGER_DECAY_PER_HOUR = 3;    // 猫咪每小时掉 3 点饥饿度（每天掉 72 点大半管血）
const HAPPINESS_DECAY_PER_HOUR = 2; // 猫咪每小时掉 2 点心情值

// 如果你想让猫咪更不容易死/饿，可以把数字调小：
// const HUNGER_DECAY_PER_HOUR = 1;

// 生病判定逻辑
const HEALTH_DECAY_PER_HOUR = 2; // 当处于极限饥饿或极度无聊时，每小时额外掉 2 点健康值
if (newHealth < 40 && Math.random() < 0.5) {
    isSick = true; // 健康值低于 40 时，有 50% 概率生病
}
// 你可以通过修改 40 这个阈值，或者 0.5 (50%) 的概率，来决定猫咪有多容易生病。
```

---

## 3. 调整“成长速度”与“答题奖励”
文件所在位置： **`src/components/PlayMode.tsx`**

### 猫咪的成长速度（目前：50 题长 1 个月）
在文件下方的 `handleCorrectAnswer` 处理模块中（大约 240 行附近）：

```tsx
// 寻找如下代码：
if (newCorrectCount % 50 === 0 && newAge < 12) {
    newAge += 1;
}
// 将 `50` 改成你期望的数字。比如每答对 20 题就长大一个月：
// if (newCorrectCount % 20 === 0 && newAge < 12) { ... }
```

### 每题奖励多少积分？
同样在该文件这段代码里：
```tsx
const newScore = prev.score + 1; // 当前是加 1 分。改成 + 2 就是每答对一题两分
```

**以上就是所有的核心参数！在您专属的 VSCode 或代码编辑器中打开对应的路径修改并保存，随时打造你觉得最完美的猫咪经济闭环！**
