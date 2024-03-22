//
// COMP1521 Lab 08 Exercise - Create a Binary File
//
// create a file of the specified name, containing the specified bytes
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
    if (argc < 2) {
        fprintf(stderr, "Usage: %s: <file> <byte0> <byte1> ...\n", argv[0]);
        return 1;
    }
    
    FILE *stream = fopen(argv[1], "w");
    if (stream == NULL) {
        fprintf(stderr, "%s: ", argv[0]);
        perror(argv[1]);
        return 1;
    }

    for (int i = 2; i < argc; i++) { 
        char *endptr;
        long l = strtol(argv[i], &endptr, 0);
        if (argv[i][0] == '\0' || *endptr != '\0' || l < 0 || l > 255) { 
            fprintf(stderr, "%s: Invalid byte value '%s'\n", argv[0], argv[i]);
            return 1; 
        }

        if (fputc((int)l, stream) == EOF) { 
            fprintf(stderr, "%s: ", argv[0]); 
            perror(argv[1]);
            return 1;
        } 
    }

    fclose(stream);
    return 0; 
}