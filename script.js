// 全局配置对象
let config = {
    escortName: "护航",
    dialogueMode: "sequential",
    dialogueInterval: -1,
    enableAffectionSystem: true,
    recruitDialogues: {
        surrenderText: "壮士饶命",
        option1: "好性感的身材..不如？",
        option2: "吃大份去吧。",
        acceptedText: "谢谢老板不杀之恩，我愿追随左右！",
        rejectedText: "再无话说，请速动手。"
    },
    feedbackDialogues: {
        noMoreDialogues: "好像没什么好说的了...",
        maxAffectionText: "我好爱你，我真的好爱你。",
        betrayalEscortText: "往日种种，你说的可是往日种种...",
        betrayalPlayerText: "护航我儿，为何反我！",
        killedBetrayerText: "真是一对苦命鸳鸯啊。。。",
        escortDeathText: "不！！！！！",
        escortDeathOption1: "我还想继续",
        escortDeathOption2: "我心已被夺去，此生或再无悲喜。"
    },
    dialogueZones: []
};

// 当前编辑的区间和对话索引
let currentZoneIndex = -1;
let currentDialogueIndex = -1;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeFormListeners();
    loadDefaultConfig();
    updatePreview();
});

// 标签页切换
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            if (tabName === 'preview') {
                updatePreview();
            }
        });
    });
}

// 初始化表单监听
function initializeFormListeners() {
    // 基础设置
    document.getElementById('escortName').addEventListener('input', (e) => {
        config.escortName = e.target.value;
    });
    
    document.getElementById('dialogueMode').addEventListener('change', (e) => {
        config.dialogueMode = e.target.value;
    });
    
    document.getElementById('dialogueInterval').addEventListener('input', (e) => {
        config.dialogueInterval = parseInt(e.target.value);
    });
    
    document.getElementById('enableAffectionSystem').addEventListener('change', (e) => {
        config.enableAffectionSystem = e.target.checked;
    });

    // 招降对话
    document.getElementById('surrenderText').addEventListener('input', (e) => {
        config.recruitDialogues.surrenderText = e.target.value;
    });
    
    document.getElementById('recruitOption1').addEventListener('input', (e) => {
        config.recruitDialogues.option1 = e.target.value;
    });
    
    document.getElementById('recruitOption2').addEventListener('input', (e) => {
        config.recruitDialogues.option2 = e.target.value;
    });
    
    document.getElementById('acceptedText').addEventListener('input', (e) => {
        config.recruitDialogues.acceptedText = e.target.value;
    });
    
    document.getElementById('rejectedText').addEventListener('input', (e) => {
        config.recruitDialogues.rejectedText = e.target.value;
    });

    // 特殊对话
    document.getElementById('escortDeathText').addEventListener('input', (e) => {
        config.feedbackDialogues.escortDeathText = e.target.value;
    });
    
    document.getElementById('escortDeathOption1').addEventListener('input', (e) => {
        config.feedbackDialogues.escortDeathOption1 = e.target.value;
    });
    
    document.getElementById('escortDeathOption2').addEventListener('input', (e) => {
        config.feedbackDialogues.escortDeathOption2 = e.target.value;
    });
    
    document.getElementById('noMoreDialogues').addEventListener('input', (e) => {
        config.feedbackDialogues.noMoreDialogues = e.target.value;
    });
    
    document.getElementById('maxAffectionText').addEventListener('input', (e) => {
        config.feedbackDialogues.maxAffectionText = e.target.value;
    });
    
    document.getElementById('betrayalEscortText').addEventListener('input', (e) => {
        config.feedbackDialogues.betrayalEscortText = e.target.value;
    });
    
    document.getElementById('betrayalPlayerText').addEventListener('input', (e) => {
        config.feedbackDialogues.betrayalPlayerText = e.target.value;
    });
    
    document.getElementById('killedBetrayerText').addEventListener('input', (e) => {
        config.feedbackDialogues.killedBetrayerText = e.target.value;
    });
}

// 加载默认配置
function loadDefaultConfig() {
    renderZonesList();
}

