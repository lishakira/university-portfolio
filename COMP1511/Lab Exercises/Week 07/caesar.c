// Exercise: Encrypting Text with a Caesar Cipher
// caesar.c
//
// This program was written by Shakira Li (z5339356)
// on 30/10/2021
//
// prints the characters inputted to be its Caesar cipher encrypted version

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

#define MAX_LENGTH 10000
#define ALPHABET 26

int encrypt(int character, int shift);

int main(int argc, char *argv[]) {
    if (argc <= 1) {
        printf("Please enter a number of positions to shift.\n");
        return 0;
    }

    // number of position to shift
    int shift = atoi(argv[argc - 1]) % ALPHABET;

    if (shift < 0) {
        shift = ALPHABET + shift;
    }

    char character[MAX_LENGTH];

    while (fgets(character, MAX_LENGTH, stdin) != NULL) {

        int i;
        for (i = 0; character[i] != '\0'; i++) {
            character[i] = encrypt(character[i], shift);
        }

        printf("%s", character);
    }

    return 0;
}

int encrypt(int character, int shift) {
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

    // finds the index of the character in the alphabet arrays
    int index = -1;
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

    // shifts the alphabet to create an encrypted message
    i = 0;
    while (i < shift) {
        int temp_upper = upper_letters[0];
        int temp_lower = lower_letters[0];

        int j = 0;
        while (j < ALPHABET - 1) {
            upper_letters[j] = upper_letters[j + 1];
            lower_letters[j] = lower_letters[j + 1];
            j++;
        }

        upper_letters[ALPHABET - 1] = temp_upper;
        lower_letters[ALPHABET - 1] = temp_lower;
        i++;
    }
    
    // encrypts the message
    if (isupper(character)) {
        character = upper_letters[index];
    } else if (islower(character)) {
        character = lower_letters[index];
    }

    return character;
}