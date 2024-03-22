// Exercise: Print out command line arguments in lower case
// string_to_lower_args.c
//
// This program was written by Shakira Li (z5339356)
// on 27/10/2021
//
// prints out the inputted command line arguments in lowercase letters

#include <stdio.h>
#include <ctype.h>
#include <string.h>

int is_uppercase (int character);

int main (int argc, char *argv[]) {
    int i;
    for (i = 0; i < argc; i++) {

        int j;
        for (j = 0; j < strlen(argv[i]); j++) {
            argv[i][j] = is_uppercase(argv[i][j]);
        }

    }

    for (i = 1; i < argc; i++) {
        printf("%s", argv[i]);
        printf(" ");
    }

    printf("\n");
        
    return 0;
}

int is_uppercase (int character) {
    if (isupper(character)) {
        character = tolower(character);
    }

    return character;
}