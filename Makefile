# Makefile for a Node.js project

# Define the Bun command
BUN := bun

# Define the build task
.PHONY: build lint

build:
	$(BUN) run build

lint:
	$(BUN) run lint
