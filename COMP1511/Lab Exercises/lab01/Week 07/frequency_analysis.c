// Exercise: Working Out the Letter Frequencies of Text
// frequency_analysis.c
//
// This program was written by Shakira Li (z5339356)
// on 01/11/2021
//
// prints the occurrence frequency for each of the 26 letters of the alphabet

#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAX_LENGTH 10000
#define ALPHABET 26

struct frequency {
    double number;
};

int frequency_count(int character, struct frequency freq[], int length);

int main(void) {

    struct frequency freq[ALPHABET] = {0};
    double length = 0;
    int letter;
    char character [MAX_LENGTH];

    while (fgets(character, MAX_LENGTH, stdin) != NULL) {

        int i;
        for (i = 0; character[i] != '\0'; i++) {
            if ((character[i] >= 'A' && character[i] <= 'Z') ||
            (character[i] >= 'a' && character[i] <= 'z')) {
                character[i] = tolower(character[i]);

                length = frequency_count(character[i], freq, length);
            }
        }
    }

    int index = -1;
    for (letter = 'a'; letter <= 'z'; letter++) {
        index++; 

        printf("'%c' %.6f %.0f\n", letter, freq[index].number / length, 
               freq[index].number);
    }

    return 0;
}

int frequency_count(int character, struct frequency freq[], int length) {
    int index = -1;
    int letter;
    for (letter = 'a'; letter <= 'z'; letter++) {
        index++;

        if (character == letter) {
            freq[index].number++;
            length++;
        }
        
    }

    return length;
}