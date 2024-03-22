//
// COMP1521 Lab 01 Exercise - Remove All Vowels from STDIN
//
// outputs the stdin's consonants only
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 13/09/2022
//

#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void) {
	char ch;	// character
	while (scanf("%c", &ch) != EOF) {
		if (tolower(ch) != 'a' && tolower(ch) != 'e' &&
			tolower(ch) != 'i' && tolower(ch) != 'o' &&
			tolower(ch) != 'u') {
			printf("%c", ch);
		}
	}

	return 0;
}
