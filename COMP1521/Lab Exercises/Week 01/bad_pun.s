#
# COMP1521 Lab 01 Exercise - Do You MIPS me?
#
# MIPS assembler program equivalent to this C program:
#
# int main(void)
# {
#   printf("Well, this was a MIPStake!\n");
#
#   return 0;
# }
#
# Author: Shakira Li (z5339356@unsw.edu.au)
#
#
#
# Written: 20/09/2022
#

main:
	la	$a0, line   # load the string at location "line" to "$a0"
	li 	$v0, 4      # print the string
	syscall

	li 	$v0, 0      # return 0;     
	jr	$ra     

.data
	line: .asciiz "Well, this was a MIPStake!\n"