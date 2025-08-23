@echo off
cd dashboard
call npm install --legacy-peer-deps
call npm run build --configuration=production --base-href=/frontcraft/dashboard/
cd ..
git checkout gh-pages
xcopy /E /Y dashboard\dist\dashboard\* dashboard\
git add dashboard/
git commit -m "Deploy dashboard"
git push origin gh-pages
git checkout micro-apps