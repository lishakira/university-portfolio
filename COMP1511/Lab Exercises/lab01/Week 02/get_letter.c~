// z5339356
// reads in a character and an integer
// assumptions: always given character first and a whole number second 
// Written on 21/09/2021 
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511 
// Exercise: Print Letters, Given Their Numbers

#include <stdio.h>

int main(void) {

    char uppercase;
    int index;
    int letter;
    printf("Uppercase: ");
    scanf("%c", &uppercase);
    if (uppercase != 'y' && uppercase != 'n') {
        printf("You need to enter 'y' or 'n'\n");
        printf("Exiting the program with error code 1\n");
    } else {
        printf("Index: ");
        scanf("%d", &index);
        if (index < 1 || index > 26) {
            printf("You need to enter a number between 1 and 26 inclusive\n");
            printf("Exiting the program with error code 2\n");
        } else if (uppercase == 'y') {
            letter = index + 'A' - 1;
            printf("The letter is %c\n", letter);
        } else {
            letter = index + 'a' - 1;
            printf("The letter is %c\n", letter);
        }
    }

    return 0;
}
