# GitHub Pages 部署指南

## 方法1：直接在GitHub仓库设置

1. 创建新的GitHub仓库（例如：`escort-config-tool`）
2. 上传 `web-config` 文件夹中的所有文件到仓库根目录
3. 进入仓库的 Settings → Pages
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main` 分支，目录选择 `/ (root)`
6. 点击 Save
7. 等待几分钟后访问 `https://你的用户名.github.io/仓库名/`

## 方法2：使用GitHub Desktop

1. 打开GitHub Desktop
2. File → New Repository
3. 填写仓库名称（例如：`escort-config-tool`）
4. 选择本地路径
5. Create Repository
6. 将 `web-config` 文件夹中的文件复制到仓库文件夹
7. Commit to main
8. Publish repository
9. 在GitHub网站上启用Pages（参考方法1步骤3-7）

## 方法3：命令行（适合开发者）

```bash
# 创建新仓库
git init
git add .
git commit -m "Initial commit"

# 关联到GitHub
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main

# 然后在GitHub网站启用Pages
```

## 自定义域名（可选）

如果你有自己的域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容写入你的域名（例如：`config.yourdomain.com`）
3. 在你的域名DNS设置中添加CNAME记录指向 `你的用户名.github.io`

## 更新网站

只需：
1. 修改文件
2. Git commit
3. Git push

GitHub Pages会自动重新部署。

## 注意事项

- GitHub Pages 是完全公开的
- 免费用户有每月100GB的流量限制
- 构建时间通常在1-5分钟
- 支持自定义404页面
- 建议启用HTTPS（Settings → Pages → Enforce HTTPS）

## 测试本地效果

部署前想在本地测试？

### 简单方法（推荐）
直接双击 `index.html` 用浏览器打开即可

### 使用本地服务器
如果遇到CORS问题，可以使用本地服务器：

**Python:**
```bash
cd web-config
python -m http.server 8000
# 访问 http://localhost:8000
```

**Node.js:**
```bash
npx http-server web-config
# 访问 http://localhost:8080
```

**VSCode:**
安装 "Live Server" 扩展，右键点击 `index.html` → "Open with Live Server"

## 示例仓库结构

```
你的仓库/
├── index.html          (必需)
├── style.css           (必需)
├── script.js           (必需)
├── README.md           (推荐)
├── DEPLOY.md           (可选)
└── .gitignore          (可选)
```

## 成功部署后

分享你的配置工具链接给其他玩家！
例如：`https://yourusername.github.io/escort-config-tool/`

他们可以直接在浏览器中使用，无需下载任何东西。

