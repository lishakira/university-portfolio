//
// COMP1521 Lab 01 Exercise - (Dis)Proving the Collatz Conjecture
//
// prints the collatz chain for a positive integer
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 20/09/2022
//

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
	if (argc == 1) {
		printf("Usage: ./collatz NUMBER\n");
		return EXIT_SUCCESS;
	}

	int collatz = atoi(argv[1]);
	while (collatz != 1) {
		printf("%d\n", collatz);

		if (!(collatz % 2)) {
			collatz /= 2;
		} else {
			collatz = (3 * collatz) + 1;
		}
	}

	printf("%d\n", collatz);

	return EXIT_SUCCESS;
}
