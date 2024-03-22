// z5339356
// prints 36 0's except at the given indices, which will print 1
// Written on 08/10/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Scan in indices and replace corresponding elements

#include <stdio.h>

#define SIZE 36

int main(void) {

    int value;
    int position[SIZE];
    int result[SIZE];
    
    int i = 0;
    while (i < SIZE) {
        position[i] = i;
        result[i] = 0;
        i++;
    }
    
    while (scanf("%d", &value) != EOF) {
        if (value == position[value]) {
            result[value] = 1;
        }
    }
    
    i = 0;
    while (i < SIZE) {
        printf("%d ", result[i]);
        i++;
    }
    printf("\n");

    return 0;

}
