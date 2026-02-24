import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const apiKey = envConfig.ALIYUN_API_KEY;

if (!apiKey || apiKey.includes('你的_阿里云百炼_API_KEY')) {
    console.error("❌ 错误: Aliyun API Key 未正确配置！请检查 .env.local 文件。");
    process.exit(1);
}

console.log("✅ 成功读取 API Key，开始请求阿里云百炼接口...");

const prompt = `
  以下是一个学生的拼音错题记录统计：
  平舌音/翘舌音混淆: 错了 2 次
  
  具体的错题细节：
  书本 (shū běn) 错选为 sū běn, 椅子 (yǐ zi) 错选为 yǐ zhi

  请根据这些错题，分析学生的不足之处，并给出具体、生动、适合一年级小朋友理解的学习建议。
`;

async function testApi() {
    try {
        const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'qwen-plus',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的小学语文老师，专门教一年级学生拼音。语气要充满元气、活泼、鼓励、亲切。使用Markdown格式，可以使用emoji。'
                    },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`请求失败，状态码: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        console.log("\n🎉 AI 回复测试成功:\n");
        console.log("=====================================");
        console.log(text);
        console.log("=====================================\n");
        console.log("✨ 恭喜！你的 API Key 测试通过！可以在浏览器中愉快地使用了。");
    } catch (error) {
        console.error("\n❌ API 请求报错:", error);
    }
}

testApi();
