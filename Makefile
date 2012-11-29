REPORTER = spec
FORMAT = bdd

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) --ui $(FORMAT)

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) --ui $(FORMAT) \
		--watch

.PHONY: test test-w