//
// COMP1521 Lab 01 Exercise - Pretty Print Command Line Arguments
//
// command line arguments are "pretty printed"
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 20/09/2022
//

#include <stdio.h>

int main(int argc, char *argv[]) {	
	if (argc >= 1) {
		printf("Program name: %s\n", argv[0]);
	}

	if (argc > 1) {
		printf("There are %d arguments:\n", argc - 1);

		for (int i = 1; i < argc; i++) {
			printf("\tArgument %d is \"%s\"\n", i, argv[i]);
		}
		
	} else if (argc == 1) {
		printf("There are no other arguments\n");
	}

	return 0;
}
