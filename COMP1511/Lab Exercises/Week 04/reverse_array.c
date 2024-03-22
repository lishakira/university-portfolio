// z5339356
// prints a set of integers in reverse order 
// Written on 09/10/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Reverse an array

#include <stdio.h>

int main(void) {

    int value;

    printf("Enter numbers forwards:\n");
    
    int i = 0;
    int arr[100] = {0};
    while (scanf("%d", &value) != EOF) {
        arr[i] = value;
        i++;
    }
    
    int total = i;
    int j = 0;
    int num = 0;
    while (j < i) {
        num = arr[j];
        arr[j] = arr[i - 1];
        arr[i - 1] = num;
        j++;
        i--;
    }
    
    printf("Reversed:\n");
    
    j = 0;
    while (j < total) {
        printf("%d\n", arr[j]);
        j++;
    }
    return 0;

}
