// z5339356
// prints a sawtooth pattern using asterisks
// Written on 29/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Sawtooth

#include <stdio.h>

int main(void) {

    int height;
    int length;
    // for height
    int counter_h = 0;
    // for length
    int counter_l = 0;
    
    printf("Please enter the height of the sawtooth: ");
    scanf("%d", &height);
    printf("Please enter the length of the sawtooth: ");
    scanf("%d", &length);
    
    while (counter_h < height) {
        while (counter_l < length) {
            if (counter_l % height == 0 || counter_l % height == counter_h) {
                printf("*");   
            } else {
                printf(" ");
            }
            counter_l = counter_l + 1;
        }
        printf("\n");
        counter_l = 0;
        counter_h = counter_h + 1;
    }

    return 0;
}
