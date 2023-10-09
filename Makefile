.PHONY: build

dev:
	yarn vite --clearScreen false --host

build:
	yarn
	rm -rf build
	yarn vite build

lint:
	node ./node_modules/eslint/bin/eslint.js .

check:
	node ./node_modules/typescript/bin/tsc --noEmit -p tsconfig.json
