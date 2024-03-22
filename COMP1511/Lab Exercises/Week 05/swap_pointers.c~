// Exercise: Using pointers and a function to swap number values
// swap_pointers.c
//
// This program was written by Shakira Li (z5339356)
// on 23/10/2021
//
// reads two pointers to integers, then swaps the stored values in them

#include <stdio.h>

void swap_pointers(int *a, int *b);

// This is a simple main function which could be used
// to test your swap_pointers function.
// It will not be marked.
// Only your swap_pointers function will be marked.

int main(void) {
    int first = 1;
    int second = 2;
    
    swap_pointers(&first, &second);
    
    printf("%d, %d\n", first, second);
    return 0;
}

// swap the values in two integers, given as pointers
void swap_pointers(int *a, int *b) {
    // PUT YOUR CODE HERE (you must change the next line!)
    
    int temp = *a;
    
    *a = *b;
    *b = temp;
}
