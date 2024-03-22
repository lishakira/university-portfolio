// Exercise: Encrypting Text with Substitution Cipher
// substitution.c
//
// This program was written by Shakira Li (z5339356)
// on 01/11/2021
//
// prints the characters inputted to be its substitution cipher version

#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAX_LENGTH 10000
#define ALPHABET 26

int find_index(int character);

int main(int argc, char *argv[]) {
    if (argc <= 1) {
        printf("Please enter alphabet order of your choice.\n");
        return 0;
    } else if (strlen(argv[argc - 1]) != ALPHABET) {
        return 0;
    }

    char sub_lower[ALPHABET] = {0};
    char sub_upper[ALPHABET] = {0};

    // initialise substitution letters
    int j;
    for (j = 0; j < ALPHABET; j++) {
        sub_lower[j] = tolower(argv[argc - 1][j]);
        sub_upper[j] = toupper(argv[argc - 1][j]);
    }

    char character[MAX_LENGTH];

    while (fgets(character, MAX_LENGTH, stdin) != NULL) {
        int i;
        for (i = 0; character[i] != '\0'; i++) {
            int index = find_index(character[i]);

            // encrypts the message
            if (isupper(character[i])) {
                character[i] = sub_upper[index];
            } else if (islower(character[i])) {
                character[i] = sub_lower[index];
            }
        }

        printf("%s", character);
    }

    return 0;
}

int find_index(int character) {
    // finds the index of the character in the alphabet arrays
    int index = -1;
    int letter;
    if (isupper(character)) {
        for (letter = 'A'; letter <= 'Z'; letter++) {
            if (character == letter) {
                letter = 'Z' + 1;
            }
            index++;
        }
    } else if (islower(character)) {
        for (letter = 'a'; letter <= 'z'; letter++) {
            if (character == letter) {
                letter = 'z' + 1;
            }
            index++;
        }
    }

    return index;
}