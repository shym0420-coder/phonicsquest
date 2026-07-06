#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "→ GitHub 로그인 확인..."
gh auth status

REPO_NAME="phonicsquest"
OWNER="$(gh api user --jq .login)"

if gh repo view "$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  echo "→ 기존 저장소에 push..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$OWNER/$REPO_NAME.git"
  git push -u origin main
else
  echo "→ 새 저장소 생성 및 push..."
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push --description "Phonics Quest — 초등학생용 phonics quiz"
fi

echo "→ GitHub Pages (Actions) 활성화..."
gh api --method POST "/repos/$OWNER/$REPO_NAME/pages" -f build_type=workflow 2>/dev/null || \
  gh api --method PUT "/repos/$OWNER/$REPO_NAME/pages" -f build_type=workflow

echo ""
echo "✅ 배포 시작됨!"
echo "   저장소: https://github.com/$OWNER/$REPO_NAME"
echo "   사이트: https://$OWNER.github.io/$REPO_NAME/ (Actions 완료 후 1~2분)"