// 添加对话区间
function addZone() {
    const zone = {
        minAffection: 0,
        maxAffection: 100,
        mode: "sequential",
        dialogues: []
    };
    
    config.dialogueZones.push(zone);
    renderZonesList();
    editZone(config.dialogueZones.length - 1);
}

// 渲染区间列表
function renderZonesList() {
    const zonesList = document.getElementById('zonesList');
    
    if (config.dialogueZones.length === 0) {
        zonesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无对话区间，点击"添加区间"开始创建</p>';
        return;
    }
    
    zonesList.innerHTML = config.dialogueZones.map((zone, index) => `
        <div class="zone-card">
            <div class="zone-card-header">
                <div class="zone-card-title">
                    区间 ${index + 1}: 好感度 ${zone.minAffection} ~ ${zone.maxAffection}
                    <span class="tag">${zone.mode === 'sequential' ? '顺序' : '随机'}</span>
                    <span class="tag tag-success">${zone.dialogues.length} 个对话</span>
                </div>
                <div class="zone-card-actions">
                    <button class="btn btn-primary" onclick="editZone(${index})">编辑</button>
                    <button class="btn btn-danger" onclick="deleteZone(${index})">删除</button>
                </div>
            </div>
            <div class="zone-card-info">
                ${zone.dialogues.length === 0 ? '还没有添加对话' : `包含 ${zone.dialogues.filter(d => d.type === 'short').length} 个短对话和 ${zone.dialogues.filter(d => d.type === 'long').length} 个长对话`}
            </div>
        </div>
    `).join('');
}

// 编辑区间
function editZone(index) {
    currentZoneIndex = index;
    const zone = config.dialogueZones[index];
    
    const editor = document.getElementById('dialogueEditor');
    const content = document.getElementById('dialogueEditorContent');
    
    editor.style.display = 'block';
    editor.scrollIntoView({ behavior: 'smooth' });
    
    content.innerHTML = `
        <div class="form-group">
            <button class="btn btn-secondary" onclick="closeZoneEditor()">← 返回列表</button>
        </div>
        
        <h3>区间设置</h3>
        
        <div class="form-group">
            <label>最小好感度</label>
            <input type="number" id="zoneMinAffection" value="${zone.minAffection}" min="0" max="100">
        </div>
        
        <div class="form-group">
            <label>最大好感度</label>
            <input type="number" id="zoneMaxAffection" value="${zone.maxAffection}" min="0" max="100">
        </div>
        
        <div class="form-group">
            <label>播放模式</label>
            <select id="zoneMode">
                <option value="sequential" ${zone.mode === 'sequential' ? 'selected' : ''}>顺序播放</option>
                <option value="random" ${zone.mode === 'random' ? 'selected' : ''}>随机播放</option>
            </select>
        </div>
        
        <div class="zone-header">
            <h3>对话列表</h3>
            <button class="btn btn-primary" onclick="showDialogueTypeModal()">+ 添加对话</button>
        </div>
        
        <div id="dialoguesList"></div>
    `;
    
    // 添加监听
    document.getElementById('zoneMinAffection').addEventListener('input', (e) => {
        zone.minAffection = parseInt(e.target.value);
        renderZonesList();
    });
    
    document.getElementById('zoneMaxAffection').addEventListener('input', (e) => {
        zone.maxAffection = parseInt(e.target.value);
        renderZonesList();
    });
    
    document.getElementById('zoneMode').addEventListener('change', (e) => {
        zone.mode = e.target.value;
        renderZonesList();
    });
    
    renderDialoguesList();
}

// 关闭区间编辑器
function closeZoneEditor() {
    document.getElementById('dialogueEditor').style.display = 'none';
    currentZoneIndex = -1;
    renderZonesList();
}

// 删除区间
function deleteZone(index) {
    if (confirm('确定要删除这个对话区间吗？')) {
        config.dialogueZones.splice(index, 1);
        renderZonesList();
        if (currentZoneIndex === index) {
            closeZoneEditor();
        }
    }
}

