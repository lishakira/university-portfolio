// Exercise: Remove any duplicate values from an array and write the result
// into another array
// remove_duplicates_function.c
//
// This program was written by Shakira Li (z5339356)
// on 24/10/2021
//
// copies all elements from source, except their duplicates, into destination 
// return the number of elements copied into destination

#include <stdio.h>

#define LENGTH 6
#define TRUE 0
#define FALSE 1

int remove_duplicates(int length, int source[length], int destination[length]);

int main(void) {
    int source[LENGTH] = {3, 1, 4, 1, 5, 9};
    int destination[LENGTH];
    // number of elements in destination
    int num_elements;
    
    num_elements = remove_duplicates(LENGTH, source, destination);
    
    int i = 0;
    printf("destination: ");
    while (i < num_elements) {
        printf("%d, ", destination[i]);
        i++;
    }
    
    printf("\n");
    printf("Number of elements: %d\n", num_elements);

    return 0;
}

int remove_duplicates(int length, int source[length], int destination[length]) {
    int destination_index = 1;
    int num_elements = 1;
    
    destination[0] = source[0];
    
    int array;
    for (array = 1; array < length; array++) {
        int array2;
        int duplicate = FALSE;
        for (array2 = 0; array2 < destination_index; array2++) {
            if (source[array] == destination[array2]) {
                duplicate = TRUE;
            }
        }
        if (duplicate == FALSE) {
            destination[destination_index] = source[array];
            destination_index++;
            num_elements++;
        }
    }

    return num_elements;
}
