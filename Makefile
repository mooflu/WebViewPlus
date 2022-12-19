.PHONY: build

dev:
	npx vite --clearScreen false --host

build:
	yarn
	rm -rf build
	npx vite build