// 显示对话类型选择模态框
function showDialogueTypeModal() {
    const modal = createModal('选择对话类型', `
        <div style="display: flex; gap: 20px; justify-content: center;">
            <button class="btn btn-primary btn-large" onclick="addDialogue('short'); closeModal()">
                💬 短对话<br><small>护航说一句话</small>
            </button>
            <button class="btn btn-primary btn-large" onclick="addDialogue('long'); closeModal()">
                📖 长对话<br><small>护航说多句话+玩家选择</small>
            </button>
        </div>
    `);
    document.body.appendChild(modal);
}

// 添加对话
function addDialogue(type) {
    const zone = config.dialogueZones[currentZoneIndex];
    
    if (type === 'short') {
        zone.dialogues.push({
            dialogueId: "",
            type: "short",
            lines: ["新的短对话"],
            conditions: [],
            option1: "",
            option2: "",
            option1Conditions: [],
            option2Conditions: [],
            option1Response: [""],
            option2Response: [""],
            option1Affection: 5,
            option2Affection: -5,
            option1Flags: [],
            option2Flags: [],
            option1JumpTo: "",
            option2JumpTo: ""
        });
    } else {
        zone.dialogues.push({
            dialogueId: "",
            type: "long",
            lines: ["第一句话", "第二句话", "第三句话"],
            question: "你觉得呢？",
            conditions: [],
            option1: "选项1",
            option2: "选项2",
            option1Conditions: [],
            option2Conditions: [],
            option1Response: ["好的！"],
            option2Response: ["是吗..."],
            option1Affection: 5,
            option2Affection: -5,
            option1Flags: [],
            option2Flags: [],
            option1JumpTo: "",
            option2JumpTo: ""
        });
    }
    
    renderDialoguesList();
    renderZonesList();
}

// 渲染对话列表
function renderDialoguesList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialoguesList = document.getElementById('dialoguesList');
    
    if (!zone || zone.dialogues.length === 0) {
        dialoguesList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无对话，点击"添加对话"开始创建</p>';
        return;
    }
    
    dialoguesList.innerHTML = zone.dialogues.map((dialogue, index) => `
        <div class="dialogue-item">
            <div class="dialogue-item-content">
                <div class="dialogue-item-title">
                    ${dialogue.type === 'short' ? '💬 短对话' : '📖 长对话'} ${index + 1}
                    ${dialogue.dialogueId ? `<span class="tag">ID: ${dialogue.dialogueId}</span>` : ''}
                    ${dialogue.conditions.length > 0 ? `<span class="tag tag-warning">有条件</span>` : ''}
                </div>
                <div class="dialogue-item-preview">
                    ${dialogue.lines[0] || '(空)'}
                    ${dialogue.lines.length > 1 ? ` ... (共${dialogue.lines.length}句)` : ''}
                </div>
            </div>
            <div class="dialogue-item-actions">
                <button class="btn btn-primary" onclick="editDialogue(${index})">编辑</button>
                <button class="btn btn-secondary" onclick="moveDialogue(${index}, -1)">↑</button>
                <button class="btn btn-secondary" onclick="moveDialogue(${index}, 1)">↓</button>
                <button class="btn btn-danger" onclick="deleteDialogue(${index})">删除</button>
            </div>
        </div>
    `).join('');
}

