#
# COMP1521 Lab 07 Exercise - Convert from big- to little-endian in MIPS
#
# Reads a 4-byte value and reverses the byte order, then prints it
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 31/10/2022
#

MASK = 0xFF

########################################################################
# .TEXT <main>
main:
	# Locals:
	#	- $t0: int network_bytes
	#	- $t1: int computer_bytes
	#	- $t2: Mask of one byte (0xFF), moved gradually through 
	# 		the 4 bytes of the int
	#	- $t3: temporary result

	li	$v0, 5			# scanf("%d", &network_bytes);
	syscall
	move	$t0, $v0		# $t0 = network_bytes

	li	$t2, MASK		# $t2 = MASK

	# $t1 = (network_bytes & MASK) << 24
	and	$t3, $t0, $t2		# $t3 = network_bytes & MASK
	sll	$t1, $t3, 24		# $t1 = (network_bytes & MASK) << 24

	# $t1 |= (network_bytes & (MASK << 8)) << 8
	sll	$t2, $t2, 8		# $t2 = MASK << 8
	and	$t3, $t0, $t2		# $t3 = network_bytes & (MASK << 8)
	sll	$t3, $t3, 8		# $t3 = (network_bytes & (MASK << 8)) << 8
	or	$t1, $t1, $t3		# $t1 |= (network_bytes & (MASK << 8)) << 8

	# $t1 |= (network_bytes & (MASK << 16)) >> 8
	sll	$t2, $t2, 8		# $t2 = MASK << 16
	and	$t3, $t0, $t2		# $t3 = network_bytes & (MASK << 16)
	srl	$t3, $t3, 8		# $t3 = (network_bytes & (MASK << 16)) >> 8
	or	$t1, $t1, $t3		# $t1 |= (network_bytes & (MASK << 16)) >> 8

	# $t1 |= (network_bytes & (MASK << 24)) >> 24
	sll	$t2, $t2, 8		# $t2 = (MASK << 24)
	and	$t3, $t0, $t2		# $t3 = network_bytes & (MASK << 24)
	srl	$t3, $t3, 24		# $t3 = (network_bytes & (MASK << 24)) >> 24
	or	$t1, $t1, $t3		# $t1 |= (network_bytes & (MASK << 24)) >> 24

	move	$a0, $t1		# printf("%d\n", computer_bytes);
	li	$v0, 1
	syscall

	li	$a0, '\n'		# printf("%c", '\n');
	li	$v0, 11
	syscall

main__end:
	li	$v0, 0		# return 0;
	jr	$ra