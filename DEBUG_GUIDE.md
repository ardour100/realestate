# Next.js 后端 API 调试指南

本文档详细说明如何调试 Next.js 后端 API 路由，以 `app/api/auth/register/route.ts` 为例。

---

## 📋 目录

1. [理解后端代码执行位置](#理解后端代码执行位置)
2. [方法一：Console.log 调试](#方法一consolelog-调试)
3. [方法二：VS Code 断点调试](#方法二vs-code-断点调试)
4. [方法三：使用调试工具](#方法三使用调试工具)
5. [方法四：API 测试工具](#方法四api-测试工具)
6. [常见问题排查](#常见问题排查)

---

## 🎯 理解后端代码执行位置

### 关键概念

```
┌─────────────────┐
│   浏览器 Chrome  │  ← 前端代码运行在这里
└────────┬────────┘
         │ HTTP 请求
         ↓
┌─────────────────┐
│  Next.js 服务器 │  ← 后端代码运行在这里！
│  (Node.js 进程) │
└─────────────────┘
```

**重要**：
- ❌ Chrome DevTools **看不到**后端代码执行
- ✅ 后端代码在 **Node.js 进程**中运行
- ✅ 需要在**终端**或 **VS Code** 中调试

---

## 方法一：Console.log 调试

### 最简单、最常用的方法

#### 步骤 1：在代码中添加 console.log

打开 `app/api/auth/register/route.ts`，添加日志：

```typescript
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log('========================================')
  console.log('📥 注册 API 被调用了！')
  console.log('时间:', new Date().toISOString())
  console.log('========================================')

  try {
    // 1️⃣ 解析请求体
    const body = await req.json()
    console.log('📦 收到的请求数据:', body)

    const { email, password, name } = body
    console.log('📧 邮箱:', email)
    console.log('👤 用户名:', name)
    console.log('🔑 密码长度:', password?.length)

    // 2️⃣ 验证必填字段
    if (!email || !password) {
      console.log('❌ 验证失败：缺少必填字段')
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // 3️⃣ 检查用户是否存在
    console.log('🔍 检查用户是否已存在...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ 用户已存在:', existingUser.email)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }
    console.log('✅ 用户不存在，可以注册')

    // 4️⃣ 加密密码
    console.log('🔐 开始加密密码...')
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('✅ 密码加密完成，hash 长度:', hashedPassword.length)

    // 5️⃣ 创建用户
    console.log('💾 开始创建用户...')
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    })
    console.log('✅ 用户创建成功！ID:', user.id)

    // 6️⃣ 返回结果
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
    console.log('📤 返回响应:', response)
    console.log('========================================\n')

    return NextResponse.json(response)

  } catch (error) {
    console.log('========================================')
    console.error('💥 发生错误！')
    console.error('错误类型:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('错误信息:', error instanceof Error ? error.message : error)
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息')
    console.log('========================================\n')

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
```

#### 步骤 2：查看终端输出

当 Next.js 服务器运行时（`npm run dev`），日志会输出到**终端**：

```bash
# 终端窗口
$ npm run dev

> realestate@0.1.0 dev
> next dev

   ▲ Next.js 16.0.8
   - Local:        http://localhost:3000

========================================
📥 注册 API 被调用了！
时间: 2024-12-09T10:30:45.123Z
========================================
📦 收到的请求数据: { email: 'test@example.com', password: '123456', name: 'Test User' }
📧 邮箱: test@example.com
👤 用户名: Test User
🔑 密码长度: 6
🔍 检查用户是否已存在...
✅ 用户不存在，可以注册
🔐 开始加密密码...
✅ 密码加密完成，hash 长度: 60
💾 开始创建用户...
✅ 用户创建成功！ID: clxyz123abc
📤 返回响应: { user: { id: 'clxyz123abc', email: 'test@example.com', name: 'Test User' } }
========================================
```

#### 步骤 3：触发 API 请求

**方法 A：使用前端表单**

如果你有注册表单页面，直接填写提交即可。

**方法 B：使用浏览器控制台**

在 Chrome DevTools Console 中执行：

```javascript
// 在浏览器控制台中执行
fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: '123456',
    name: 'Test User'
  })
})
.then(res => res.json())
.then(data => console.log('响应:', data))
.catch(err => console.error('错误:', err))
```

**方法 C：使用 curl**

在另一个终端窗口执行：

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "name": "Test User"
  }'
```

---

## 方法二：VS Code 断点调试

### 使用断点暂停代码执行，逐行检查

#### 步骤 1：创建调试配置

在项目根目录创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

#### 步骤 2：设置断点

1. 在 VS Code 中打开 `app/api/auth/register/route.ts`
2. 点击行号左侧，添加红色断点：

```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json()  // ← 点击这里设置断点

    const { email, password, name } = body  // ← 或这里

    if (!email || !password) {  // ← 或这里
      return NextResponse.json(/* ... */)
    }

    // ... 更多断点
  }
}
```

#### 步骤 3：启动调试

1. 按 `F5` 或点击 "Run and Debug"
2. 选择 "Next.js: debug server-side"
3. 等待服务器启动

#### 步骤 4：触发请求

使用浏览器或 curl 发送请求到 `/api/auth/register`

#### 步骤 5：调试操作

当代码执行到断点时，VS Code 会暂停：

```
📍 调试面板功能：

┌─────────────────────────────────┐
│  变量 (Variables)                │  ← 查看所有变量的值
│  - body: { email: "...", ... }  │
│  - email: "test@example.com"    │
│  - password: "123456"            │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  监视 (Watch)                    │  ← 添加表达式监视
│  + body.email                    │
│  + password.length               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  调用堆栈 (Call Stack)           │  ← 查看函数调用链
│  - POST                          │
│  - handler                       │
└─────────────────────────────────┘
```

**控制按钮：**
- `F10` / `Step Over` - 单步跳过（下一行）
- `F11` / `Step Into` - 单步进入（进入函数内部）
- `Shift+F11` / `Step Out` - 跳出当前函数
- `F5` / `Continue` - 继续执行到下一个断点

---

## 方法三：使用调试工具

### 使用专业的日志库

#### 安装 debug 包

```bash
npm install debug
```

#### 使用方法

```typescript
import debug from 'debug'

// 创建调试器
const log = debug('api:auth:register')
const error = debug('api:auth:register:error')

export async function POST(req: Request) {
  log('注册请求开始')

  try {
    const body = await req.json()
    log('请求体:', body)

    // ... 业务逻辑

    log('用户创建成功')
    return NextResponse.json({ user })

  } catch (err) {
    error('创建用户失败:', err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
```

#### 启动时启用日志

```bash
# 启用所有日志
DEBUG=* npm run dev

# 只启用 auth 相关日志
DEBUG=api:auth:* npm run dev

# 只启用注册日志
DEBUG=api:auth:register npm run dev
```

---

## 方法四：API 测试工具

### 使用 Postman 或 Thunder Client

#### Thunder Client (VS Code 插件)

1. 安装 Thunder Client 插件
2. 创建新请求：

```
方法: POST
URL: http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "test@example.com",
  "password": "123456",
  "name": "Test User"
}
```

3. 点击 "Send"
4. 查看响应

#### 保存为测试集合

创建 `thunder-tests/thunderclient.json`：

```json
{
  "client": "Thunder Client",
  "collectionName": "Real Estate API",
  "requests": [
    {
      "name": "注册用户",
      "method": "POST",
      "url": "http://localhost:3000/api/auth/register",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "type": "json",
        "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\",\n  \"name\": \"Test User\"\n}"
      }
    }
  ]
}
```

---

## 🔍 常见问题排查

### 问题 1：console.log 没有输出

**原因**：可能在看错地方

✅ **正确位置**：运行 `npm run dev` 的**终端窗口**
❌ **错误位置**：Chrome DevTools Console

**验证方法**：
```typescript
export async function POST(req: Request) {
  console.log('='.repeat(50))
  console.log('如果你能看到这行，说明代码执行了！')
  console.log('='.repeat(50))
  // ...
}
```

---

### 问题 2：修改代码后没有生效

**原因**：文件没有保存或热重载失败

**解决方法**：
1. 确保文件已保存（VS Code 标签页没有 ●）
2. 查看终端是否显示 `compiled successfully`
3. 如果没有，重启服务器：
   ```bash
   # 终端中按 Ctrl+C 停止
   # 然后重新运行
   npm run dev
   ```

---

### 问题 3：API 返回 404

**原因**：路由路径不正确

**检查清单**：
- ✅ 文件位置：`app/api/auth/register/route.ts`
- ✅ 请求 URL：`POST /api/auth/register`
- ✅ 导出函数：`export async function POST(req: Request)`

---

### 问题 4：断点不触发

**原因**：
1. 没有使用调试模式启动
2. 断点位置不对（在注释或空行）
3. 代码没有执行到那里

**解决方法**：
1. 使用 `F5` 启动调试，不是 `npm run dev`
2. 在有代码的行设置断点
3. 添加 `console.log` 确认代码执行路径

---

### 问题 5：数据库错误

**错误信息示例**：
```
PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation
```

**调试步骤**：

```typescript
export async function POST(req: Request) {
  try {
    console.log('1️⃣ 准备创建用户...')
    console.log('数据:', { email, password: hashedPassword, name })

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    })

    console.log('2️⃣ 用户创建成功:', user)

  } catch (error) {
    console.error('💥 Prisma 错误详情:')
    console.error('错误代码:', (error as any).code)
    console.error('错误信息:', (error as any).message)
    console.error('元数据:', (error as any).meta)
    throw error
  }
}
```

---

## 📊 调试方法对比

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Console.log | 简单快速 | 输出多了会乱 | 快速检查变量 |
| VS Code 断点 | 可以暂停代码 | 需要配置 | 复杂逻辑排查 |
| Debug 包 | 可控制日志开关 | 需要安装依赖 | 生产环境调试 |
| API 工具 | 可重复测试 | 需要额外工具 | API 接口测试 |

---

## 🎯 推荐调试流程

### 初学者流程

1. **添加 console.log** - 快速查看变量
2. **使用 Thunder Client** - 测试 API
3. **查看终端日志** - 确认执行流程

### 进阶流程

1. **设置 VS Code 断点** - 精确定位问题
2. **使用 Watch 监视变量** - 观察数据变化
3. **查看 Call Stack** - 理解调用链

---

## 💡 调试技巧

### 技巧 1：使用 emoji 区分日志

```typescript
console.log('🚀 开始处理')
console.log('📦 数据:', data)
console.log('✅ 成功')
console.log('❌ 失败')
console.log('⚠️ 警告')
console.log('💾 数据库操作')
console.log('🔐 加密操作')
```

### 技巧 2：使用分隔线

```typescript
console.log('\n' + '='.repeat(50))
console.log('  注册 API 调试信息')
console.log('='.repeat(50) + '\n')
```

### 技巧 3：JSON 美化输出

```typescript
console.log('用户数据:', JSON.stringify(user, null, 2))
```

输出：
```json
用户数据: {
  "id": "abc123",
  "email": "test@example.com",
  "name": "Test User"
}
```

### 技巧 4：计时器

```typescript
console.time('数据库查询')
const user = await prisma.user.findUnique({ where: { email } })
console.timeEnd('数据库查询')
// 输出：数据库查询: 15.234ms
```

---

## 📝 总结

**记住关键点：**
1. 后端代码运行在 **Node.js**，不在浏览器
2. 日志输出在**运行 npm run dev 的终端**
3. Chrome DevTools **看不到**后端日志
4. VS Code 断点调试需要用 **F5 启动**
5. 修改代码后确保**文件已保存**

**推荐工作流：**
```
开发 → 添加 console.log → 保存文件 → 测试 API → 查看终端日志 → 修复问题
```

现在你可以轻松调试后端 API 了！🎉
