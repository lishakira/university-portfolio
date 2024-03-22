//
// COMP1521 Laboratory 09 - Print Select Bytes from a File
//
// print the byte that is located at each given possition within the file
//
// Authors:
// Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 10/11/2022
//

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h> 
#include <unistd.h> 
#include <ctype.h> 
#include <sys/types.h> 
#include <sys/stat.h>

int main(int argc, char *argv[]) {
    if (argc < 2) return 1;

    FILE *stream = fopen(argv[1], "r"); 
    if (stream == NULL) {
        perror("fopen");
        return 1; 
    }

    for (size_t i = 2; i < (size_t)argc; i++) { 
        off_t offset = strtol(argv[i], NULL, 10); 
        if (offset < 0) {
            fprintf(stderr, "Offset must be non-negative\n");
            continue; 
        }

        if (fseek(stream, offset, SEEK_SET) != 0) { 
            perror("fseek");
            return 1;
        }  

        int byte = fgetc(stream); 
        if (isprint(byte)) {
            printf("%d - 0x%02X - '%c'\n", byte, byte, byte); 
        } else {
            printf("%d - 0x%02X\n", byte, byte); 
        }
    }
           
    fclose(stream);

    return 0;
}