// 编辑对话
function editDialogue(index) {
    currentDialogueIndex = index;
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[index];
    
    let html = `
        <h3>编辑对话 ${index + 1}</h3>
        
        <div class="form-group">
            <label>对话ID（可选，用于跳转）</label>
            <input type="text" id="dialogueId" value="${dialogue.dialogueId}" placeholder="例如: ending_1">
            <small>设置后可以通过选项跳转到这个对话</small>
        </div>
        
        <h4>显示条件（全部满足才显示此对话）</h4>
        <div id="conditionsList"></div>
        <button class="btn btn-secondary" onclick="addCondition()">+ 添加条件</button>
        
        <h4>对话内容</h4>
    `;
    
    // 对话行
    dialogue.lines.forEach((line, lineIndex) => {
        html += `
            <div class="form-group">
                <label>第 ${lineIndex + 1} 句</label>
                <textarea id="line_${lineIndex}" rows="2">${line}</textarea>
                ${lineIndex > 0 ? `<button class="btn btn-danger" style="margin-top: 5px;" onclick="removeLine(${lineIndex})">删除这句</button>` : ''}
            </div>
        `;
    });
    
    html += `<button class="btn btn-secondary" onclick="addLine()">+ 添加一句话</button>`;
    
    if (dialogue.type === 'long') {
        html += `
            <div class="form-group">
                <label>提问（所有话说完后的问题）</label>
                <input type="text" id="question" value="${dialogue.question}">
            </div>
        `;
    }
    
    // 选项
    html += `
        <h4>选项设置</h4>
        
        <div class="form-group">
            <label>选项1文本</label>
            <input type="text" id="option1" value="${dialogue.option1}">
        </div>
        
        <h5>选项1显示条件</h5>
        <div id="option1ConditionsList"></div>
        <button class="btn btn-secondary" onclick="addOption1Condition()">+ 添加条件</button>
        
        <div class="form-group">
            <label>选项1反馈（护航的回应）</label>
            <div id="option1ResponsesList"></div>
            <button class="btn btn-secondary" onclick="addOption1Response()">+ 添加一句</button>
        </div>
        
        <div class="form-group">
            <label>选项1好感度变化</label>
            <input type="number" id="option1Affection" value="${dialogue.option1Affection}">
        </div>
        
        <div class="form-group">
            <label>选项1变量修改</label>
            <div id="option1FlagsList"></div>
            <button class="btn btn-secondary" onclick="addOption1Flag()">+ 添加变量修改</button>
        </div>
        
        <div class="form-group">
            <label>选项1跳转到（对话ID）</label>
            <input type="text" id="option1JumpTo" value="${dialogue.option1JumpTo}" placeholder="留空=继续下一个对话">
        </div>
        
        <hr style="margin: 30px 0;">
        
        <div class="form-group">
            <label>选项2文本</label>
            <input type="text" id="option2" value="${dialogue.option2}">
        </div>
        
        <h5>选项2显示条件</h5>
        <div id="option2ConditionsList"></div>
        <button class="btn btn-secondary" onclick="addOption2Condition()">+ 添加条件</button>
        
        <div class="form-group">
            <label>选项2反馈（护航的回应）</label>
            <div id="option2ResponsesList"></div>
            <button class="btn btn-secondary" onclick="addOption2Response()">+ 添加一句</button>
        </div>
        
        <div class="form-group">
            <label>选项2好感度变化</label>
            <input type="number" id="option2Affection" value="${dialogue.option2Affection}">
        </div>
        
        <div class="form-group">
            <label>选项2变量修改</label>
            <div id="option2FlagsList"></div>
            <button class="btn btn-secondary" onclick="addOption2Flag()">+ 添加变量修改</button>
        </div>
        
        <div class="form-group">
            <label>选项2跳转到（对话ID）</label>
            <input type="text" id="option2JumpTo" value="${dialogue.option2JumpTo}" placeholder="留空=继续下一个对话">
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-primary btn-large" onclick="saveDialogue()">保存对话</button>
            <button class="btn btn-secondary btn-large" onclick="cancelEditDialogue()">取消</button>
        </div>
    `;
    
    const modal = createModal('编辑对话', html);
    document.body.appendChild(modal);
    
    // 绑定事件
    setTimeout(() => {
        dialogue.lines.forEach((line, lineIndex) => {
            const input = document.getElementById(`line_${lineIndex}`);
            if (input) {
                input.addEventListener('input', (e) => {
                    dialogue.lines[lineIndex] = e.target.value;
                });
            }
        });
        
        if (dialogue.type === 'long') {
            document.getElementById('question').addEventListener('input', (e) => {
                dialogue.question = e.target.value;
            });
        }
        
        document.getElementById('dialogueId').addEventListener('input', (e) => {
            dialogue.dialogueId = e.target.value;
        });
        
        document.getElementById('option1').addEventListener('input', (e) => {
            dialogue.option1 = e.target.value;
        });
        
        document.getElementById('option2').addEventListener('input', (e) => {
            dialogue.option2 = e.target.value;
        });
        
        document.getElementById('option1Affection').addEventListener('input', (e) => {
            dialogue.option1Affection = parseInt(e.target.value);
        });
        
        document.getElementById('option2Affection').addEventListener('input', (e) => {
            dialogue.option2Affection = parseInt(e.target.value);
        });
        
        document.getElementById('option1JumpTo').addEventListener('input', (e) => {
            dialogue.option1JumpTo = e.target.value;
        });
        
        document.getElementById('option2JumpTo').addEventListener('input', (e) => {
            dialogue.option2JumpTo = e.target.value;
        });
        
        renderConditionsList();
        renderOption1ConditionsList();
        renderOption2ConditionsList();
        renderOption1ResponsesList();
        renderOption2ResponsesList();
        renderOption1FlagsList();
        renderOption2FlagsList();
    }, 100);
}

