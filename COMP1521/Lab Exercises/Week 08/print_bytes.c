//
// COMP1521 Lab 08 Exercise - Print the Bytes of A File
//
// read the specifed file and print one line for each byte of the file
// line should show the byte in decimal and hexadecimal
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 08/11/2022
//

#include <stdio.h> 
#include <stdlib.h> 
#include <ctype.h>

int main(int argc, char *argv[]) {
    for (int i = 1; i < argc; i++) {
        char *pathname = argv[i];
        FILE *stream = fopen(pathname, "r");

        if (stream == NULL) {
            perror(pathname);
            return 1;
        }

        size_t numBytes = 0;
        int byte;
        while ((byte = fgetc(stream)) != EOF) {
            printf("byte %4ld: %3d 0x%02x", numBytes, byte, byte);

            if (isprint(byte)) printf(" '%c'", byte);
            printf("\n");
            numBytes++;
        }

        fclose(stream);
    }

    return 0; 
}