BIN := ./node_modules/.bin/
VERSION := $(shell node -e "console.log(require('./package.json').version)")
TEST_FILES := spec/helper.js $(shell find spec/lib -type f -name "*.js")

.PHONY: all lint test

all: lint test

default: lint test

lint:
	$(bin)eslint index.js lib spec examples

test:
	$(bin)mocha --colors -R dot -- $(TEST_FILES)

cover:
	@istanbul cover $(BIN)/_mocha $(TEST_FILES) --report lcovonly -- -R spec

ci: lint cover
