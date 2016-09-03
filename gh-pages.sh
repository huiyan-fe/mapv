mkdir -p _gh-pages
cp -r examples/ _gh-pages/examples/
cp -r build/ _gh-pages/build/
git checkout -B gh-pages origin/gh-pages

cp -r _gh-pages/build/ ./build/
cp -r _gh-pages/examples/ ./examples/
git add build/.
git add examples/.


git commit -m "update gh-pages from gh-pages.sh"
git push


rm -rf _gh-pages/
git checkout v2
