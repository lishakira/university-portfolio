//
// COMP1521 Lab 01 Exercise - Transform All Uppercase letters to Lowercase
//
// outputs in all lowercase letters
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 13/09/2022
//

#include <stdio.h>
#include <ctype.h>

int main(void) {
	int ch = getchar();

	while (ch != EOF) {
		if (ch == toupper(ch)) {
			ch = tolower(ch);
		}

		putchar(ch);
		ch = getchar();
	}

	return 0;
}
