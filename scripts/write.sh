#!/bin/bash
# =============================================================================
# Issueflow-Blog: 本地 Vim 写作脚本
# 用法: ./scripts/write.sh
# =============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
REPO_NAME="${GITHUB_REPO:-$(basename $(git remote get-url origin 2>/dev/null || echo ''))}"
TEMP_DIR="/tmp/issueflow-draft"
TEMP_FILE="$TEMP_DIR/draft.md"

# 可用标签
LABELS=("react" "tailwind" "nextjs" "github" "automation" "devops" "ai" "tutorial" "guide" "other")

# =============================================================================
# 函数定义
# =============================================================================

print_header() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║              Issueflow-Blog 写作助手                      ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_gh_auth() {
    if ! gh auth status &>/dev/null; then
        echo -e "${RED}❌ GitHub CLI 未认证或未安装${NC}"
        echo ""
        echo "请先运行以下命令认证:"
        echo "  ${YELLOW}gh auth login${NC}"
        echo ""
        echo "然后重新运行此脚本。"
        exit 1
    fi
}

check_git_repo() {
    if ! git rev-parse --is-inside-work-tree &>/dev/null; then
        echo -e "${RED}❌ 当前目录不是 Git 仓库${NC}"
        echo ""
        echo "请先初始化仓库或进入已有的 Git 仓库:"
        echo "  ${YELLOW}git init${NC}"
        echo "  ${YELLOW}git remote add origin https://github.com/用户名/仓库名.git${NC}"
        exit 1
    fi
}

get_title() {
    echo -e "${BLUE}请输入文章标题:${NC}"
    read -r TITLE
    
    if [[ -z "$TITLE" ]]; then
        echo -e "${RED}❌ 标题不能为空${NC}"
        exit 1
    fi
}

select_labels() {
    echo ""
    echo -e "${BLUE}选择标签 (多选，用空格分隔，或输入数字范围如 1-3):${NC}"
    echo ""
    
    for i in "${!LABELS[@]}"; do
        echo -e "  ${GREEN}[$((i+1))]${NC} ${LABELS[$i]}"
    done
    
    echo ""
    read -rp "标签编号: " LABEL_INPUT
    
    # 解析输入
    SELECTED_LABELS=()
    
    if [[ "$LABEL_INPUT" =~ ^[0-9]+-[0-9]+$ ]]; then
        # 范围选择
        START=${LABEL_INPUT%-*}
        END=${LABEL_INPUT#*-}
        for ((i=START-1; i<END; i++)); do
            SELECTED_LABELS+=("${LABELS[$i]}")
        done
    else
        # 单个或多选
        for num in $LABEL_INPUT; do
            if [[ "$num" =~ ^[0-9]+$ ]] && [[ "$num" -ge 1 ]] && [[ "$num" -le ${#LABELS[@]} ]]; then
                SELECTED_LABELS+=("${LABELS[$((num-1))]}")
            fi
        done
    fi
    
    # 如果没有选择，默认添加 "other"
    if [[ ${#SELECTED_LABELS[@]} -eq 0 ]]; then
        SELECTED_LABELS=("other")
        echo -e "${YELLOW}⚠️  未选择标签，默认添加 'other'${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}已选择标签:${NC} ${SELECTED_LABELS[*]}"
}

create_draft() {
    mkdir -p "$TEMP_DIR"
    
    # 创建 Markdown 模板
    cat > "$TEMP_FILE" << EOF
---
title: "$TITLE"
date: $(date +%Y-%m-%d)
draft: true
---

# $TITLE

> 写作时间: $(date '+%Y-%m-%d %H:%M:%S')

<!-- 在此开始写作... -->

EOF

    echo ""
    echo -e "${GREEN}✓ 草稿已创建: ${TEMP_FILE}${NC}"
}

open_vim() {
    echo ""
    echo -e "${BLUE}📝 正在打开 Vim 编辑器...${NC}"
    echo -e "${YELLOW}提示: 写完保存退出 (:wq) 后，脚本会自动提交到 GitHub Issues${NC}"
    echo ""
    
    vim "$TEMP_FILE"
}

check_draft_empty() {
    # 检查文件是否只有模板内容（没有实际写作）
    LINE_COUNT=$(wc -l < "$TEMP_FILE")
    
    # 如果只有 7 行左右（模板内容），认为没有写作
    if [[ "$LINE_COUNT" -le 7 ]]; then
        echo ""
        echo -e "${YELLOW}⚠️  草稿似乎没有内容，是否仍然提交？(y/N)${NC}"
        read -rp "> " CONFIRM
        if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
            echo -e "${GREEN}已取消，草稿已保存至: ${TEMP_FILE}${NC}"
            exit 0
        fi
    fi
}

create_github_issue() {
    echo ""
    echo -e "${BLUE}📤 正在创建 GitHub Issue...${NC}"
    
    # 构建标签参数
    LABEL_ARGS=()
    for label in "${SELECTED_LABELS[@]}"; do
        LABEL_ARGS+=("-l" "$label")
    done
    
    # 创建 Issue
    ISSUE_URL=$(gh issue create \
        --title "$TITLE" \
        --body-file "$TEMP_FILE" \
        "${LABEL_ARGS[@]}" \
        --json url \
        --jq '.url')
    
    echo ""
    echo -e "${GREEN}✓ Issue 创建成功!${NC}"
    echo -e "${CYAN}   链接: ${ISSUE_URL}${NC}"
    echo ""
    echo -e "${YELLOW}💡 提示: 在 GitHub 上关闭此 Issue 后，它会自动同步到博客网站${NC}"
    
    # 清理临时文件
    rm -rf "$TEMP_DIR"
}

# =============================================================================
# 主流程
# =============================================================================

main() {
    print_header
    check_gh_auth
    check_git_repo
    
    get_title
    select_labels
    create_draft
    open_vim
    check_draft_empty
    create_github_issue
    
    echo ""
    echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  写作完成！等待关闭 Issue 以发布到博客网站 🚀${NC}"
    echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
}

main "$@"