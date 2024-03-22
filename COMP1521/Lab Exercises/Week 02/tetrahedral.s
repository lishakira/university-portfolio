#
# COMP1521 Lab 02 Exercise - MIPS Tetrahedra
#
# Read a number n and print the first n tetrahedral numbers
# https://en.wikipedia.org/wiki/Tetrahedral_number
#
# Before starting work on this task, make sure you set your tab-width to 8!
# It is also suggested to indent with tabs only.
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 21/09/2022
#
#![tabsize(8)]

main:				# int main(void) {
	la	$a0, prompt	# printf("Enter how many: ");
	li	$v0, 4
	syscall

	li	$v0, 5		# scanf("%d", how_many);
	syscall
	move	$t0, $v0	# $t0 = how_many

	li	$t1, 1		# $t1 = n: n = 1

condition1:
	bgt	$t1, $t0, end	# if (n > how_many)

	li	$t2, 0		# $t2 = total: total = 0
	li	$t3, 1		# $t3 = j: j = 1

condition2:
	bgt	$t3, $t1, print	# if (j > n)

	li	$t4, 1			# $t4 = i: i = 1

condition3:
	bgt	$t4, $t3, addition1	# if (i > j)

	add	$t2, $t2, $t4		# total = total + i
	addi	$t4, $t4, 1		# i = i + 1

	b	condition3

addition1:
	addi	$t3, $t3, 1	# j = j + 1

	b	condition2

print:
	move	$a0, $t2	# printf("%d", 42);
	li	$v0, 1
	syscall

	li	$a0, '\n'	# printf("%c", '\n');
	li	$v0, 11
	syscall

addition2:
	addi	$t1, $t1, 1	# n = n + 1

	b	condition1

end:
	li	$v0, 0
	jr	$ra		# return 0

.data
prompt:
	.asciiz "Enter how many: "
