// Exercise: Word Square
// word_square.c
//
// This program was written by Shakira Li (z5339356)
// on 27/10/2021
//
// prints out the word inputted by n amount of times
// n is the word's length

#include <stdio.h>
#include <string.h>

#define MAX_LENGTH 1024

int main(void) {
    char word[MAX_LENGTH];

    printf("Input word: ");
    fgets(word, MAX_LENGTH, stdin);

    int last_character = strlen(word) - 1;
    if (word[last_character] == '\n') {
        word[last_character] = '\0';
    }

    printf("\n");
    printf("Word square is:\n");

    int i;
    for (i = 0; i < strlen(word); i++) {
        printf("%s", word);
        printf("\n");
    }

    return 0;
}