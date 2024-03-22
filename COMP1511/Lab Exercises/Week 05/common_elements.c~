// Exercise: Find any elements that are the same in two arrays and make a new
// array with them
// common_elements.c
//
// This program was written by Shakira Li (z5339356)
// on 23/10/2021
//
// copy all of the values in source1 which are also found in source2 into destination
// return the number of elements copied into destination

#include<stdio.h>

#define LENGTH 6

int common_elements(int length, int source1[length], int source2[length], int destination[length]);

int main(void) {
    int source1[LENGTH] = {1, 4, 1, 5, 9, 2};
    int source2[LENGTH] = {1, 1, 8, 2, 5, 3};
    int destination[LENGTH];
    int found_match;
    
    found_match = common_elements(LENGTH, source1, source2, destination);
    
    int i = 0;
    printf("destination:");
    while (i < found_match) {
        printf("%d, ", destination[i]);
        i++;
    }
    
    printf("\n");
    printf("Found match: %d\n", found_match);
    
    return 0;
}

int common_elements(int length, int source1[length], int source2[length], 
                    int destination[length]) {
    // PUT YOUR CODE HERE (you must change the next line!)
    
    int destination_index = 0;
    int found_match = 0;
    
    int array1;
    for (array1 = 0; array1 < length; array1++) {
        int array2;
        for (array2 = 0; array2 < length; array2++) {
            if (source1[array1] == source2[array2]) {
                destination[destination_index] = source1[array1];
                found_match++;
                destination_index++;
                array2 = length;
            }
        }
    }
    
    return found_match;
}

// You may optionally add a main function to test your common_elements function.
// It will not be marked.
// Only your common_elements function will be marked.
