#
# COMP1521 Lab 02 Exercise - MIPS 7-Eleven
#
# Read a number and print positive multiples of 7 or 11 < n
#
# Before starting work on this task, make sure you set your tab-width to 8!
# It is also suggested to indent with tabs only.
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 20/09/2022
#
#![tabsize(8)]

main:				# int main(void) {

	la	$a0, prompt	# printf("Enter a number: ");
	li	$v0, 4
	syscall

	li	$v0, 5		# scanf("%d", number);
	syscall
	move	$t0, $v0	# $t0 = number

	li	$t1, 1		# $t1 = i: i = 1

start:
	bge	$t1, $t0, end	# if (i >= number)
	mod	$t2, $t1, 7	# $t2 = remainder
	beqz	$t2, print	# if (i % 7 == 0)

	mod	$t2, $t1, 11	
	beqz	$t2, print	# if (i % 11 == 0)

	b	add

print:
	move	$a0, $t1	# printf("%d", i);
	li	$v0, 1
	syscall

	li	$a0, '\n'	# printf("%c", '\n');
	li	$v0, 11
	syscall

add:
	addi	$t1, $t1, 1	# i = i + 1

	b 	start

end:
	li	$v0, 0
	jr	$ra		# return 0

.data
prompt:
	.asciiz "Enter a number: "
