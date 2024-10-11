# Makefile for a Node.js project

# Define the Node.js and NPM commands
NODE := node
NPM := npm

# Define the build task
.PHONY: build

build:
	$(NPM) run build
