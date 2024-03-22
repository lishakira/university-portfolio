//
// COMP1521 Lab 08 Exercise - Extract ASCII from a Binary File
//
// read a file, and print all sequences of length 4 or longer of consecutive 
// byte values corresponding to printable ASCII characters
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
#include <ctype.h>

int main(int argc, char *argv[]) {
    for (int arg = 1; arg < argc; arg++) {
        char *pathname = argv[arg];
        FILE *stream = fopen(pathname, "r");

        if (stream == NULL) {
            perror(pathname);
            return 1;
        }

        uint8_t buffer[4 - 1]; 
        size_t numChar = 0;
        int byte = 0;
        while ((byte = fgetc(stream)) != EOF) {
            if (isprint(byte)) {
                if (numChar < 4 - 1) {
                    buffer[numChar] = byte; 
                } else if (numChar == 4 - 1) {
                    fwrite(buffer, sizeof buffer[0], 4 - 1, stdout);
                    fputc(byte, stdout);
                } else {
                    fputc(byte, stdout);
                }

                numChar++;
            } else {
                if (numChar >= 4) printf("\n");
                numChar = 0;
            }
        }

        if (numChar > 4) printf("\n"); 
        fclose(stream);
    }

    return 0; 
}