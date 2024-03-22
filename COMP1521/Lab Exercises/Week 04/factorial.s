#
# COMP1521 Lab 04 Exercise - MIPS factorial
#
# Recursive implementation of a factorial calculator.
# Your program should yield n! = 1 for any n < 1.
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 04/10/2022
#

########################################################################
# .DATA
	.data
prompt_str:	.asciiz	"Enter n: "
result_str:	.asciiz	"! = "

########################################################################
# .TEXT <main>
	.text
main:

	# Args: void
	# Returns: int
	#
	# Frame:	[$ra, $s0]
	# Uses: 	[$v0, $a0, $s0, $t0]
	# Clobbers:	[$v0, $a0, $t0]
	#
	# Locals:
	#   - $s0: int n
	#   - $t0: int f
	#
	# Structure:
	#   - main
	#     -> [prologue]
	#     -> [body]
	#     -> [epilogue]

main__prologue:
	begin
	push	$ra
	push	$s0

main__body:
	li	$v0, 4				# syscall 4: print_string
	la	$a0, prompt_str			#
	syscall					# printf("%s", "Enter n: ");

	li	$v0, 5				# syscall 5: read_int
	syscall					#
	move	$s0, $v0			# scanf("%d", &n);

	move	$a0, $s0			
	jal	factorial			
	move	$t0, $v0			# int f = factorial(n);

	li	$v0, 1				# syscall 1: print_int
	move	$a0, $s0			#
	syscall					# printf("%d", n);

	li	$v0, 4				# syscall 4: print_string
	la	$a0, result_str			#
	syscall					# printf("%s", "! = ")

	li	$v0, 1				# syscall 1: print_int
	move	$a0, $t0			#
	syscall					# printf("%d", f)

	li	$v0, 11				# syscall 11: print_char
	li	$a0, '\n'			#
	syscall					# printf("%c", '\n');

main__epilogue:
	pop	$s0
	pop	$ra
	end

	li	$v0, 0
	jr	$ra				# return 0;


########################################################################
# .TEXT <factorial>
	.text
factorial:

	# Args:
	#   - $a0: int n
	# Returns: int
	#
	# Frame:	[$ra, $s0]
	# Uses: 	[$v0, $a0, $s0]
	# Clobbers:	[$v0, $a0]
	#
	# Locals:
	#   - $s0: int n
	#
	# Structure:
	#   - factorial
	#     -> [prologue]
	#     -> [body]
	#     -> [epilogue]

factorial__prologue:
	begin
	push	$ra
	push	$s0

factorial__body:
	move	$s0, $a0

	ble	$s0, 1, factorial__n_le_1	# if (n > 1) {

	addi	$a0, $s0, -1
	jal	factorial
	mul	$v0, $v0, $s0			#   return n * factorial(n - 1);
	b 	factorial__epilogue		# }


factorial__n_le_1:
	li	$v0, 1				# return 1;

factorial__epilogue:
	pop	$s0
	pop	$ra
	end

	jr	$ra