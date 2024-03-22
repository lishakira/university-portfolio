// Exercise: Decrypting a Substitution Cipher
// decode.c
//
// This program was written by Shakira Li (z5339356)
// on 01/11/2021
//
// prints the input to be its decrypted substitution cipher version

#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAX_LENGTH 10000
#define ALPHABET 26

struct letters {
    char lower;
    char upper;
};

int find_index(int character, struct letters sub[]);

int main(int argc, char *argv[]) {
    if (argc <= 1) {
        printf("Please enter alphabet order of your choice.\n");
        return 0;
    } else if (strlen(argv[argc - 1]) != ALPHABET) {
        return 0;
    }

    char upper_letters[ALPHABET] = {0};
    char lower_letters[ALPHABET] = {0};

    // initialise letters
    int letter = 'A';
    int i = 0;
    while (letter <= 'Z') {
        upper_letters[i] = letter; 
        i++;
        letter++;
    }

    letter = 'a';
    i = 0;
    while (letter <= 'z') {
        lower_letters[i] = letter; 
        i++;
        letter++;
    }

    struct letters sub[ALPHABET] = {0};

    // initialise substitution letters
    int j;
    for (j = 0; j < ALPHABET; j++) {
        sub[j].lower = tolower(argv[argc - 1][j]);
        sub[j].upper = toupper(argv[argc - 1][j]);
    }

    char character[MAX_LENGTH];

    while (fgets(character, MAX_LENGTH, stdin) != NULL) {
        for (i = 0; character[i] != '\0'; i++) {
            int index = find_index(character[i], sub);

            // encrypts the message
            if (isupper(character[i])) {
                character[i] = upper_letters[index];
            } else if (islower(character[i])) {
                character[i] = lower_letters[index];
            }
        }

        printf("%s", character);
    }

    return 0;
}

int find_index(int character, struct letters sub[]) {
    // finds the index of the character in the alphabet arrays
    int index = -1;
    int j;
    if (isupper(character)) {
        for (j = 0; j < ALPHABET; j++) {
            if (character == sub[j].upper) {
                j = ALPHABET;
            }
            index++;
        }
    } else if (islower(character)) {
        for (j = 0; j < ALPHABET; j++) {
            if (character == sub[j].lower) {
                j = ALPHABET;
            }
            index++;
        }
    }

    return index;
}