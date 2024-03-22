//
// COMP1521 Lab 08 Exercise - Create a File of Integers
//
// creates a file containing the specified integers
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 08/11/2022
//

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) { 
    if (argc != 4) {
        fprintf(stderr, "Usage: %s <file> <start> <finish>\n", argv[0]);
        return 1;
    }

    char *pathname = argv[1];
    int start = atoi(argv[2]);
    int finish = atoi(argv[3]);

    FILE *stream = fopen(pathname, "w");
    if (stream == NULL) {
        perror(pathname);
        return 1; 
    }

    int i = start;
    while (i <= finish) {
        fprintf(stream, "%d\n", i); 
        i = i + 1;
    }

    fclose(stream);
        
    return 0; 
}