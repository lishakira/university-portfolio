#
# COMP1521 Lab 04 Exercise - MIPS Random Mathematics
#
# Generate a random value using the random seed inputted
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 04/10/2022
#

########################################################################
# .DATA
# Here are some handy strings for use in your code.

	.data
prompt_str:
	.asciiz "Enter a random seed: "
result_str:
	.asciiz "The random result is: "

########################################################################
# .TEXT <main>
	.text
main:

	# Args: void
	# Returns: int
	#
	# Frame:	[$ra, $s0]
	# Uses: 	[$v0, $a0, $s0]
	# Clobbers:	[$v0, $a0]
	#
	# Locals:
	#   - $s0: int value 
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
	syscall					# printf("Enter a random seed: ");

	li	$v0, 5				# syscall 5: read_int
	syscall					#
	move	$a0, $v0			# scanf("%d", &random_seed)

	jal	seed_rand			# seed_rand(random_seed)

	li	$a0, 100			
	jal	rand				
	move	$s0, $v0			# int value = rand(100);

	move	$a0, $s0			
	jal	add_rand
	move	$s0, $v0			# value = add_rand(value);

	move	$a0, $s0			
	jal	sub_rand
	move	$s0, $v0			# value = sub_rand(value)
	
	move	$a0, $s0			
	jal	seq_rand
	move	$s0, $v0			# value = seq_rand(value)

	li	$v0, 4				# syscall 4: print_string
	li	$a0, result_str			#
	syscall					# printf("The random result is: ");

	li	$v0, 1				# syscall 1: print_int
	move	$a0, $s0			# 
	syscall					# printf("%d", value);

	li	$v0, 11				# syscall 11: print_char
	li	$a0, '\n'			#
	syscall					# putchar('\n');


main__epilogue:
	pop	$s0
	pop	$ra
	end

	li	$v0, 0
	jr	$ra				# return 0;

########################################################################
# .TEXT <add_rand>
	.text
add_rand:
	# Args:
	#   - $a0: int value
	# Returns: int
	#
	# Frame:	[$ra, $s0]
	# Uses: 	[$v0, $a0, $s0]
	# Clobbers:	[$v0, $a0]
	#
	# Structure:
	#   - add_rand
	#     -> [prologue]
	#     -> [body]
	#     -> [epilogue]

add_rand__prologue:
	begin
	push	$ra
	push	$s0

add_rand__body:
	move	$s0, $a0			

	li	$a0, 0xFFFF
	jal	rand				# rand(0xFFFF);

	add	$v0, $s0, $v0			# value + rand(0xFFFF);

add_rand__epilogue:
	pop	$s0
	pop	$ra
	end

	jr	$ra				# return value + rand(0xFFFF);


########################################################################
# .TEXT <sub_rand>
	.text
sub_rand:
	# Args:
	#   - $a0: int value
	# Returns: int
	#
	# Frame:	[$ra, $s0]
	# Uses: 	[$v0, $a0, $s0]
	# Clobbers:	[$v0, $a0]
	#
	# Structure:
	#   - sub_rand
	#     -> [prologue]
	#     -> [body]
	#     -> [epilogue]

sub_rand__prologue:
	begin
	push	$ra
	push	$s0

sub_rand__body:
	move	$s0, $a0			

	jal	rand				# 
	sub	$v0, $s0, $v0			# value - rand(value);

sub_rand__epilogue:
	pop	$s0
	pop	$ra
	end

	jr	$ra				# return value - rand(value);

########################################################################
# .TEXT <seq_rand>
	.text
seq_rand:
	# Args:
	#   - $a0: int value
	# Returns: int
	#
	# Frame:	[$ra, $s0, $s1, $s2]
	# Uses: 	[$v0, $a0, $s0, $s1, $s2]
	# Clobbers:	[$v0, $a0]
	#
	# Locals:
	#   - $s0: int value
	#   - $s1: int limit
	#   - $s2: int i
	#
	# Structure:
	#   - seq_rand
	#     -> [prologue]
	#     -> [body]
	#       -> add_loop
	#         -> [init]
	#         -> [body]
	#         -> [step]
	#         -> [end]
	#     -> [epilogue]

seq_rand__prologue:
	begin
	push	$ra
	push	$s0
	push	$s1
	push	$s2

seq_rand__body:
	move	$s0, $a0

	li	$a0, 100
	jal	rand
	move	$s1, $v0			# int limit = rand(100);

seq_rand__add_loop_init:
	li	$s2, 0				# int i = 0;

seq_rand__add_loop_cond:
	bge	$s2, $s1, seq_rand__add_loop_end# while (i < limit) {

	move	$a0, $s0
	jal	add_rand
	move	$s0, $v0			#   value = add_rand(value);

seq_rand__add_loop_step:
	addi	$s2, $s2, 1			#   i++;
	j	seq_rand__add_loop_cond		# }

seq_rand__add_loop_end:
seq_rand__epilogue:
	
	pop	$s2
	pop	$s1
	pop	$s0
	pop	$ra
	end

	jr	$ra				# return value;



##
## The following are two utility functions, provided for you.
##
## You don't need to modify any of the following,
## but you may find it useful to read through.
## You'll be calling these functions from your code.
##

OFFLINE_SEED = 0x7F10FB5B

########################################################################
# .DATA
	.data
	
# int random_seed;
	.align 2
random_seed:
	.space 4


########################################################################
# .TEXT <seed_rand>
	.text
seed_rand:
# DO NOT CHANGE THIS FUNCTION

	# Args:
	#   - $a0: unsigned int seed
	# Returns: void
	#
	# Frame:	[]
	# Uses:		[$a0, $t0]
	# Clobbers:	[$t0]
	#
	# Locals:
	#   - $t0: offline_seed
	#
	# Structure:
	#   - seed_rand

	li	$t0, OFFLINE_SEED		# const unsigned int offline_seed = OFFLINE_SEED;
	xor	$t0, $a0			# random_seed = seed ^ offline_seed;
	sw	$t0, random_seed

	jr	$ra				# return;

########################################################################
# .TEXT <rand>
	.text
rand:
# DO NOT CHANGE THIS FUNCTION

	# Args:
	#   - $a0: unsigned int n
	# Returns:
	#   - $v0: int
	#
	# Frame:    []
	# Uses:     [$a0, $v0, $t0]
	# Clobbers: [$v0, $t0]
	#
	# Locals:
	#   - $t0: int rand
	#
	# Structure:
	#   - rand

	lw	$t0, random_seed 		# unsigned int rand = random_seed;
	multu	$t0, 0x5bd1e995  		# rand *= 0x5bd1e995;
	mflo	$t0
	addiu	$t0, 12345       		# rand += 12345;
	sw	$t0, random_seed 		# random_seed = rand;

	remu	$v0, $t0, $a0    
	jr	$ra              		# return rand % n;