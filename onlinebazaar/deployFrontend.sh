rsync -r src/ docs/
rsync build/contracts/OnlineBazaar.json docs/
git add .
git commit -m "adding frontend files"
git push
