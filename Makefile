BIN := ./node_modules/.bin/
VERSION := $(shell node -e "console.log(require('./package.json').version)")

all: lint test

lint:
	$(bin)eslint lib spec

test:
	$(bin)mocha --colors -R dot -- spec/helper.js spec/lib/**/*

.PHONY: all lint test
