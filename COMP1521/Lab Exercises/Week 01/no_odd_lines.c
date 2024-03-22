//
// COMP1521 Lab 01 Exercise - Remove Uneven Lines of Input
//
// only print lines with an even number of characters to stdout
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 20/09/2022
//

#include <stdio.h>
#include <string.h>

int main(void) {
	char input[1024];

	while (fgets(input, 1024, stdin)) {
		if (!(strlen(input) % 2)){
			fputs(input, stdout);
		}
	}

	return 0;
}
