EXERCISES += battlesmips
CLEAN_FILES += battlesmips

battlesmips: battlesmips_EOF.c

.PHONY: submit give

submit give: battlesmips.s
	give cs1521 ass1_battlesmips battlesmips.s

.PHONY: test autotest

test autotest: battlesmips.s
	1521 autotest battlesmips battlesmips.s