// 保存对话
function saveDialogue() {
    closeModal();
    renderDialoguesList();
    renderZonesList();
    currentDialogueIndex = -1;
}

// 取消编辑对话
function cancelEditDialogue() {
    closeModal();
    currentDialogueIndex = -1;
}

// 删除对话
function deleteDialogue(index) {
    if (confirm('确定要删除这个对话吗？')) {
        const zone = config.dialogueZones[currentZoneIndex];
        zone.dialogues.splice(index, 1);
        renderDialoguesList();
        renderZonesList();
    }
}

// 移动对话
function moveDialogue(index, direction) {
    const zone = config.dialogueZones[currentZoneIndex];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= zone.dialogues.length) return;
    
    [zone.dialogues[index], zone.dialogues[newIndex]] = [zone.dialogues[newIndex], zone.dialogues[index]];
    renderDialoguesList();
}

// 添加/删除对话行
function addLine() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.lines.push("新的一句话");
    editDialogue(currentDialogueIndex);
}

function removeLine(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.lines.splice(index, 1);
    editDialogue(currentDialogueIndex);
}

// 条件相关函数
function addCondition() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.conditions.push({
        flagName: "flag_name",
        conditionType: "equals",
        value: 0
    });
    renderConditionsList();
}

function renderConditionsList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    const list = document.getElementById('conditionsList');
    
    if (dialogue.conditions.length === 0) {
        list.innerHTML = '<p style="color: #999;">无条件限制，总是显示</p>';
        return;
    }
    
    list.innerHTML = dialogue.conditions.map((cond, index) => `
        <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 8px;">
            <input type="text" placeholder="变量名" value="${cond.flagName}" onchange="updateCondition(${index}, 'flagName', this.value)" style="width: 150px; margin-right: 10px;">
            <select onchange="updateCondition(${index}, 'conditionType', this.value)" style="margin-right: 10px;">
                <option value="equals" ${cond.conditionType === 'equals' ? 'selected' : ''}>等于</option>
                <option value="notEquals" ${cond.conditionType === 'notEquals' ? 'selected' : ''}>不等于</option>
                <option value="greaterThan" ${cond.conditionType === 'greaterThan' ? 'selected' : ''}>大于</option>
                <option value="lessThan" ${cond.conditionType === 'lessThan' ? 'selected' : ''}>小于</option>
                <option value="greaterOrEqual" ${cond.conditionType === 'greaterOrEqual' ? 'selected' : ''}>大于等于</option>
                <option value="lessOrEqual" ${cond.conditionType === 'lessOrEqual' ? 'selected' : ''}>小于等于</option>
                <option value="exists" ${cond.conditionType === 'exists' ? 'selected' : ''}>存在</option>
                <option value="notExists" ${cond.conditionType === 'notExists' ? 'selected' : ''}>不存在</option>
            </select>
            <input type="number" placeholder="值" value="${cond.value}" onchange="updateCondition(${index}, 'value', parseInt(this.value))" style="width: 80px; margin-right: 10px;">
            <button class="btn btn-danger" onclick="removeCondition(${index})">删除</button>
        </div>
    `).join('');
}

function updateCondition(index, field, value) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.conditions[index][field] = value;
}

function removeCondition(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.conditions.splice(index, 1);
    renderConditionsList();
}

