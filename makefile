run_terminal:
	node main.js
run_web:
	npx browserify web/public/main.js -o web/public/bundle.js
	node web\server.js
