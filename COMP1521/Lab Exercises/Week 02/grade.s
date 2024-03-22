#
# COMP1521 Lab 02 Exercise - MIPS Grading
#
# read a mark and print the corresponding UNSW grade
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

main:
	la	$a0, prompt		# printf("Enter a mark: ");
	li	$v0, 4
	syscall

	li	$v0, 5			# scanf("%d", mark);
	syscall

	la	$a0, fl			# printf("FL\n");
	blt	$v0, 50, output		# if (mark < 50)
	la	$a0, ps			# printf("PS\n");
	blt	$v0, 65, output		# else if (mark < 65)
	la	$a0, cr			# printf("CR\n");
	blt	$v0, 75, output		# else if (mark < 65)
	la	$a0, dn			# printf("DN\n");
	blt	$v0, 85, output		# else if (mark < 65)
	la	$a0, hd			# printf("HD\n");

output:
	li	$v0, 4
	syscall

	li	$v0, 0
	jr	$ra			# return 0

.data
prompt:
	.asciiz "Enter a mark: "
fl:
	.asciiz "FL\n"
ps:
	.asciiz "PS\n"
cr:
	.asciiz "CR\n"
dn:
	.asciiz "DN\n"
hd:
	.asciiz "HD\n"