// 选项1条件
function addOption1Condition() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Conditions.push({
        flagName: "flag_name",
        conditionType: "equals",
        value: 0
    });
    renderOption1ConditionsList();
}

function renderOption1ConditionsList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    const list = document.getElementById('option1ConditionsList');
    
    if (dialogue.option1Conditions.length === 0) {
        list.innerHTML = '<p style="color: #999;">无条件限制，总是显示</p>';
        return;
    }
    
    list.innerHTML = dialogue.option1Conditions.map((cond, index) => `
        <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 8px;">
            <input type="text" placeholder="变量名" value="${cond.flagName}" onchange="updateOption1Condition(${index}, 'flagName', this.value)" style="width: 150px; margin-right: 10px;">
            <select onchange="updateOption1Condition(${index}, 'conditionType', this.value)" style="margin-right: 10px;">
                <option value="equals" ${cond.conditionType === 'equals' ? 'selected' : ''}>等于</option>
                <option value="notEquals" ${cond.conditionType === 'notEquals' ? 'selected' : ''}>不等于</option>
                <option value="greaterThan" ${cond.conditionType === 'greaterThan' ? 'selected' : ''}>大于</option>
                <option value="lessThan" ${cond.conditionType === 'lessThan' ? 'selected' : ''}>小于</option>
                <option value="greaterOrEqual" ${cond.conditionType === 'greaterOrEqual' ? 'selected' : ''}>大于等于</option>
                <option value="lessOrEqual" ${cond.conditionType === 'lessOrEqual' ? 'selected' : ''}>小于等于</option>
                <option value="exists" ${cond.conditionType === 'exists' ? 'selected' : ''}>存在</option>
                <option value="notExists" ${cond.conditionType === 'notExists' ? 'selected' : ''}>不存在</option>
            </select>
            <input type="number" placeholder="值" value="${cond.value}" onchange="updateOption1Condition(${index}, 'value', parseInt(this.value))" style="width: 80px; margin-right: 10px;">
            <button class="btn btn-danger" onclick="removeOption1Condition(${index})">删除</button>
        </div>
    `).join('');
}

function updateOption1Condition(index, field, value) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Conditions[index][field] = value;
}

function removeOption1Condition(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Conditions.splice(index, 1);
    renderOption1ConditionsList();
}

// 选项2条件（类似）
function addOption2Condition() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Conditions.push({
        flagName: "flag_name",
        conditionType: "equals",
        value: 0
    });
    renderOption2ConditionsList();
}

function renderOption2ConditionsList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    const list = document.getElementById('option2ConditionsList');
    
    if (dialogue.option2Conditions.length === 0) {
        list.innerHTML = '<p style="color: #999;">无条件限制，总是显示</p>';
        return;
    }
    
    list.innerHTML = dialogue.option2Conditions.map((cond, index) => `
        <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 8px;">
            <input type="text" placeholder="变量名" value="${cond.flagName}" onchange="updateOption2Condition(${index}, 'flagName', this.value)" style="width: 150px; margin-right: 10px;">
            <select onchange="updateOption2Condition(${index}, 'conditionType', this.value)" style="margin-right: 10px;">
                <option value="equals" ${cond.conditionType === 'equals' ? 'selected' : ''}>等于</option>
                <option value="notEquals" ${cond.conditionType === 'notEquals' ? 'selected' : ''}>不等于</option>
                <option value="greaterThan" ${cond.conditionType === 'greaterThan' ? 'selected' : ''}>大于</option>
                <option value="lessThan" ${cond.conditionType === 'lessThan' ? 'selected' : ''}>小于</option>
                <option value="greaterOrEqual" ${cond.conditionType === 'greaterOrEqual' ? 'selected' : ''}>大于等于</option>
                <option value="lessOrEqual" ${cond.conditionType === 'lessOrEqual' ? 'selected' : ''}>小于等于</option>
                <option value="exists" ${cond.conditionType === 'exists' ? 'selected' : ''}>存在</option>
                <option value="notExists" ${cond.conditionType === 'notExists' ? 'selected' : ''}>不存在</option>
            </select>
            <input type="number" placeholder="值" value="${cond.value}" onchange="updateOption2Condition(${index}, 'value', parseInt(this.value))" style="width: 80px; margin-right: 10px;">
            <button class="btn btn-danger" onclick="removeOption2Condition(${index})">删除</button>
        </div>
    `).join('');
}

