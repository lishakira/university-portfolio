#
# COMP1521 Lab 03 Exercise - MIPS Order Checking
#
# Reads 10 numbers into an array
# printing 0 if they are in non-decreasing order
# or 1 otherwise.
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 03/10/2022
#

# Constants
ARRAY_LEN = 10

main:
	# Registers:
	#  - $t0: int i
	#  - $t1: temporary result
	#  - $t2: temporary result
	#  - $t3: int swapped
	#  - $t4: int x
	#  - $t5: int y

scan_loop__init:
	li	$t0, 0				# i = 0;

scan_loop__cond:
	bge	$t0, ARRAY_LEN, scan_loop__end	# while (i < ARRAY_LEN) {

scan_loop__body:
	li	$v0, 5				#   syscall 5: read_int
	syscall					#   
						#
	mul	$t1, $t0, 4			#   calculate &numbers[i] == numbers + 4 * i
	la	$t2, numbers			#
	add	$t2, $t2, $t1			#
	sw	$v0, ($t2)			#   scanf("%d", &numbers[i]);

	addi	$t0, $t0, 1			#   i++;
	j	scan_loop__cond			# }

scan_loop__end:

print_loop__init:
	li	$t3, 0				# int swapped = 0
	li	$t0, 1				# i = 1

print_loop__cond:
	bge	$t0, ARRAY_LEN, print_loop__end	# while (i < ARRAY_LEN) {

print_loop__body:
	mul	$t1, $t0, 4			#   calculate &numbers[i] == numbers + 4 * i
	la	$t2, numbers			#
	add	$t2, $t2, $t1			#   
	lw	$t4, ($t2)			#   x = numbers[i];

	addi	$t2, $t2, -4			#
	lw	$t5, ($t2)			#   y = numbers[i - 1];

	bge	$t4, $t5, print_loop__add	#   if (x >= y)
	li	$t3, 1				#   swapped = 1

print_loop__add:
	addi	$t0, $t0, 1			# i++;
	b	print_loop__cond

print_loop__end:
	li	$v0, 1				# syscall 1: print_int
	move	$a0, $t3			#
	syscall					# printf("%d", swapped)

	li	$v0, 11				# syscall 11: print_char
	li	$a0, '\n'			#
	syscall					# printf("%c", '\n');

	li	$v0, 0
	jr	$ra				# return 0;

	.data
numbers:
	.word	0:ARRAY_LEN			# int numbers[ARRAY_LEN] = {0};
