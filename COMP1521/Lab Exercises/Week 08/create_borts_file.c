//
// COMP1521 Lab 08 Exercise - Create Borts File
//
// creates a file of this name containing the borts in the range provided
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 08/11/2022
//

#include <stdio.h> 
#include <stdlib.h> 
#include <stdint.h>

#define MIN_BORT   0
#define MAX_BORT   (1u << (8 * 2)) - 1

int main(int argc, char *argv[]) { 
    if (argc != 4) {
        fprintf(stderr, "Usage: %s <file> <start> <finish>\n", argv[0]);
        return 1; 
    }

    char *pathname = argv[1];
    uint32_t start = atoi(argv[2]);
    uint32_t finish = atoi(argv[3]);
    FILE *stream = fopen(pathname, "w");

    if (stream == NULL) {
        perror(pathname);
        return 1;
    }

    for (uint32_t i = start; i <= finish; i++) {
        for (int numByte = 2 - 1; numByte >= 0; numByte--) {
            uint8_t byte = i >> (numByte * 8) & 0xFF;
            if (fputc(byte, stream) == EOF) {
                perror("");
                return 1;
            }
        }
    }

    fclose(stream);

    return 0; 
}