function updateOption2Condition(index, field, value) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Conditions[index][field] = value;
}

function removeOption2Condition(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Conditions.splice(index, 1);
    renderOption2ConditionsList();
}

// 选项1反馈
function addOption1Response() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Response.push("新的回应");
    renderOption1ResponsesList();
}

function renderOption1ResponsesList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    const list = document.getElementById('option1ResponsesList');
    
    list.innerHTML = dialogue.option1Response.map((response, index) => `
        <div style="margin: 10px 0;">
            <textarea rows="2" style="width: 100%;" onchange="updateOption1Response(${index}, this.value)">${response}</textarea>
            ${dialogue.option1Response.length > 1 ? `<button class="btn btn-danger" style="margin-top: 5px;" onclick="removeOption1Response(${index})">删除</button>` : ''}
        </div>
    `).join('');
}

function updateOption1Response(index, value) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Response[index] = value;
}

function removeOption1Response(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Response.splice(index, 1);
    renderOption1ResponsesList();
}

// 选项2反馈（类似）
function addOption2Response() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Response.push("新的回应");
    renderOption2ResponsesList();
}

function renderOption2ResponsesList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    const list = document.getElementById('option2ResponsesList');
    
    list.innerHTML = dialogue.option2Response.map((response, index) => `
        <div style="margin: 10px 0;">
            <textarea rows="2" style="width: 100%;" onchange="updateOption2Response(${index}, this.value)">${response}</textarea>
            ${dialogue.option2Response.length > 1 ? `<button class="btn btn-danger" style="margin-top: 5px;" onclick="removeOption2Response(${index})">删除</button>` : ''}
        </div>
    `).join('');
}

function updateOption2Response(index, value) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Response[index] = value;
}

function removeOption2Response(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Response.splice(index, 1);
    renderOption2ResponsesList();
}

// 选项1变量修改
function addOption1Flag() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Flags.push({
        flagName: "flag_name",
        operation: "set",
        value: 0
    });
    renderOption1FlagsList();
}

function renderOption1FlagsList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    const list = document.getElementById('option1FlagsList');
    
    if (dialogue.option1Flags.length === 0) {
        list.innerHTML = '<p style="color: #999;">不修改任何变量</p>';
        return;
    }
    
    list.innerHTML = dialogue.option1Flags.map((flag, index) => `
        <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 8px;">
            <input type="text" placeholder="变量名" value="${flag.flagName}" onchange="updateOption1Flag(${index}, 'flagName', this.value)" style="width: 150px; margin-right: 10px;">
            <select onchange="updateOption1Flag(${index}, 'operation', this.value)" style="margin-right: 10px;">
                <option value="set" ${flag.operation === 'set' ? 'selected' : ''}>设置为</option>
                <option value="add" ${flag.operation === 'add' ? 'selected' : ''}>增加</option>
                <option value="subtract" ${flag.operation === 'subtract' ? 'selected' : ''}>减少</option>
                <option value="toggle" ${flag.operation === 'toggle' ? 'selected' : ''}>切换0/1</option>
            </select>
            <input type="number" placeholder="值" value="${flag.value}" onchange="updateOption1Flag(${index}, 'value', parseInt(this.value))" style="width: 80px; margin-right: 10px;">
            <button class="btn btn-danger" onclick="removeOption1Flag(${index})">删除</button>
        </div>
    `).join('');
}

function updateOption1Flag(index, field, value) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Flags[index][field] = value;
}

function removeOption1Flag(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option1Flags.splice(index, 1);
    renderOption1FlagsList();
}

// 选项2变量修改（类似）
function addOption2Flag() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Flags.push({
        flagName: "flag_name",
        operation: "set",
        value: 0
    });
    renderOption2FlagsList();
}

