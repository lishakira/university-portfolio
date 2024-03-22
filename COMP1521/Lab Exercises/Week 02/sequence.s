#
# COMP1521 Lab 02 Exercise - MIPS Sequence
#
# Read three numbers `start`, `stop`, `step`
# Print the integers bwtween `start` and `stop` moving in increments of size `step`
#
# Before starting work on this task, make sure you set your tab-width to 8!
# It is also suggested to indent with tabs only.
#
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 21/09/2022
#
#![tabsize(8)]

main:				# int main(void)
	la	$a0, prompt1	# printf("Enter the starting number: ");
	li	$v0, 4
	syscall

	li	$v0, 5		# scanf("%d", start);
	syscall
	move	$t0, $v0	# $t0 = start

	la	$a0, prompt2	# printf("Enter the stopping number: ");
	li	$v0, 4
	syscall

	li	$v0, 5		# scanf("%d", stop);
	syscall
	move	$t1, $v0	# $t1 = stop

	la	$a0, prompt3	# printf("Enter the step size: ");
	li	$v0, 4
	syscall

	li	$v0, 5		# scanf("%d", step);
	syscall
	move	$t2, $v0	# $t2 = step

start:
	blt	$t1, $t0, decreasing	# if (stop < start)
	
	bgt	$t1, $t0, increasing	# if (stop > start)

decreasing:
	bgez	$t2, end	# if (step >= 0)
	
	b	print

increasing:
	blez	$t2, end	# if (step <= 0)

	b	print

print:
	move	$a0, $t0	# printf("%d", 42);
	li	$v0, 1
	syscall

	li	$a0, '\n'	# printf("%c", '\n');
	li	$v0, 11
	syscall

	b	addition

addition:
	add	$t0, $t0, $t2

	b	start	

end:
	li	$v0, 0
	jr	$ra		# return 0

	.data
prompt1:
	.asciiz "Enter the starting number: "
prompt2:
	.asciiz "Enter the stopping number: "
prompt3:
	.asciiz "Enter the step size: "

# COMP1521 lab sample solution
# Read three numbers `start`, `stop`, `step`
# Print the integers bwtween `start` and `stop` moving in increments of size `step`

main:                           # int main(void) {
    # `start` in $t0
    # `stop`  in $t1
    # `step`  in $t2
    # `i`     in $t3

    la   $a0, prompt1           # printf("Enter the starting number: ");
    li   $v0, 4
    syscall
    li   $v0, 5                 # scanf("%d", start);
    syscall
    move $t0, $v0

    la   $a0, prompt2           # printf("Enter the stopping number: ");
    li   $v0, 4
    syscall
    li   $v0, 5                 # scanf("%d", stop);
    syscall
    move $t1, $v0

    la   $a0, prompt3           # printf("Enter the step size: ");
    li   $v0, 4
    syscall
    li   $v0, 5                 # scanf("%d", step);
    syscall
    move $t2, $v0

    move $t3, $t0

    blt $t1, $t0, main__negative
    bgt $t1, $t0, main__positive
    b main__end

main__negative:
    bgez $t2, main__end

main__negative__loop:
    blt  $t3, $t1, main__end

    move $a0, $t3
    li   $v0, 1
    syscall

    li   $a0, '\n'
    li   $v0, 11
    syscall

    add  $t3, $t3, $t2
    j    main__negative__loop

main__positive:
    blez $t2, main__end

main__positive__loop:
    bgt  $t3, $t1, main__end

    move $a0, $t3
    li   $v0, 1
    syscall

    li   $a0, '\n'
    li   $v0, 11
    syscall

    add  $t3, $t3, $t2
    j    main__positive__loop

main__end:
    li   $v0, 0
    jr   $ra                    # return 0

.data
    prompt1: .asciiz "Enter the starting number: "
    prompt2: .asciiz "Enter the stopping number: "
    prompt3: .asciiz "Enter the step size: "