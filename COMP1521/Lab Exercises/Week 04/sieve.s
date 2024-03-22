#
# COMP1521 Lab 04 Exercise - MIPS Sieve
#
# Sieve of Eratosthenes
# https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 10/10/2022
#

# Sieve of Eratosthenes
# https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes

# Constants
ARRAY_LEN = 1000

main:
	# Registers:
	#  - $t0: int i
	#  - $t1: int j
	#  - $t2: intermediate result

prime_slow_loop__init:
	li	$t0, 2					# i = 2;
prime_slow_loop__cond:
	bge	$t0, ARRAY_LEN, prime_slow_loop__end	# while (i < ARRAY_LEN) {

prime_slow_loop__body:
	lb	$t2, prime($t0)
	beqz	$t2, prime_slow_loop__continue		#   if (prime[i]) {

	li	$v0, 1					#     syscall 1: print_int
	move	$a0, $t0				#
	syscall						#     printf("%d", i);

	li	$v0, 11					#     syscall 11: print_char
	li	$a0, '\n'				#
	syscall						#     putchar('\n');

prime_fast_loop__init:
	mul	$t1, $t0, 2				#     j = 2 * i;
prime_fast_loop__cond:
	bge	$t1, ARRAY_LEN, prime_fast_loop__end	#     while (j < ARRAY_LEN) {
	
prime_fast_loop__body:
	sb 	$zero, prime($t1)			#       prime[j] = 0;
	add	$t1, $t1, $t0				#       j += i;
	j	prime_fast_loop__cond			#     }

prime_fast_loop__end:
prime_slow_loop__continue:
	add	$t0, $t0, 1				#     i++;
	j	prime_slow_loop__cond			#   }

prime_slow_loop__end:					# }
	li	$v0, 0
	jr	$ra					# return 0;

	.data
prime:
	.byte	1:ARRAY_LEN				# uint8_t prime[ARRAY_LEN] = {1, 1, ...};