function renderOption2FlagsList() {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    const list = document.getElementById('option2FlagsList');
    
    if (dialogue.option2Flags.length === 0) {
        list.innerHTML = '<p style="color: #999;">不修改任何变量</p>';
        return;
    }
    
    list.innerHTML = dialogue.option2Flags.map((flag, index) => `
        <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 8px;">
            <input type="text" placeholder="变量名" value="${flag.flagName}" onchange="updateOption2Flag(${index}, 'flagName', this.value)" style="width: 150px; margin-right: 10px;">
            <select onchange="updateOption2Flag(${index}, 'operation', this.value)" style="margin-right: 10px;">
                <option value="set" ${flag.operation === 'set' ? 'selected' : ''}>设置为</option>
                <option value="add" ${flag.operation === 'add' ? 'selected' : ''}>增加</option>
                <option value="subtract" ${flag.operation === 'subtract' ? 'selected' : ''}>减少</option>
                <option value="toggle" ${flag.operation === 'toggle' ? 'selected' : ''}>切换0/1</option>
            </select>
            <input type="number" placeholder="值" value="${flag.value}" onchange="updateOption2Flag(${index}, 'value', parseInt(this.value))" style="width: 80px; margin-right: 10px;">
            <button class="btn btn-danger" onclick="removeOption2Flag(${index})">删除</button>
        </div>
    `).join('');
}

function updateOption2Flag(index, field, value) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Flags[index][field] = value;
}

function removeOption2Flag(index) {
    const zone = config.dialogueZones[currentZoneIndex];
    const dialogue = zone.dialogues[currentDialogueIndex];
    dialogue.option2Flags.splice(index, 1);
    renderOption2FlagsList();
}

// 创建模态框
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="modal-close" onclick="closeModal()">&times;</span>
            </div>
            ${content}
        </div>
    `;
    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// 更新预览
function updatePreview() {
    const jsonPreview = document.getElementById('jsonPreview');
    jsonPreview.textContent = JSON.stringify(config, null, 2);
}

// 导出JSON
function exportJSON() {
    updatePreview();
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'escort_config.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ JSON文件已导出！请将文件放入游戏的 Mods/config/ 文件夹');
}

// 复制JSON
function copyJSON() {
    updatePreview();
    const json = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(json).then(() => {
        alert('✅ JSON已复制到剪贴板！');
    });
}

// 导入JSON
function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            config = imported;
            
            // 更新界面
            document.getElementById('escortName').value = config.escortName;
            document.getElementById('dialogueMode').value = config.dialogueMode;
            document.getElementById('dialogueInterval').value = config.dialogueInterval;
            document.getElementById('enableAffectionSystem').checked = config.enableAffectionSystem;
            
            document.getElementById('surrenderText').value = config.recruitDialogues.surrenderText;
            document.getElementById('recruitOption1').value = config.recruitDialogues.option1;
            document.getElementById('recruitOption2').value = config.recruitDialogues.option2;
            document.getElementById('acceptedText').value = config.recruitDialogues.acceptedText;
            document.getElementById('rejectedText').value = config.recruitDialogues.rejectedText;
            
            document.getElementById('escortDeathText').value = config.feedbackDialogues.escortDeathText;
            document.getElementById('escortDeathOption1').value = config.feedbackDialogues.escortDeathOption1;
            document.getElementById('escortDeathOption2').value = config.feedbackDialogues.escortDeathOption2;
            document.getElementById('noMoreDialogues').value = config.feedbackDialogues.noMoreDialogues;
            document.getElementById('maxAffectionText').value = config.feedbackDialogues.maxAffectionText;
            document.getElementById('betrayalEscortText').value = config.feedbackDialogues.betrayalEscortText;
            document.getElementById('betrayalPlayerText').value = config.feedbackDialogues.betrayalPlayerText;
            document.getElementById('killedBetrayerText').value = config.feedbackDialogues.killedBetrayerText;
            
            renderZonesList();
            updatePreview();
            
            alert('✅ 配置已成功导入！');
        } catch (error) {
            alert('❌ 导入失败：JSON格式错误\n' + error.message);
        }
    };
    reader.readAsText(file);
}

