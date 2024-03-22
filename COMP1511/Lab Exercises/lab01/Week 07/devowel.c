// Exercise: Devowelling Text
// devowel.c
//
// This program was written by Shakira Li (z5339356)
// on 27/10/2021
//
// prints the same characters inputted but without the lowercase vowels

#include <stdio.h>
#include <ctype.h>

int is_vowel(int character);

int main (void) {
    int character;

    character = getchar();

    while (character != EOF) {

        if (is_vowel(character) == 0) {
            putchar(character);
        }

        character = getchar();
    }
}

int is_vowel(int character) {
    if (islower(character)) {
        if (character == 'a' || character == 'e' || 
            character == 'i' || character == 'o' || 
            character == 'u') {
            return 1;
        }
    }

    return 0;
}